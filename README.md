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
    - Backend:
        - Database:
            - `DATABASE_HOST`
            - `DATABASE_NAME`
            - `DATABASE_PORT`
            - `DATABASE_USER`
            - `DATABASE_PASSWORD`
        - Clerk Auth:
            - `CLERK_SECRET_KEY`
            - `CLERK_PUBLISHABLE_KEY`
        - Google Cloud Storage
            - `GOOGLE_PROJECT_ID`
            - `GOOGLE_APPLICATION_CREDENTIALS` (path to service account JSON key)
        - Google Gemini:
            - `GEMINI_API_KEY`
        - `CLIENT_URL` (e.g., `http://localhost:3000`)
        - `SERVER_PORT` (e.g., `8080`)
    - Frontend:
        - Clerk Auth:
            - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
            - `CLERK_SECRET_KEY`
        - `NEXT_PUBLIC_SERVER_URL` (e.g., `http://localhost:8080`)
4. Start development servers
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
