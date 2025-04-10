import axios from "axios";
import localforage from "localforage";

let apiURL = process.env.CONTRACT_REST_SERVER
  ? `http://${process.env.CONTRACT_REST_SERVER}/api`
  : "http://localhost:5000/api";
export const serverURL = process.env.CONTRACT_REST_SERVER
  ? `http://${process.env.CONTRACT_REST_SERVER}`
  : "http://localhost:5000";
const axiosInstance = axios.create({
  baseURL: apiURL
});

// Interceptor that looks for a JWT in browser storage and set Authorization header if present
axiosInstance.interceptors.request.use(
  config => {
    return localforage
      .getItem("jwt_token")
      .then(token => {
        // Token is in browser storage, set Authorization header
        config.headers.Authorization = `Bearer ${token}`;
        return Promise.resolve(config);
      })
      .catch(err => {
        console.log("No token found in browser storage.");
        console.log(err);
        delete config.headers.Authorization;
        return config;
      });
  },
  err => {
    console.log("Request error");
    return Promise.reject(err);
  }
);

export default axiosInstance;
