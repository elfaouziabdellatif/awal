import { data } from "autoprefixer";
import apiClient from "./apiclient";

export const registerUser = (data) => apiClient.post("/auth/register", data);

  export const loginUser = (data) => apiClient.post("/auth/login", data);

export const fetchMessages = (senderId, recipientId, page) =>
  apiClient.get("/messages", {
    params: {
      sender: senderId,
      recipient: recipientId,
      page,
      limit: 20,
    },
  });

export const sendMessage = (data) => apiClient.post("/send", data);

export const fetchUsers = (user) => apiClient.get("/users", { params: { excludeId: user.id } });
export const markMessagesAsRead = (userId, selectedUserId) =>
  apiClient.post("/messages/mark-as-read", {
    userId,
    selectedUserId,
  }
)

export const createPost = (data) => apiClient.post("/posts", data,
  {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  } 
);

export const fetchPosts = () => apiClient.get("/posts")
export const likePost = (postId,userId) => apiClient.post(`/posts/like`,{postId,userId})
export const commentPost = (postId,userId,comment) => apiClient.post(`/posts/comment`,{postId,userId,comment})
;

