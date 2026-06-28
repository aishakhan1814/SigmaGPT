import "./ChatWindow.css";
import Chat from "./Chat.jsx";
import { MyContext } from "./MyContext.jsx";
import { useAuth } from "./AuthContext.jsx";
import { useContext, useState, useEffect } from "react";
import { ScaleLoader } from "react-spinners";
import { User, Settings, CloudUpload, LogOut, SendHorizontal } from "lucide-react";
function ChatWindow() {
    const {
        prompt, setPrompt,
        reply, setReply,
        currThreadId,
        prevChats,
        setPrevChats,
        setNewChat,
        setAllThreads,

    } = useContext(MyContext);

    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const { logout } = useAuth();

    const getReply = async () => {
        if (!prompt.trim()) return;

        setLoading(true);
        setNewChat(false);

        const options = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",

            body: JSON.stringify({
                message: prompt,
                threadId: currThreadId
            })
        };

        try {
            const response = await fetch("http://localhost:8080/api/chat", options);
            const res = await response.json();

            setReply(res.reply);

            // Refresh threads so a brand-new chat shows up in the sidebar immediately
            fetch("http://localhost:8080/api/thread", { credentials: "include" })
                .then(r => r.json())
                .then(threads => {
                    if (!Array.isArray(threads)) return; // not logged in yet, or an error came back
                    const filteredData = threads.map(thread => ({
                        threadId: thread.threadId,
                        title: thread.title
                    }));
                    setAllThreads(filteredData);
                });
        } catch (err) {
            console.error(err);
        }
        setLoading(false);
    };

    useEffect(() => {
        if (prompt && reply) {
            setPrevChats(prevChats => (
                [...prevChats,
                { role: "user", content: prompt },
                { role: "assistant", content: reply }
                ]
            ));
            setPrompt("");
        }
    }, [reply]);

    const handleProfileClick = () => setIsOpen(!isOpen);

    return (
        <div className="chatWindow">
            <div className="navbar">
                <span>SigmaGPT</span>
                <div className="userIconDiv" onClick={handleProfileClick}>
                    <span className="userIcon"><User size={16} /></span>
                </div>
            </div>

            {isOpen && (
                <div className="dropDown">
                    <div className="dropDownItem"><Settings size={14} /> Settings</div>
                    <div className="dropDownItem"><CloudUpload size={14} /> Upgrade</div>
<div className="dropDownItem" onClick={logout}><LogOut size={14} /> Logout</div>                </div>
            )}

            <Chat></Chat>

            <div className="loaderWrap">
                <div className="loaderInner">
                    <ScaleLoader color="#fff" loading={loading} />
                </div>
            </div>
            <div className="chatInput">
                <div className="inputBox">
                    <input
                        placeholder="Ask anything"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && getReply()}
                    />
                    <div id="submit" onClick={getReply}>
                        <SendHorizontal size={18} />
                    </div>
                </div>
                <p className="info">
                    SigmaGPT can make mistakes. Check important info.
                </p>
            </div>
        </div>
    );
}

export default ChatWindow;