'use server';
import { z } from 'zod';
import { useTranslation } from '@/lib/i18n'; // Server-side i18n
import { getServerContactFormSchema, type ServerContactFormValues } from '@/lib/formSchemas';
import { db, storage as firebaseStorage } from '@/lib/firebase/clientApp'; // Firebase app instance
import { collection, addDoc } from 'firebase/firestore';
import { ref as storageRef, uploadString, getDownloadURL } from 'firebase/storage';
import { FirebaseError } from 'firebase/app'; // Import FirebaseError

interface SubmitResult {
  success: boolean;
  message: string; // Can be a translation key
  errors?: z.ZodIssue[];
}

// Helper to get file extension from data URI MIME type
const getFileExtensionFromDataUri = (dataUri: string): string | undefined => {
  const mimeTypeMatch = dataUri.match(/^data:(.+);base64,/);
  if (!mimeTypeMatch || mimeTypeMatch.length < 2) return undefined;
  const mimeType = mimeTypeMatch[1];

  switch (mimeType) {
    case 'image/png': return '.png';
    case 'image/jpeg': return '.jpg';
    case 'image/gif': return '.gif';
    case 'application/pdf': return '.pdf';
    case 'application/msword': return '.doc';
    case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document': return '.docx';
    default: return undefined;
  }
};


export async function submitContactForm(
  data: ServerContactFormValues, 
  locale: string
): Promise<SubmitResult> {
  const { t } = await useTranslation(locale, 'contact-form');
  const currentServerContactFormSchema = getServerContactFormSchema(t);

  // 1. Validate reCAPTCHA token
  if (!data.recaptchaToken) {
    return { success: false, message: 'error.recaptchaFailedServer' };
  }

  try {
    const recaptchaVerifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.NEXT_RECAPTCHA_SECRET_KEY}&response=${data.recaptchaToken}`;
    const recaptchaResponse = await fetch(recaptchaVerifyUrl, { method: 'POST' });
    const recaptchaData = await recaptchaResponse.json();

    if (!recaptchaData.success) {
      console.error('reCAPTCHA verification failed:', recaptchaData['error-codes']);
      return { success: false, message: 'error.recaptchaFailedServer' };
    }
  } catch (recaptchaError) {
    console.error('Error during reCAPTCHA verification:', recaptchaError);
    return { success: false, message: 'error.recaptchaFailedServer' };
  }

  // 2. Validate form data
  try {
    const validatedData = currentServerContactFormSchema.safeParse(data);

    if (!validatedData.success) {
      return {
        success: false,
        message: 'error.message', 
        errors: validatedData.error.issues,
      };
    }

    const { file: fileBase64, recaptchaToken: _token, ...formData } = validatedData.data; 

    let fileUrl: string | undefined = undefined;
    if (fileBase64) {
      try {
        const extension = getFileExtensionFromDataUri(fileBase64) || '.bin'; 
        const safeBaseName = (formData.name || 'untitled').replace(/[^a-zA-Z0-9_.-]/g, '_');
        const uniqueFileName = `contact-form-uploads/${Date.now()}-${safeBaseName}-${Math.random().toString(36).substring(2, 9)}${extension}`;
        const fileStorageReference = storageRef(firebaseStorage, uniqueFileName);

        const uploadResult = await uploadString(fileStorageReference, fileBase64, 'data_url');
        fileUrl = await getDownloadURL(uploadResult.ref);
      } catch (uploadError: unknown) {
        console.error('Detailed Firebase Storage Upload Error:', uploadError);
        if (uploadError instanceof FirebaseError) {
          console.error('Firebase Error Code:', uploadError.code);
          console.error('Firebase Error Message:', uploadError.message);
          switch (uploadError.code) {
            case 'storage/unauthorized':
              return { success: false, message: 'error.fileUploadUnauthorized' };
            case 'storage/unauthenticated':
              return { success: false, message: 'error.fileUploadUnauthenticated' };
            case 'storage/bucket-not-found':
              return { success: false, message: 'error.fileUploadBucketNotFound' };
            case 'storage/project-not-found':
              return { success: false, message: 'error.fileUploadProjectNotFound' };
            case 'storage/quota-exceeded':
              return { success: false, message: 'error.fileUploadQuotaExceeded' };
            case 'storage/invalid-argument':
              return { success: false, message: 'error.fileUploadInvalidArgument'};
            case 'storage/retry-limit-exceeded':
              return { success: false, message: 'error.fileUploadRetryLimitExceeded'};
            case 'storage/cancelled':
              return { success: false, message: 'error.fileUploadCancelled'};
            case 'storage/unknown':
            default:
              return { success: false, message: 'error.fileUploadUnknown'};
          }
        }
        return { success: false, message: 'error.fileUpload' };
      }
    }

    const submissionPayload: Record<string, any> = {
      ...formData, // formData now includes whatsappPhoneNumber if provided
      submissionTimestamp: new Date().toISOString(),
      locale: locale,
    };

    if (fileUrl) {
      submissionPayload.fileUrl = fileUrl;
    }

    await addDoc(collection(db, 'contactSubmissions'), submissionPayload);

    return { success: true, message: 'success.message' };
  } catch (error) {
    console.error('Error submitting contact form to Firestore:', error);
    return { success: false, message: 'error.message' };
  }
}
