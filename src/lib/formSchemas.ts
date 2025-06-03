
import { z } from 'zod';
import type { TFunction } from 'i18next';
import { educationLevels, grades, inquiryCategories, MAX_FILE_SIZE, ALLOWED_FILE_TYPES } from '@/lib/data/formData';

// Base schema structure for type inference (client-side: file is FileList-like)
const clientSchemaStructure = {
  name: z.string(),
  surname: z.string(),
  tcNo: z.string().optional(),
  passportNo: z.string(),
  citizenship: z.string(),
  city: z.string(),
  university: z.string(),
  educationLevel: z.enum(educationLevels),
  faculty: z.string(),
  department: z.string(),
  grade: z.enum(grades),
  email: z.string().email(),
  whatsappPhoneNumber: z.string().optional(), // Added
  category: z.enum(inquiryCategories),
  subject: z.string(),
  message: z.string().min(10),
  file: z.any().optional(), // Represents FileList | undefined
  recaptchaToken: z.string(),
};
const clientZodObject = z.object(clientSchemaStructure);
export type ContactFormValues = z.infer<typeof clientZodObject>;

// Base schema structure for type inference (server-side: file is base64 string)
const serverSchemaStructure = {
  ...clientSchemaStructure,
  file: z.string().optional(), // Represents base64 string | undefined
  recaptchaToken: z.string(), 
};
const serverZodObject = z.object(serverSchemaStructure);
export type ServerContactFormValues = z.infer<typeof serverZodObject>;


export const getContactFormSchema = (t: TFunction): typeof clientZodObject => {
  const translatedRequiredString = (fieldKey: string) =>
    z.string({ required_error: t(`contact-form:validation.${fieldKey}Required`) })
     .min(1, { message: t(`contact-form:validation.${fieldKey}Required`) });

  return z.object({
    name: translatedRequiredString('name'),
    surname: translatedRequiredString('surname'),
    tcNo: z.string()
      .optional()
      .refine(val => !val || val.length === 0 || /^\d{11}$/.test(val), {
        message: t("contact-form:validation.tcNoInvalid"),
      }),
    passportNo: translatedRequiredString('passportNo'),
    citizenship: translatedRequiredString('citizenship'),
    city: translatedRequiredString('city'),
    university: translatedRequiredString('university'),
    educationLevel: z.enum(educationLevels, { required_error: t('contact-form:validation.educationLevelRequired') }),
    faculty: translatedRequiredString('faculty'),
    department: translatedRequiredString('department'),
    grade: z.enum(grades, { required_error: t('contact-form:validation.gradeRequired') }),
    email: z.string({ required_error: t('contact-form:validation.emailRequired') })
             .min(1, {message: t('contact-form:validation.emailRequired')}) 
             .email({ message: t('contact-form:validation.emailInvalid') }),
    whatsappPhoneNumber: z.string()
      .optional()
      .refine(val => !val || val.length === 0 || /^\+?[1-9]\d{1,14}$/.test(val), { // Basic E.164 like validation
        message: t("contact-form:validation.whatsappPhoneNumberInvalid")
      }),
    category: z.enum(inquiryCategories, { required_error: t('contact-form:validation.categoryRequired') }),
    subject: translatedRequiredString('subject'),
    message: translatedRequiredString('message').min(10, { message: t('contact-form:validation.messageMin') }),
    file: z.any()
      .refine((files: FileList | undefined) => !files || files.length === 0 || files[0].size <= MAX_FILE_SIZE, t('contact-form:validation.fileTooLarge'))
      .refine((files: FileList | undefined) => !files || files.length === 0 || ALLOWED_FILE_TYPES.includes(files[0].type), t('contact-form:validation.fileInvalidType'))
      .optional(),
    recaptchaToken: z.string().min(1, { message: t('contact-form:validation.recaptchaRequired') }),
  }) as typeof clientZodObject; 
};

export const getServerContactFormSchema = (t: TFunction): typeof serverZodObject => {
  const clientSchemaWithMessages = getContactFormSchema(t);
  const { file: _clientFile, recaptchaToken: _clientRecaptcha, ...restOfClientSchemaFields } = clientSchemaWithMessages.shape;

  return z.object({
    ...restOfClientSchemaFields, 
    file: z.string().optional(), 
    recaptchaToken: z.string({ required_error: t('contact-form:validation.recaptchaRequired') })
                      .min(1, { message: t('contact-form:validation.recaptchaRequired') }), 
  }) as typeof serverZodObject; 
};
