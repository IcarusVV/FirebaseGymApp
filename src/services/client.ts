import axios from "axios";

const apiClient = axios.create({
  baseURL: "https://gymappbackend-ow5f.onrender.com/api",
  headers: { "Content-Type": "application/json" },
});

export default apiClient;
