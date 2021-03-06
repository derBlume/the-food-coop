import { connect } from "socket.io-client";

import { setChatMessages, setChatMessage } from "./actions";

export let socket;

//dependency injection (IoC = Inversion of Control)
export function init(store) {
    socket = connect();

    socket.on("chatMessages", (msgs) => {
        store.dispatch(setChatMessages(msgs));
    });

    socket.on("chatMessage", (msg) => {
        store.dispatch(setChatMessage(msg));
    });
}
