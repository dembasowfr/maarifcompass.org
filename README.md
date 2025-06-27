
# MaarifCompass.org

*Guidance and support platform for Türkiye Maarif Vakfı (TMV) alumni studying in Türkiye.*

MaarifCompass is a full-stack web application designed to be a central hub for TMV alumni pursuing higher education in Türkiye. It provides essential resources, support channels, and community information to help students navigate their academic and social lives. The platform features a user-friendly interface and a powerful admin dashboard for content management. MaarifCompass is powered with CompassIA, an AI assistant that provides quick answers to common questions  and guides users to relevant resources based on their inquiries and needs. CompassIA is built using DeepSeek R1 , a state-of-the-art AI model that ensures accurate and helpful responses. It answers questions in both English and Turkish, and only based on the  information available on the MaarifCompass platform, ensuring that users receive relevant and context-specific assistance.

## Table of Contents

- [Features](#features)
  - [User Interface](#user-interface)
  - [Admin Dashboard](#admin-dashboard)
- [Tech Stack](#tech-stack)
- [Live Demo](#live-demo)
- [UI Previews](#ui-previews)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Firebase Setup](#firebase-setup)
- [Environment Variables](#environment-variables)
- [Project Structure](#project-structure)
- [Internationalization (i18n)](#internationalization-i18n)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [License](#license)
- [Acknowledgments](#acknowledgments)

---

## Features

### User Interface

- **Multi-Language Support:** Fully bilingual interface (English & Turkish) using `i18next`.
- **Responsive Design:** A clean, modern UI that works seamlessly on desktop and mobile devices.
- **Google Authentication:** Secure and easy login for users via their Google accounts.
- **Document Center:** A centralized repository for important documents, guides, and forms.
- **News & Events:** Stay updated with the latest news and upcoming events.
- **Opportunities:** A dedicated section for internships, job postings, and other opportunities.
- **Contact Form:** A detailed form for users to submit inquiries, reports, or feedback with optional file uploads.
- **AI Assistant Teaser:** A prominent section guiding users to the AI chatbot for quick answers.

### Admin Dashboard

- **Secure Access:** The admin panel is protected and accessible only to users with an 'admin' role.
- **Content Management (CRUD):**
  - **Documents:** Upload, edit, and delete documents available in the Document Center.
  - **News:** Create and manage news articles.
  - **Events:** Post and update event information.
  - **Opportunities:** Manage career and internship listings.
- **Contact Submissions Management:** View and manage user inquiries submitted through the contact form.
- **User Management:** View all registered users and manage their roles and status (e.g., promote to admin, ban user).
- **Dashboard Overview:** A central dashboard with key statistics and quick links to management sections.

---

## Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) 15 (App Router)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Backend & Database:** [Firebase](https://firebase.google.com/) (Firestore, Authentication, Storage)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **UI Components:** [Shadcn/UI](https://ui.shadcn.com/)
- **Internationalization:** [i18next](https://www.i18next.com/) / `react-i18next`
- **Form Management:** [React Hook Form](https://react-hook-form.com/)
- **Schema Validation:** [Zod](https://zod.dev/)
- **LLM:** [DeepSeek R1](https://deepseek.com/) for AI-powered responses
- **ChromaDB:** [Chroma](https://www.trychroma.com/) for vector storage and retrieval
- **Embeddings:** [BGE-M3](https://huggingface.co/DeepSeek/BGEM3FlagModel) for text embeddings

---

## Live Demo

*A live demo of the application is available at: [MaarifCompass.org](https://www.maarifcompass.org/) (Link not active yet)*

---

## 🎥 UI Previews(Short Youtube Videos)

### 🖼️ User Interface

[![Demo Video 1: No Login Page](https://img.youtube.com/vi/L19AO645J08/0.jpg)](https://www.youtube.com/watch?v=L19AO645J08)  
**Demo Video #1: No Login Page**

[![Demo Video 2: User Authentication](https://img.youtube.com/vi/f7ZNoTkltAk/0.jpg)](https://www.youtube.com/watch?v=f7ZNoTkltAk)  
**Demo Video #2: User Authentication**

[![Demo Video 3: User Functionalities](https://img.youtube.com/vi/wwboa6agXlE/0.jpg)](https://www.youtube.com/watch?v=wwboa6agXlE)  
**Demo Video #3: User Functionalities**

[![Demo Video #4: CompassIA AI Assistant Functionalities](https://img.youtube.com/vi/a67oE3B2ISU/0.jpg)](https://www.youtube.com/watch?v=a67oE3B2ISU)
**Demo Video #4: CompassIA AI Assistant Functionalities**


### 🛠️ Admin Dashboard

[![Demo Video 5: Admin Functionalities](https://img.youtube.com/vi/izClYeY5eQA/0.jpg)](https://www.youtube.com/watch?v=izClYeY5eQA)  
**Demo Video #5: Admin Functionalities**

---


## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or newer)
- A [Firebase](https://firebase.google.com/) project
- `pnpm`, `npm`, or `yarn` for package management

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/dembasowmr/maarif-compass.git
    cd maarif-compass
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    # or
    pnpm install
    ```

3.  **Set up environment variables:**
    Create a `.env.local` file in the root of the project by copying the example file:
    ```bash
    cp .env.example .env.local
    ```
    Populate the `.env.local` file with your Firebase project credentials. See the [Environment Variables](#environment-variables) section for details.

4.  **Run the development server:**
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:3000`.

---

## Firebase Setup

This project requires a Firebase project to handle authentication, database, and file storage.

1.  **Create a Firebase Project:**
    - Go to the [Firebase Console](https://console.firebase.google.com/) and create a new project.

2.  **Create a Web App:**
    - Inside your project, click the "Web" icon (`</>`) to create a new web application.
    - Give it a name and register the app.
    - Firebase will provide you with a `firebaseConfig` object. You will need these values for your `.env.local` file.

3.  **Enable Authentication:**
    - Go to the "Authentication" section in the Firebase console.
    - Click "Get started".
    - On the "Sign-in method" tab, enable the **Google** provider. Provide a project support email when prompted.

4.  **Set up Firestore Database:**
    - Go to the "Firestore Database" section.
    - Click "Create database" and start in **production mode**.
    - Choose a location for your database.
    - **Security Rules:** Go to the "Rules" tab and paste the contents of `securityRules.ts` from this project. This file contains development-ready rules. **These are insecure and must be updated for a production environment.**

5.  **Set up Cloud Storage:**
    - Go to the "Storage" section.
    - Click "Get started" and follow the prompts to create a default storage bucket.
    - **Security Rules:** Go to the "Rules" tab and update the rules to allow reads and writes for authenticated users. A good starting point is:
      ```
      rules_version = '2';
      service firebase.storage {
        match /b/{bucket}/o {
          match /{allPaths=**} {
            allow read, write: if request.auth != null;
          }
        }
      }
      ```

6.  **Generate a Service Account Key (for Admin Actions):**
    - In the Firebase Console, go to "Project settings" (click the gear icon).
    - Go to the "Service accounts" tab.
    - Click "Generate new private key". A JSON file will be downloaded.
    - You will need the contents of this file for the `FIREBASE_SERVICE_ACCOUNT_KEY_BASE64` environment variable.

---

## Environment Variables

You need to create a `.env.local` file in the project root and add the following variables.

```env
# Firebase Client Configuration (from Firebase Console Web App settings)
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=

# Firebase Admin SDK (for server-side actions)
# Base64-encode the entire service account JSON file you downloaded
FIREBASE_SERVICE_ACCOUNT_KEY_BASE64=

# reCAPTCHA Keys (for contact form)
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=
NEXT_RECAPTCHA_SECRET_KEY=

# CompassIA Agent URL (for Phase 2)
NEXT_PUBLIC_COMPASSIA_AGENT_URL=
```

To Base64-encode your service account key, you can use an online tool or run this command in your terminal:
`cat /path/to/your/serviceAccountKey.json | base64` (on macOS/Linux).

---

## Project Structure

The project follows a standard Next.js App Router structure with clear separation of concerns.

```
src
├── app/                  # Next.js App Router: pages and layouts
│   ├── [locale]/         # Handles internationalization (i18n) routes
│   │   ├── (admin)/      # Route group for admin dashboard pages
│   │   └── (main)/       # Route group for main user-facing pages
│   └── layout.tsx        # Root layout
├── actions/              # Server Actions for form submissions and mutations
├── components/           # Reusable React components (UI, layout, etc.)
│   ├── admin/            # Components specific to the Admin Dashboard
│   ├── ai/               # Components for the AI Assistant
│   └── ui/               # Shadcn/UI components
├── contexts/             # React Context providers (e.g., AuthContext)
├── hooks/                # Custom React hooks
├── lib/                  # Helper functions and libraries
│   ├── data/             # Static data for forms (countries, universities)
│   ├── firebase/         # Firebase initialization and services
│   ├── i18n/             # i18next configuration
│   └── utils.ts          # General utility functions
└── public/
    └── locales/          # Translation JSON files (en, tr)
```

---

## Internationalization (i18n)

The application uses `i18next` and `react-i18next` for handling translations.
-   Language files are located in `public/locales/{language_code}/{namespace}.json`.
-   The default namespace is `common`.
-   The `useTranslation` hook is used in components to access translated strings.

---

## Roadmap

This project is planned in multiple phases.

-   **[✔] Phase 1: Core Functionality (Complete)**
    -   User and Admin portals
    -   Authentication
    -   Content Management for documents, news, events, and opportunities
    -   Contact form and submission management

-   **[✔] Phase 2: AI Integration & Enhancements**
    -   Integrate **CompassIA**, a DEEPSEEK POWERED AI chatbot, to provide instant answers to user queries. 
    -   Develop a notification system for users.
    -   Enhance the admin dashboard with more analytics.

-   **[⏳] Phase 3: UI enhancements & optimizations**
    -   Improve the overall user experience with UI refinements.
    -   Optimize performance for faster load times and responsiveness.

-   **[ ] Phase 4: AI Enhancements**
    -   Improve the AI's contextual understanding and response accuracy.
    -   Expand the knowledge base with more documents and resources.
    -   Implement user feedback mechanisms to continuously improve AI responses.

## Contributing

Contributions are welcome! If you have suggestions for improving the platform, please feel free to open an issue or submit a pull request.

1.  **Fork the repository.**
2.  **Create a new branch:** `git checkout -b feature/YourFeatureName`
3.  **Make your changes.**
4.  **Commit your changes:** `git commit -m 'Add some feature'`
5.  **Push to the branch:** `git push origin feature/YourFeatureName`
6.  **Open a pull request.**

---

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

---

## Acknowledgments

-   This project is dedicated to the **Türkiye Maarif Vakfı** and its alumni community.
-   Special thanks to all contributors and stakeholders who support this initiative.
-   Thanks to the open-source community for providing the tools and libraries that make this project possible.
-   Thanks to [DeepSeek](https://deepseek.com/) for providing the R1 AI model used in CompassIA.
-   Thanks to [Shadcn/UI](https://ui.shadcn.com/) for the beautiful UI components.
-   Thanks to [Next.js](https://nextjs.org/) for the powerful framework that powers this application.
-   Thanks to [Firebase](https://firebase.google.com/) for the backend services that power this application.
-   Thanks to [i18next](https://www.i18next.com/) for the internationalization support.
-   Thanks to [React Hook Form](https://react-hook-form.com/) for the form management library.
-   Thanks to [Zod](https://zod.dev/) for the schema validation library.
-   Thanks to all the contributors who have helped make this project better.
