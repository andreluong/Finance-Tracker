# Finance Tracker

Finance Tracker is a comprehensive finance tracking application. Keep tabs on your transactions and get a better understanding of your finances.

!["Overview"](/frontend/public/assets/images/overview.png "Overview")

Link: [finance-tracker-weld-gamma.vercel.app](https://finance-tracker-weld-gamma.vercel.app)



## Features

- **Overview**: Get a comprehensive overview of your finances for a specific time period, including key indicators and summaries
- **Data Visualization**: Explore your financial data through visually appealing and interactive charts, allowing for deeper insights and analysis
- **Security**: Data access is secured and authenticated using Clerk middleware
- **Transaction Management**: Streamline transaction management tasks with an intuitive UI featuring interactive tables and forms
- **Flexible Filtering**: Refine your data view with flexible filtering options based on period, type, category, and name
- **Automated Receipt Processing**: Upload your receipt and key information will be extracted using Veryfi to create a new transaction
- **Data Import/Export**: Seamlessly import and export your transactions in CSV format


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
        - Veryfi:
            - `VERYFI_CLIENT_ID`
            - `VERYFI_CLIENT_SECRET`
            - `VERYFI_USERNAME`
            - `VERYFI_API_KEY`
        - `CLIENT_URL` 
            - (e.g., `http://localhost:3000`)
        - `SERVER_PORT` 
            - (e.g., `8080`)
    - Frontend:
        - Clerk Auth:
            - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
            - `CLERK_SECRET_KEY`
        - `NEXT_PUBLIC_SERVER_URL` 
            - (e.g., `http://localhost:8080`)
4. Start development servers
    - Frontend: 
        ```
        npm run dev
        ```
    - Backend: 
        ```
        node server.js
        ```
