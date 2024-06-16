import axios from "axios";
import { mutate } from "swr";

const sendTransactionsRequest = async (
    type: 'file' | 'image',
    route: string,
    file: File,
    url: string,
    token: string | null
) => {
    const formData = new FormData();
    formData.append(type, file);

    await axios
        .post(`${process.env.NEXT_PUBLIC_SERVER_URL}${route}`,
            formData,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data"
                }
            }
        )
        .then((response) => console.log(response.data))
        .catch((error) => console.error(error.message));

    mutate(url);
};

export const sendProcessCsvRequest = async (file: File, url: string, token: string | null) => {
    await sendTransactionsRequest('file', '/api/transactions/process/csv', file, url, token);
};

export const sendProcessReceiptRequest = async (file: File, url: string, token: string | null) => {
    await sendTransactionsRequest('image', '/api/transactions/process/receipt', file, url, token);
}
