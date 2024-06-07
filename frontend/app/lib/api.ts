import axios from "axios";
import { mutate } from "swr";

export const sendImportTransactionsRequest = async (file: File, url: string, token: string | null) => {
    const formData = new FormData();
    formData.append('file', file);

    await axios
        .post(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/transactions/import`, formData, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data"
            },
        })
        .then((response) => console.log(response.data))
        .catch((error) => console.error(error));

    mutate(url);
}