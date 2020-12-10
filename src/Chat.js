import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { socket } from "./socket";

export default function Chat() {
    const chatMessages = useSelector((store) => store.chatMessages);
    const chatContainer = useRef();
    const [draft, setDraft] = useState("");

    useEffect(() => {
        chatContainer.current.scrollTop = chatContainer.current.scrollHeight;
    }, [chatMessages]);

    function handleSubmit(event) {
        event.preventDefault();
        socket.emit("sendChatMessage", draft);
        setDraft("");
    }

    return (
        <div className="chat">
            <div className="chat-container" ref={chatContainer}>
                {chatMessages.map((message) => (
                    <div key={message.id} className="chat-message">
                        <strong>
                            {message.first_name} {message.last_name}:
                        </strong>{" "}
                        {message.message} ({message.created_at})
                    </div>
                ))}
            </div>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="message"
                    value={draft}
                    onChange={(event) => setDraft(event.target.value)}
                />
                <button type="submit">send</button>
            </form>
        </div>
    );
}
