import axios from "axios";
import { SERVER_URL, TUAN } from "@env";

const instance = axios.create({
  baseURL: "http://10.90.84.126:5000/api/",
});

export const getDataAPI = async (url, token) => {
  const res = await instance.get(url, {
    headers: { Authorization: token },
  });
  return res;
};

export const postDataAPI = async (url, post, token) => {
  console.log("Server url: ", SERVER_URL);
  console.log(TUAN);

  const res = await instance.post(url, post, {
    headers: { Authorization: token },
  });
  return res;
};

export const putDataAPI = async (url, post, token) => {
  const res = await instance.put(url, post, {
    headers: { Authorization: token },
  });
  return res;
};

export const patchDataAPI = async (url, post, token) => {
  const res = await instance.patch(url, post, {
    headers: { Authorization: token },
  });
  return res;
};

export const deleteDataAPI = async (url, token) => {
  const res = await instance.delete(url, {
    headers: { Authorization: token },
  });
  return res;
};
