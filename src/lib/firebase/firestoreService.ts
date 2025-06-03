
// src/lib/firebase/firestoreService.ts
import { db } from '@/lib/firebase/clientApp';
import { collection, getDocs, query, orderBy, Timestamp, doc, getDoc } from 'firebase/firestore';

// --- Interfaces for Data Structures ---

interface BaseItem {
  id: string;
  order?: number;
}

export interface DocumentItem extends BaseItem {
  name: string;
  description: string;
  imageUrl: string;
  fileUrl: string;
  imageAiHint?: string;
  textContent?: string; 
  processedTextContent?: string; 
}

export interface HomepageService extends BaseItem {
  title: string;
  description: string;
  iconName: string; // e.g., "BookOpen", "Briefcase"
}

export interface NewsArticle extends BaseItem {
  title: string;
  summary: string;
  imageUrl: string;
  date: string; // Store as ISO string or use Firestore Timestamp
  articleUrl: string;
  imageAiHint?: string;
}

export interface EventItem extends BaseItem {
  title: string;
  summary: string;
  imageUrl: string;
  date: string; // Store as ISO string or use Firestore Timestamp
  eventUrl: string;
  imageAiHint?: string;
}

export interface Announcement extends BaseItem {
  title: string;
  detail: string;
  imageUrl: string;
  date: string; // Store as ISO string or use Firestore Timestamp
  imageAiHint?: string;
}

export interface Opportunity extends BaseItem {
  title: string;
  detail: string;
  imageUrl: string;
  applyUrl: string;
  imageAiHint?: string;
}

// --- Helper Function for Localization ---

const getLocalizedField = (docData: any, fieldPrefix: string, locale: string, fallbackLocale: string = 'en'): string => {
  return docData[`${fieldPrefix}_${locale}`] || docData[`${fieldPrefix}_${fallbackLocale}`] || docData[fieldPrefix] || '';
};

const formatDateFromTimestamp = (timestamp: Timestamp | undefined): string => {
  if (!timestamp) return new Date().toLocaleDateString(); // Fallback or handle as needed
  return timestamp.toDate().toLocaleDateString(); // Simple date string, customize as needed
};


// --- Service Functions ---

export async function getDocuments(locale: string): Promise<DocumentItem[]> {
  try {
    const documentsCol = collection(db, 'documents');
    const q = query(documentsCol, orderBy('order', 'asc'));
    const snapshot = await getDocs(q);
    if (snapshot.empty) {
      console.log('No documents found in Firestore.');
      return [];
    }
    return snapshot.docs.map(docSnap => {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        name: getLocalizedField(data, 'name', locale),
        description: getLocalizedField(data, 'description', locale),
        imageUrl: data.imageUrl || 'https://placehold.co/600x400.png',
        fileUrl: data.fileUrl || '#',
        imageAiHint: data.imageAiHint || 'document',
        order: data.order,
        textContent: data.textContent || undefined,
        processedTextContent: data.processedTextContent || undefined,
      };
    });
  } catch (error) {
    console.error("Error fetching documents from Firestore:", error);
    return [];
  }
}

export async function getDocumentById(id: string, locale: string): Promise<DocumentItem | null> {
  try {
    const docRef = doc(db, 'documents', id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      console.log(`No document found with ID: ${id}`);
      return null;
    }

    const data = docSnap.data();
    return {
      id: docSnap.id,
      name: getLocalizedField(data, 'name', locale),
      description: getLocalizedField(data, 'description', locale),
      imageUrl: data.imageUrl || 'https://placehold.co/600x400.png',
      fileUrl: data.fileUrl || '#',
      imageAiHint: data.imageAiHint || 'document',
      order: data.order,
      textContent: data.textContent || undefined,
      processedTextContent: data.processedTextContent || undefined,
    };
  } catch (error) {
    console.error(`Error fetching document with ID ${id} from Firestore:`, error);
    return null;
  }
}


