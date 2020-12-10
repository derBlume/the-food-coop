import axios from "./axios";

export async function getOwnProfile() {
    const { data } = await axios.get("/api/own-profile");
    return {
        type: "GET_OWN_PROFILE",
        profile: data,
    };
}

export async function updateOwnProfile(key, value) {
    await axios.post("/api/update-profile", { key, value });
    return {
        type: "SET_OWN_PROFILE",
        property: { [key]: value },
    };
}

export async function updateProfilePicture(formData) {
    const { data } = await axios.post("/api/upload-profile-picture", formData);

    return {
        type: "SET_OWN_PROFILE",
        property: { profile_picture: data.profile_picture },
    };
}

export async function getFriendships() {
    const { data } = await axios.get(`/api/friendships`);
    return {
        type: "GET_FRIENDSHIPS",
        friendships: data,
    };
}

export async function acceptFriendship(id) {
    await axios.post(`/api/accept-friendship/${id}`);
    return {
        type: "ACCEPT_FRIENDSHIP",
        id,
    };
}

export async function cancelFriendship(id) {
    await axios.post(`/api/cancel-friendship/${id}`);
    return {
        type: "CANCEL_FRIENDSHIP",
        id,
    };
}

export async function setChatMessages(chatMessages) {
    return {
        type: "CHAT_MESSAGES",
        chatMessages,
    };
}

export async function setChatMessage(chatMessage) {
    return {
        type: "CHAT_MESSAGE",
        chatMessage,
    };
}
