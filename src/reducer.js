export default function (
    state = {
        chatMessages: [],
    },
    action
) {
    if (action.type === "GET_FRIENDSHIPS") {
        state = { ...state, friendships: action.friendships };
    } else if (action.type === "ACCEPT_FRIENDSHIP") {
        state = {
            ...state,
            friendships: state.friendships.map((friendship) => {
                if (friendship.id === action.id) {
                    return { ...friendship, accepted: true };
                } else {
                    return friendship;
                }
            }),
        };
    } else if (action.type === "CANCEL_FRIENDSHIP") {
        state = {
            ...state,
            friendships: state.friendships.filter(
                (friendship) => friendship.id !== action.id
            ),
        };
    } else if (action.type === "CHAT_MESSAGES") {
        state = {
            ...state,
            chatMessages: action.chatMessages.reverse(),
        };
    } else if (action.type === "CHAT_MESSAGE") {
        state = {
            ...state,
            chatMessages: [...state.chatMessages, ...action.chatMessage],
        };
    }

    return state;
}
