# Finance Tracker

A comprehensive finance tracking app. Keep track of your transactions with various tools and charts to gain a better understanding of your finances.

!["Overview"](/frontend/public/assets/images/overview.png "Overview")

Link: [finance-tracker-weld-gamma.vercel.app](https://finance-tracker-weld-gamma.vercel.app)



## Features

- **Overview**: Summary of all transactions over any month and year
- **Smart Receipt Processing**: Upload your receipt to effortlessly create a new transaction with Gemini AI
- **Transaction Management**: Manage and update your transactions with a user-friendly interface
- **Visualize Trends**: Use interactive charts to gain insight of your finances in real-time
- **Budgeting**: Plan your finances to meet your goals
- **CSV Import/Export**: Import and export your transactions in CSV format


## Tech Stack

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
- [Supabase](https://supabase.com/) - Postgres Database
- [Redis Cloud](https://redis.io/) - Caching


## Setup

1. Clone the repository
    ```
    git clone https://github.com/andreluong/Finance-Tracker.git
    ```

2. Install dependencies for both frontend and backend folders
    ```
    npm install
    ```

3. Create an .env file and add the environment variables. Refer to `.env.sample` in `/frontend` and `/backend` for details.

4. Start development servers
    - Frontend: 
        ```
        npm run dev
        ```
    - Backend: 
        ```
        node server.js
        ```
