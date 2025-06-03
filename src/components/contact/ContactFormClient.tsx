
'use client';

import type { ChangeEvent } from 'react';
import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import ReCAPTCHA from 'react-google-recaptcha';

import { useTranslation } from '@/lib/i18n/client';
import { getContactFormSchema, type ContactFormValues } from '@/lib/formSchemas';
import { submitContactForm } from '@/actions/submitContactForm';
import { countriesWithMaarifSchools, turkishCities, universitiesByCity, educationLevels, grades, inquiryCategories, MAX_FILE_SIZE, ALLOWED_FILE_TYPES } from '@/lib/data/formData';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Mail, Loader2 } from 'lucide-react';

interface ContactFormClientProps {
  locale: string;
}

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};


export default function ContactFormClient({ locale }: ContactFormClientProps) {
  const { t } = useTranslation(locale, ['common', 'contact-form']);
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedCity, setSelectedCity] = useState<string | undefined>(undefined);
  const [availableUniversities, setAvailableUniversities] = useState<Array<{ value: string; label: string }>>([]);
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  const contactFormSchemaWithTranslations = getContactFormSchema(t);

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchemaWithTranslations),
    defaultValues: {
      name: '',
      surname: '',
      tcNo: '',
      passportNo: '',
      citizenship: '',
      city: '',
      university: '',
      educationLevel: undefined,
      faculty: '',
      department: '',
      grade: undefined,
      email: '',
      whatsappPhoneNumber: '', // Added
      category: undefined,
      subject: '',
      message: '',
      file: undefined,
      recaptchaToken: '',
    },
  });

  useEffect(() => {
    if (selectedCity) {
      setAvailableUniversities(universitiesByCity[selectedCity] || []);
      form.setValue('university', '');
    } else {
      setAvailableUniversities([]);
    }
  }, [selectedCity, form]);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>, fieldChange: (value: FileList | undefined) => void) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.size > MAX_FILE_SIZE) {
        form.setError('file', { type: 'manual', message: t('contact-form:validation.fileTooLarge') });
        fieldChange(undefined);
        event.target.value = '';
        return;
      }
      if (!ALLOWED_FILE_TYPES.includes(file.type)) {
        form.setError('file', { type: 'manual', message: t('contact-form:validation.fileInvalidType') });
        fieldChange(undefined);
        event.target.value = '';
        return;
      }
      fieldChange(files); 
      form.clearErrors('file');
    } else {
      fieldChange(undefined);
    }
  };

  async function onSubmit(values: ContactFormValues) {
    setIsSubmitting(true);

    let fileBase64: string | undefined = undefined;
    if (values.file && values.file.length > 0) {
      try {
        fileBase64 = await fileToBase64(values.file[0]);
      } catch (error) {
        console.error("Error converting file to base64:", error);
        toast({
          variant: "destructive",
          title: t('contact-form:error.title'),
          description: t('contact-form:error.fileProcessing'),
        });
        setIsSubmitting(false);
        recaptchaRef.current?.reset();
        return;
      }
    }

    if (!values.recaptchaToken) {
        form.setError('recaptchaToken', {type: 'manual', message: t('contact-form:validation.recaptchaRequired')});
        setIsSubmitting(false);
        return;
    }

    const serverData = {
      ...values, 
      file: fileBase64,
    };

    try {
      const result = await submitContactForm(serverData as any, locale); 

      if (result.success) {
        toast({
          title: t('contact-form:success.title'),
          description: t(result.message as any),
        });
        form.reset();
        recaptchaRef.current?.reset();
      } else {
        if (result.errors) {
          result.errors.forEach(err => {
            form.setError(err.path[0] as keyof ContactFormValues, {
              type: 'server',
              message: err.message
            });
          });
        }
        toast({
          variant: "destructive",
          title: t('contact-form:error.title'),
          description: t(result.message as any),
        });
        recaptchaRef.current?.reset(); 
      }
    } catch (error) {
      console.error("Submission error:", error);
      toast({
        variant: "destructive",
        title: t('contact-form:error.title'),
        description: t('contact-form:error.message'),
      });
      recaptchaRef.current?.reset();
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold tracking-tight text-foreground">{t('contact-form:title')}</h1>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Mail className="mr-2 h-6 w-6 text-primary" />
            {t('contact-form:title')}
          </CardTitle>
          <CardDescription>{t('contact-form:description')}</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('contact-form:labels.name')}</FormLabel>
                      <FormControl>
                        <Input placeholder={t('contact-form:placeholders.name')} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="surname"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('contact-form:labels.surname')}</FormLabel>
                      <FormControl>
                        <Input placeholder={t('contact-form:placeholders.surname')} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="tcNo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('contact-form:labels.tcNo')} {t('contact-form:labels.optional')}</FormLabel>
                      <FormControl>
                        <Input placeholder={t('contact-form:placeholders.tcNo')} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="passportNo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('contact-form:labels.passportNo')}</FormLabel>
                      <FormControl>
                        <Input placeholder={t('contact-form:placeholders.passportNo')} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="citizenship"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('contact-form:labels.citizenship')}</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value || undefined}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={t('contact-form:placeholders.citizenship')} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {countriesWithMaarifSchools.map(country => (
                            <SelectItem key={country.value} value={country.value}>{country.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('contact-form:labels.city')}</FormLabel>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value);
                          setSelectedCity(value);
                        }}
                        defaultValue={field.value}
                        value={field.value || undefined}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={t('contact-form:placeholders.city')} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {turkishCities.map(city => (
                            <SelectItem key={city.value} value={city.value}>{city.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="university"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('contact-form:labels.university')}</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value || undefined} disabled={!selectedCity || availableUniversities.length === 0}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={t('contact-form:placeholders.university')} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {availableUniversities.map(uni => (
                            <SelectItem key={uni.value} value={uni.value}>{uni.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="educationLevel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('contact-form:labels.educationLevel')}</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value || undefined}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={t('contact-form:placeholders.educationLevel')} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {educationLevels.map(level => (
                            <SelectItem key={level} value={level}>{t(`contact-form:options.educationLevels.${level}`)}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="faculty"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('contact-form:labels.faculty')}</FormLabel>
                      <FormControl>
                        <Input placeholder={t('contact-form:placeholders.faculty')} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="department"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('contact-form:labels.department')}</FormLabel>
                      <FormControl>
                        <Input placeholder={t('contact-form:placeholders.department')} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="grade"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('contact-form:labels.grade')}</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value || undefined}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={t('contact-form:placeholders.grade')} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {grades.map(grade => (
                            <SelectItem key={grade} value={grade}>{t(`contact-form:options.grades.${grade}`)}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('contact-form:labels.email')}</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder={t('contact-form:placeholders.email')} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="whatsappPhoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('contact-form:labels.whatsappPhoneNumber')}</FormLabel>
                    <FormControl>
                      <Input type="tel" placeholder={t('contact-form:placeholders.whatsappPhoneNumber')} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('contact-form:labels.category')}</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value || undefined}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={t('contact-form:placeholders.category')} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {inquiryCategories.map(cat => (
                          <SelectItem key={cat} value={cat}>{t(`contact-form:options.categories.${cat}`)}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="subject"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('contact-form:labels.subject')}</FormLabel>
                    <FormControl>
                      <Input placeholder={t('contact-form:placeholders.subject')} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('contact-form:labels.message')}</FormLabel>
                    <FormControl>
                      <Textarea placeholder={t('contact-form:placeholders.message')} {...field} rows={5} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="file"
                render={({ field: { onChange, value, ...restField } }) => (
                  <FormItem>
                    <FormLabel>{t('contact-form:labels.fileUpload')}</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        {...restField}
                        ref={restField.ref}
                        onChange={(e) => handleFileChange(e, onChange)}
                      />
                    </FormControl>
                    <FormDescription>{t('contact-form:labels.fileUploadHint')}</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="recaptchaToken"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <ReCAPTCHA
                        ref={recaptchaRef}
                        sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
                        onChange={(token) => {
                          field.onChange(token); 
                          form.trigger('recaptchaToken'); 
                        }}
                        onExpired={() => {
                           field.onChange(''); 
                           form.trigger('recaptchaToken');
                           recaptchaRef.current?.reset();
                        }}
                        onError={() => {
                           field.onChange(''); 
                           form.trigger('recaptchaToken');
                           toast({
                            variant: "destructive",
                            title: t('contact-form:error.title'),
                            description: t('contact-form:validation.recaptchaRequired'), // Using recaptchaRequired as a generic client-side failure message
                           });
                           recaptchaRef.current?.reset();
                        }}
                      />
                    </FormControl>
                    <FormMessage /> 
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isSubmitting} className="w-full md:w-auto">
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isSubmitting ? t('contact-form:buttons.submitting') : t('contact-form:buttons.submit')}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
