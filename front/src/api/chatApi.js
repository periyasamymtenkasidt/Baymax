import axios from "axios";

const token = localStorage.getItem("token");
const authHeader = { Authorization: `Bearer ${token}` };

const API = axios.create({ baseURL: "http://localhost:5000/api" });

export const createChatSection = async (title) =>
  (await API.post("/chat/section", { title }, { headers: authHeader })).data;

export const getChatHistory = async () =>
  (await API.get("/chat/history", { headers: authHeader })).data;

export const addMessageToChat = async (sectionIndex, sender, text) =>
  (await API.post(
    "/chat/message",
    { sectionIndex, sender, text },
    { headers: authHeader }
  )).data;

export const deleteChatSection = async (sectionIndex) =>
  (await API.delete(`/chat/section/${sectionIndex}`, { headers: authHeader })).data;

export const submitReview = async (rating, comment) =>
  (await API.post(
    "/review",
    { rating, comment },
    { headers: authHeader }
  )).data;
