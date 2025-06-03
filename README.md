# MaarifCompass App

This is the README for the MaarifCompass application, a comprehensive platform built using Next.js, Firebase, and Genkit for AI-powered features. This document provides a detailed overview of the project, its features, setup instructions, code style guidelines, and future plans.

## Project Overview

MaarifCompass aims to provide a central hub for users, offering features like AI assistance, a document center, contact forms, and internationalization. It is designed with a focus on modularity, scalability, and maintainability.

## Features

Based on the project files and the blueprint, the core features include:

- **AI Assistant:** Powered by Genkit, providing interactive assistance. (See `src/ai` and `src/components/ai`)
- **Document Center:** A place to store and manage documents. (See `src/app/[locale]/document-center`)
- **Contact Form:** Allows users to submit inquiries. (See `src/components/contact/ContactFormClient.tsx` and `src/actions/submitContactForm.ts`)
- **Internationalization (i18n):** Supports multiple languages (English and Turkish based on available locales). (See `public/locales` and `src/lib/i18n`)
- **Authentication Context:** Placeholder for user authentication. (See `src/contexts/AuthContext.tsx`)
- **Responsive Design:** Utilizes Tailwind CSS for styling. (See `tailwind.config.ts` and `src/app/globals.css`)
- **Reusable UI Components:** A collection of UI components built using Shadcn UI. (See `src/components/ui`)
- **Firebase Integration:** Likely used for backend services like Firestore (for data storage) and potentially authentication. (See `src/lib/firebase`)
- **Form Handling with Zod:** Using Zod for form schema validation. (See `src/lib/formSchemas.ts`)
- **Utility Functions:** Common utility functions for various tasks. (See `src/lib/utils.ts`)

## Project Structure

The project follows a standard Next.js application structure:

- `src/app`: Contains the application's routes and pages.
    - `[locale]`: Dynamic routing for internationalization.
    - `api`: API routes (not explicitly listed but common in Next.js).
- `src/components`: Reusable React components.
    - `ai`: Components related to the AI assistant.
    - `contact`: Components for the contact form.
    - `layout`: Layout components like Navbar and Footer.
    - `ui`: Shadcn UI components.
- `src/lib`: Helper functions, Firebase setup, and internationalization logic.
- `src/ai`: Genkit configurations and flows.
- `src/actions`: Server actions (e.g., form submission).
- `public`: Static assets, including locale files.

## Setup and Installation

1.  **Clone the repository:**
