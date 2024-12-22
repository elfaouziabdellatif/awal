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