export async function getHomepageServices(locale: string): Promise<HomepageService[]> {
  try {
    const servicesCol = collection(db, 'homepageServices');
    const q = query(servicesCol, orderBy('order', 'asc'));
    const snapshot = await getDocs(q);
    if (snapshot.empty) {
      console.log('No homepage services found in Firestore.');
      return [];
    }
    return snapshot.docs.map(docSnap => {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        title: getLocalizedField(data, 'title', locale),
        description: getLocalizedField(data, 'description', locale),
        iconName: data.iconName || 'HelpCircle', // Default icon
        order: data.order,
      };
    });
  } catch (error) {
    console.error("Error fetching homepage services from Firestore:", error);
    return [];
  }
}

export async function getNewsArticles(locale: string): Promise<NewsArticle[]> {
  try {
    const newsCol = collection(db, 'newsArticles');
    // Assuming 'date' is a Firestore Timestamp, order descending
    const q = query(newsCol, orderBy('date', 'desc'), orderBy('order', 'asc'));
    const snapshot = await getDocs(q);
     if (snapshot.empty) {
      console.log('No news articles found in Firestore.');
      return [];
    }
    return snapshot.docs.map(docSnap => {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        title: getLocalizedField(data, 'title', locale),
        summary: getLocalizedField(data, 'summary', locale),
        imageUrl: data.imageUrl || `https://placehold.co/600x338.png`,
        date: data.date ? formatDateFromTimestamp(data.date as Timestamp) : 'N/A',
        articleUrl: data.articleUrl || '#',
        imageAiHint: data.imageAiHint || 'news article',
        order: data.order,
      };
    });
  } catch (error) {
    console.error("Error fetching news articles from Firestore:", error);
    return [];
  }
}

export async function getEvents(locale: string): Promise<EventItem[]> {
  try {
    const eventsCol = collection(db, 'events');
    const q = query(eventsCol, orderBy('date', 'desc'), orderBy('order', 'asc'));
    const snapshot = await getDocs(q);
    if (snapshot.empty) {
      console.log('No events found in Firestore.');
      return [];
    }
    return snapshot.docs.map(docSnap => {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        title: getLocalizedField(data, 'title', locale),
        summary: getLocalizedField(data, 'summary', locale),
        imageUrl: data.imageUrl || `https://placehold.co/600x338.png`,
        date: data.date ? formatDateFromTimestamp(data.date as Timestamp) : 'N/A',
        eventUrl: data.eventUrl || '#',
        imageAiHint: data.imageAiHint || 'community event',
        order: data.order,
      };
    });
  } catch (error) {
    console.error("Error fetching events from Firestore:", error);
    return [];
  }
}

export async function getAnnouncements(locale: string): Promise<Announcement[]> {
  try {
    const announcementsCol = collection(db, 'announcements');
    const q = query(announcementsCol, orderBy('date', 'desc'), orderBy('order', 'asc'));
    const snapshot = await getDocs(q);
    if (snapshot.empty) {
      console.log('No announcements found in Firestore.');
      return [];
    }
    return snapshot.docs.map(docSnap => {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        title: getLocalizedField(data, 'title', locale),
        detail: getLocalizedField(data, 'detail', locale),
        imageUrl: data.imageUrl || `https://placehold.co/600x338.png`,
        date: data.date ? formatDateFromTimestamp(data.date as Timestamp) : 'N/A',
        imageAiHint: data.imageAiHint || 'important notice',
        order: data.order,
      };
    });
  } catch (error) {
    console.error("Error fetching announcements from Firestore:", error);
    return [];
  }
}

export async function getOpportunities(locale: string): Promise<Opportunity[]> {
  try {
    const opportunitiesCol = collection(db, 'opportunities');
    const q = query(opportunitiesCol, orderBy('order', 'asc')); // Or by a 'postedDate' field
    const snapshot = await getDocs(q);
    if (snapshot.empty) {
      console.log('No opportunities found in Firestore.');
      return [];
    }
    return snapshot.docs.map(docSnap => {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        title: getLocalizedField(data, 'title', locale),
        detail: getLocalizedField(data, 'detail', locale),
        imageUrl: data.imageUrl || `https://placehold.co/600x338.png`,
        applyUrl: data.applyUrl || '#',
        imageAiHint: data.imageAiHint || 'career growth',
        order: data.order,
      };
    });
  } catch (error) {
    console.error("Error fetching opportunities from Firestore:", error);
    return [];
  }
}
