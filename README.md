# Finance Tracker

Finance Tracker is a comprehensive finance tracking application. Keep tabs on your transactions and get a better understanding of your finances.

!["Overview"](/frontend/public/assets/images/overview.png "Overview")

Link: [finance-tracker-weld-gamma.vercel.app](https://finance-tracker-weld-gamma.vercel.app)



## Features

- **Data Visualization**: Interactive charts make it easy to understand your spending trends and identify areas for improvement
- **Transaction Management**: Add, edit, and delete transactions with a user-friendly interface that streamlines data entry
- **Flexible Filtering**: Refine your data view by filtering transactions based on specific criteria like date, type, category, or name
- **Smart Receipt Processing**: Upload a receipt and key information will be extracted to create a new transaction using Google Gemini
- **Data Import/Export**: Seamlessly import and export your transactions in CSV format
- **Security**: Data access is secured and authenticated using Clerk middleware


## Technologies

**Frontend**
- [Next.JS 14.2.3](https://nextjs.org/)
- [TypeScript 5.4.5](https://www.typescriptlang.org/)
- [Tailwind CSS 3.4.3](https://tailwindcss.com/)
- [NextUI 2.4.1](https://nextui.org/)

**Backend**
- [Node.JS 20.9.0](https://nodejs.org/en)
- [Express.JS 4.19.2](https://expressjs.com/)

**Authentication**
- [Clerk 5.0.12](https://clerk.com/)

**Deployment**
- [Vercel](https://vercel.com/home) - Client
- [Google Cloud Run & Cloud Build](https://cloud.google.com/?hl=en) - Server
- [Supabase](https://supabase.com/) - Database


## Setup

1. Clone the repository
    ```
    git clone https://github.com/andreluong/Finance-Tracker.git
    ```

2. Install dependencies for both frontend and backend folders
    ```
    npm install
    ```

3. Create an .env file and add the environment variables:

    **Backend**

    | Variable Name | Required | Description |
    | ------------- | :------: | ----------- |
    | DATABASE_HOST | &#9745; | The hostname or IP address of your database server |
    | DATABASE_NAME | &#9745; | The name of your database |
    | DATABASE_PORT | &#9745; | The port number of your database server |
    | DATABASE_USER | &#9745; | The username for your database |
    | DATABASE_PASSWORD | &#9745; | The password for your database |
    | CLERK_SECRET_KEY | &#9745; | Your Clerk secret key (obtain from your Clerk dashboard) |
    | GEMINI_API_KEY | &#9745; | Your Google Gemini API key (required for receipt processing) |
    | CLERK_PUBLISHABLE_KEY | &#9745; | Your Clerk publishable key (obtain from your Clerk dashboard) |
    | CLIENT_URL | &#9745; | The base URL of your frontend application (e.g., `http://localhost:3000`) |
    | SERVER_PORT | &#9745; | The port number on which your backend server will listen (e.g., `8080`) |
    | GOOGLE_PROJECT_ID | | Your Google Cloud project ID |
    | GOOGLE_APPLICATION_CREDENTIALS | | Path to your Google Cloud service account JSON key file (ignore for production) |
    | GCS_BUCKET_NAME | | The name of your Google Cloud Storage bucket |

    **Frontend**
    | Variable Name | Required | Description |
    | ------------- | :------: | ----------- |
    | NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY | &#9745; | Your Clerk publishable key (obtain from your Clerk dashboard) |
    | CLERK_SECRET_KEY | &#9745; | Your Clerk secret key (obtain from your Clerk dashboard) |
    | NEXT_PUBLIC_SERVER_URL | &#9745; | The base URL of your backend application (e.g., `http://localhost:8080`) |

4. Multer and Google Cloud Storage

    This step allows you to configure receipt and CSV storage using Google Cloud Storage (GCS). If you do not plan on using GCS, you can adjust the Multer configuration for local storage
    
    **Using Local Storage**
    1. In `backend/routes/transactions`, change Multer's storage option to `diskStorage`
    2. Set the `destination` property in the `diskStorage` options to a desired folder. [Multer Documentation](https://expressjs.com/en/resources/middleware/multer.html)
    3. Remove any unnecessary code related to GCS found in `backend/services/transactionsService`

    **Using GCS**
    1. Create a new Google Cloud project
    2. Create a service account with the "Service Account User" role
    3. Generate a JSON key for the service account and download it
    4. Add the JSON key to your project and note its relative path
    5. Add the following GCS-related environment variables to your .env file:
        - `GOOGLE_PROJECT_ID`
        - `GOOGLE_APPLICATION_CREDENTIALS` (path to your service account JSON key; ignore for production)
        - `GCS_BUCKET_NAME`
    6. In `transactionsService.js`, update the storage client to:
        ```
        // Google Cloud Storage
        const { Storage } = require('@google-cloud/storage');
        const storage = new Storage({
            keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
            projectId: process.env.GOOGLE_PROJECT_ID
        });
        const bucket = storage.bucket(process.env.GCS_BUCKET_NAME);
        ```

5. Start development servers
    - Frontend: 
        ```
        npm run dev
        ```
    - Backend: 
        ```
        node server.js
        ```

## Data Privacy

This project uses Clerk for user authentication. Clerks stores your email address and name on their servers. We only access this information to identify you within the application and ensure secure access.

**We do not store any of your uploaded receipts or CSV files**. After processing them to create a transaction, they are immediately and permanently deleted from our Google Cloud Storage.

For more details on Clerk's data practices, please refer to their privacy policy: [Clerk Privacy Policy](https://clerk.com/legal/privacy)
