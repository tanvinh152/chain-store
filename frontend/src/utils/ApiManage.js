import axios from "./axios.config";

export const login = (body) => {
  return axios.post("/auth/login", body);
};
