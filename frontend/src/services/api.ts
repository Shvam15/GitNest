import axios from "axios";

export type HttpMethod =
    | "GET"
    | "POST"
    | "PUT"
    | "PATCH"
    | "DELETE";

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
    timeout: 10000,
});

// request interceptor
api.interceptors.request.use(
    
    (config) => {
        const token =
            typeof window !== "undefined"
                ? localStorage.getItem("token")
                : null;

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },

    (error) => {
        return Promise.reject(error);
    }
);

export const apiCall = async (
    url: string,
    method: HttpMethod,
    data?: any,
) => {

    try {

        const isFormData =
            typeof FormData !== "undefined" &&
            data instanceof FormData;

        const headers: Record<string, string> = {};

        if (!isFormData) {
            headers["Content-Type"] = "application/json";
        }

        let response;

        switch (method) {

            case "POST":
                response = await api.post(url, data, { headers });
                break;

            case "GET":
                response = await api.get(url, { headers });
                break;

            case "PUT":
                response = await api.put(url, data, { headers });
                break;

            case "PATCH":
                response = await api.patch(url, data, { headers });
                break;

            case "DELETE":
                response = await api.delete(url, { headers });
                break;

            default:
                throw new Error("Invalid HTTP method");
        }

        return response.data;

    } catch (error: any) {

        console.log("API CALL ERROR:", error);

        throw error?.response?.data || error;

    }
};

export default api;