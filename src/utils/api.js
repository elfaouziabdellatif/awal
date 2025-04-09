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


export const fetchSuggestionUsers = (userId) => apiClient.get(`/friendship/suggestions`, { params: { userId: userId } })

export const sendFriendRequest = (userId, friendId) => apiClient.post(`/friendship/send-request`, { userId, friendId })
export const cancelFriendRequest = (userId, friendId) => apiClient.post(`/friendship/cancel-request`, { userId, friendId })
export const acceptFriendRequest = (userId, friendId) => apiClient.post(`/users/request/accept`, { userId, friendId })
export const rejectFriendRequest = (userId, friendId) => apiClient.post(`/users/request/reject`, { userId, friendId })
export const fetchFriendRequests = (userId) => apiClient.get(`/users/requests/${userId}`)


;

