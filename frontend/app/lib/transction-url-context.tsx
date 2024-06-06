import React, { Dispatch, ReactNode, createContext, useState } from 'react'

interface TransactionContextType {
    URL: string;
    setURL: Dispatch<React.SetStateAction<string>>;
}

const TransactionURLContext = createContext<TransactionContextType | undefined>(undefined);

// Hook to use transaction url context
export function useTransactionURL() {
    const context = React.useContext(TransactionURLContext);
    if (context === undefined) {
        throw new Error('useTransactionURL must be used within a TransactionProvider');
    }
    return context;
}

export default function TransactionURLProvider({ 
    children,
    defaultURL
}: {
     children: ReactNode;
     defaultURL?: string;
}) {
    const [URL, setURL] = useState<string>(defaultURL || "");

    return (
        <TransactionURLContext.Provider value={{ URL, setURL }}>
            {children}
        </TransactionURLContext.Provider>
    )
}
