import "./Chat.css";
import React, { useContext, useState, useEffect } from "react";
import { MyContext } from "./MyContext";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";

function Chat() {
    const { newChat, prevChats, reply } = useContext(MyContext);

    const [latestReply, setLatestReply] = useState("");

    useEffect(() => {
        // Reset when starting a new chat
        if (!reply) {
            setLatestReply("");
            return;
        }

        const words = reply.split(" ");
        let index = 0;

        const interval = setInterval(() => {
            setLatestReply(words.slice(0, index + 1).join(" "));
            index++;

            if (index >= words.length) {
                clearInterval(interval);
            }
        }, 30);

        return () => clearInterval(interval);
    }, [reply]);

    return (
        <div className="chat-container">

            {newChat && prevChats.length === 0 && (
                <div className="welcome-center">
                    <h1>Welcome to SigmaGPT</h1>
                    <p>Ask me anything!</p>
                </div>
            )}

            <div className="chats">

                {/* Render all chats except the last assistant reply */}
                {prevChats?.slice(0, -1).map((chat, idx) => (
                    <div
                        key={idx}
                        className={chat.role === "user" ? "userDiv" : "gptDiv"}
                    >
                        {chat.role === "user" ? (
                            <p className="userMessage">{chat.content}</p>
                        ) : (
                            <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                                {chat.content}
                            </ReactMarkdown>
                        )}
                    </div>
                ))}

                {/* Render latest message */}
                {prevChats.length > 0 && (
                    <div
                        className={
                            prevChats[prevChats.length - 1].role === "user"
                                ? "userDiv"
                                : "gptDiv"
                        }
                    >
                        {prevChats[prevChats.length - 1].role === "user" ? (
                            <p className="userMessage">
                                {prevChats[prevChats.length - 1].content}
                            </p>
                        ) : (
                            <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                                {latestReply ||
                                    prevChats[prevChats.length - 1].content}
                            </ReactMarkdown>
                        )}
                    </div>
                )}

            </div>
        </div>
    );
}

export default Chat;