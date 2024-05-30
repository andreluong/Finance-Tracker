import { useAuth } from "@clerk/nextjs";
import axios from "axios";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export const cn = (...inputs: ClassValue[]) => {
    return twMerge(clsx(inputs));
};

export const fetcher = (url: string) => axios.get(url).then((res) => res.data);

export const fetcherWithToken = (url: string, token: any) =>
    axios
        .get(url, { headers: { Authorization: "Bearer " + token } })
        .then((res) => res.data);
