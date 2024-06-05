import axios from "axios";
import { mutate } from "swr";

export const sendImportTransactionsRequest = async (file: File, url: string, token: string | null) => {
    const formData = new FormData();
    formData.append('file', file);

    await axios
        .post("http://localhost:8080/api/transactions/import", formData, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data"
            },
        })
        .then((response) => console.log(response.data))
        .catch((error) => console.error(error));

    mutate(url);
}