import axios from "axios";

export const axiosInstance = axios.create({
    //diff in prod.
    baseURL: import.meta.env.MODE ==="development"?"http://localhost:5001/api":"/api" ,
    withCredentials: true
})

//console.log(baseURL);
