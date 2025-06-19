import axios from "axios";

export const axiosInstance = axios.create({
    baseURL: import.meta.env.mode === 'devlopment'?"http://localhost:5001/api":"/api",
    withCredentials: true
})