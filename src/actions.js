import axios from "./axios";

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
