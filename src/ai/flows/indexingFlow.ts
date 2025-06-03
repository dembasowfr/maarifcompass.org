
'use server';
/**
 * @fileOverview A Genkit flow for indexing document content from Firestore for RAG.
 * It downloads and parses PDF/DOCX files, extracts text, and saves the extracted text
 * back to the original document in Firestore to avoid re-parsing on subsequent runs.
 * - runDocumentIndexing - A function to trigger the indexing process for all documents.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { db } from '@/lib/firebase/clientApp';
import {
  collection,
  getDocs,
  addDoc,
  doc as firestoreDoc, // Alias to avoid conflict with 'doc' from snapshot.docs
  updateDoc,
  Timestamp as FirestoreTimestamp,
} from 'firebase/firestore';
import type { DocumentItem } from '@/lib/firebase/firestoreService';
import axios from 'axios';

// Helper to get file extension
const getFileExtension = (filenameOrUrl: string): string => {
  const filename = filenameOrUrl.split('/').pop()?.split('?')[0] || ''; // Get filename from URL
  return filename.split('.').pop()?.toLowerCase() || '';
};

// Simple text chunking function
function chunkText(text: string, chunkSize: number = 1000, overlap: number = 100): string[] {
  const chunks: string[] = [];
  if (!text || typeof text !== 'string') {
    console.warn('chunkText received invalid input:', text);
    return chunks;
  }
  for (let i = 0; i < text.length; i += chunkSize - overlap) {
    chunks.push(text.substring(i, i + chunkSize));
  }
  return chunks;
}

const IndexingStatsSchema = z.object({
  documentsProcessed: z.number(),
  documentsSuccessfullyParsed: z.number(),
  documentsFailedToParse: z.number(),
  documentsUsingCachedText: z.number(),
  chunksCreated: z.number(),
  embeddingsGenerated: z.number(),
  warningMessage: z.string().optional(),
});
export type IndexingStats = z.infer<typeof IndexingStatsSchema>;

const indexDocumentsFlow = ai.defineFlow(
  {
    name: 'indexDocumentsFlow',
    inputSchema: z.void(),
    outputSchema: IndexingStatsSchema,
  },
  async () => {
    console.log('Starting document indexing flow with text caching...');
    const stats: IndexingStats = {
        documentsProcessed: 0,
        documentsSuccessfullyParsed: 0,
        documentsFailedToParse: 0,
        documentsUsingCachedText: 0,
        chunksCreated: 0,
        embeddingsGenerated: 0,
    };

    try {
      const documentsColRef = collection(db, 'documents');
      const documentsSnapshot = await getDocs(documentsColRef);

      if (documentsSnapshot.empty) {
        console.log('No documents found in Firestore to index.');
        return stats;
      }

      const documentChunksColRef = collection(db, 'documentChunks');
      stats.documentsProcessed = documentsSnapshot.docs.length;

      for (const docSnapshot of documentsSnapshot.docs) {
        const documentData = docSnapshot.data() as DocumentItem;
        const docId = docSnapshot.id;
        const docIdentifier = `${docId} ('${documentData.name_en || documentData.name || 'Untitled'}')`;
        console.log(`Processing document: ${docIdentifier}`);

        let extractedText: string | undefined = documentData.processedTextContent;

        if (extractedText && extractedText.trim().length > 0) {
          console.log(`Using cached text for document ${docIdentifier}.`);
          stats.documentsUsingCachedText++;
        } else {
          console.log(`No cached text for ${docIdentifier}. Attempting to download and parse.`);
          if (!documentData.fileUrl) {
            console.warn(`Skipping document ${docIdentifier} due to missing fileUrl.`);
            stats.documentsFailedToParse++;
            continue;
          }

          try {
            console.log(`Attempting to download: ${documentData.fileUrl} for document ${docIdentifier}`);
            const response = await axios.get(documentData.fileUrl, { responseType: 'arraybuffer' });
            const fileBuffer = Buffer.from(response.data);
            const extension = getFileExtension(documentData.fileUrl);

            console.log(`Downloaded file for ${docIdentifier}, extension: ${extension}`);

            if (extension === 'pdf') {
              const pdf = (await import('pdf-parse')).default;
              const data = await pdf(fileBuffer);
              extractedText = data.text;
              console.log(`Successfully parsed PDF: ${docIdentifier}`);
            } else if (extension === 'docx') {
              const mammoth = (await import('mammoth')).default;
              const result = await mammoth.extractRawText({ buffer: fileBuffer });
              extractedText = result.value;
              console.log(`Successfully parsed DOCX: ${docIdentifier}`);
            } else if (documentData.fileUrl.includes('docs.google.com/document')) {
              console.warn(`Google Doc URL detected for ${docIdentifier}. Attempting basic text extraction (might be HTML). Note: For reliable Google Docs parsing, export as .docx or .pdf and use that fileUrl, or manually provide text.`);
              const potentialText = fileBuffer.toString('utf8');
              extractedText = potentialText.replace(/<[^>]*>?/gm, ' ').replace(/\s+/g, ' ').trim();
              console.log(`Attempted text extraction from Google Doc URL for ${docIdentifier}. Review content quality.`);
            } else {
              console.warn(`Unsupported file type or unable to determine type for ${docIdentifier} from URL: ${documentData.fileUrl}. Supported: .pdf, .docx`);
              stats.documentsFailedToParse++;
              continue;
            }

            if (!extractedText || extractedText.trim().length === 0) {
              console.warn(`No text extracted from document ${docIdentifier}.`);
              stats.documentsFailedToParse++;
              continue;
            }

            stats.documentsSuccessfullyParsed++;
            try {
              const docRef = firestoreDoc(db, 'documents', docId);
              await updateDoc(docRef, { processedTextContent: extractedText });
              console.log(`Saved extracted text back to Firestore for document ${docIdentifier}.`);
            } catch (updateError) {
              console.error(`Error saving extracted text for document ${docIdentifier}:`, updateError);
            }
          } catch (parseError: any) {
            console.error(`Error downloading or parsing document ${docIdentifier} from ${documentData.fileUrl}:`, parseError.message || parseError, parseError.stack);
            stats.documentsFailedToParse++;
            continue;
          }
        }

        if (!extractedText || extractedText.trim().length === 0) {
          console.warn(`Skipping document ${docIdentifier} as no text content is available after processing attempts.`);
          continue;
        }
        
        const originalDocName = documentData.name_en || documentData.name || 'Untitled Document';
        const textChunks = chunkText(extractedText);
        stats.chunksCreated += textChunks.length;

        for (const chunk of textChunks) {
          if (chunk.trim().length === 0) continue;

          try {
            const embeddingResponse = await ai.embed({
              model: 'googleai/text-embedding-004',
              content: chunk,
            });
            const embedding = embeddingResponse.embedding;
            stats.embeddingsGenerated++;

            await addDoc(documentChunksColRef, {
              originalDocId: docId,
              originalDocName: originalDocName,
              originalDocFileUrl: documentData.fileUrl,
              chunkText: chunk,
              embedding: embedding,
              indexedAt: FirestoreTimestamp.now(),
            });
          } catch (embedError: any) {
            console.error(`Error generating embedding or saving chunk for document ${docIdentifier}:`, embedError.message || embedError, embedError.stack);
            // Do not increment failed to parse here, as parsing might have succeeded.
            // This error is specific to embedding/saving the chunk.
          }
        }
      }

      console.log('--- Document Indexing Flow Completed ---');
      console.log(`Total Documents Processed: ${stats.documentsProcessed}`);
      console.log(`Successfully Parsed/Content Extracted (this run): ${stats.documentsSuccessfullyParsed}`);
      console.log(`Used Cached Text (already processed): ${stats.documentsUsingCachedText}`);
      console.log(`Failed to Parse/Download: ${stats.documentsFailedToParse}`);
      console.log(`Total Text Chunks Created: ${stats.chunksCreated}`);
      console.log(`Total Embeddings Generated: ${stats.embeddingsGenerated}`);
      console.log('--------------------------------------');

      if (stats.chunksCreated > 0 && stats.embeddingsGenerated === 0) {
        stats.warningMessage = "Warning: Text chunks were created, but no embeddings were generated. Please check your Gemini API key and ensure it's valid and has permissions for the 'text-embedding-004' model. Check server logs for embedding errors.";
        console.warn(stats.warningMessage);
      } else if (stats.chunksCreated === 0 && stats.documentsProcessed > 0 && stats.documentsFailedToParse === stats.documentsProcessed - stats.documentsUsingCachedText) {
        stats.warningMessage = "Warning: No text chunks were created because all new documents failed to parse. Please check document fileUrls and server logs for parsing errors.";
        console.warn(stats.warningMessage);
      }


      return stats;

    } catch (error: any) {
      console.error('Critical error during document indexing flow:', error.message || error, error.stack);
      stats.warningMessage = `Critical flow error: ${error.message || 'Unknown error'}. Check server logs.`;
      // Update failure count based on processed, assuming all non-cached, non-successfully parsed ones failed.
      stats.documentsFailedToParse = stats.documentsProcessed - stats.documentsSuccessfullyParsed - stats.documentsUsingCachedText;
      return stats;
    }
  }
);

export async function runDocumentIndexing(): Promise<IndexingStats> {
  return indexDocumentsFlow();
}
