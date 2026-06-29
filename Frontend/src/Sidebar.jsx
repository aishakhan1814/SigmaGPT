import "./Sidebar.css";
import { useContext, useEffect } from "react";
import { MyContext } from "./MyContext.jsx";
import { v1 as uuidv1 } from "uuid";
import { Plus, Trash2 } from "lucide-react";
function Sidebar() {
    const {
        allThreads,
        setAllThreads,
        currThreadId,
        setNewChat,
        setPrompt,
        setReply,
        setCurrThreadId,
        setPrevChats
    } = useContext(MyContext);

    const getAllThreads = async () => {
        try {
const response = await fetch(`${import.meta.env.VITE_API_URL}/api/thread`, { credentials: "include" });            const res = await response.json();
            const filteredData = res.map(thread => ({ threadId: thread.threadId, title: thread.title }));
            console.log(filteredData);
            setAllThreads(filteredData);
        } catch (err) {
            console.log("Failed to fetch threads:", err);
        }
    };

    useEffect(() => {
        getAllThreads();
    }, [currThreadId]);

    const createNewChat = () => {
        setNewChat(true);
        setPrompt("");
        setReply(null);
        setCurrThreadId(uuidv1());
        setPrevChats([]);
    };

    const changeThread = async (newThreadId) => {
        setCurrThreadId(newThreadId);
        setNewChat(false);

        try {
const response = await fetch(`${import.meta.env.VITE_API_URL}/api/thread/${newThreadId}`, { credentials: "include" });            const messages = await response.json();
            setPrevChats(messages || []);
            setReply(null);
        } catch (err) {
            console.log(err);
        }
    };

    const deleteThread = async (threadId) => {
        try {
await fetch(`${import.meta.env.VITE_API_URL}/api/thread/${threadId}`, { method: "DELETE", credentials: "include" });            setAllThreads(prev => prev.filter(t => t.threadId !== threadId));

            if (threadId === currThreadId) {
                createNewChat();
            }
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <section className="sidebar">
            <button onClick={createNewChat} className="new-chat-btn">
                <Plus size={16} />
                <span>New Chat</span>
            </button>

            <ul className="history">
                {allThreads?.map((thread) => (
                    <li
                        key={thread.threadId}
                        onClick={() => changeThread(thread.threadId)}
                        className={thread.threadId === currThreadId ? "highlighted" : " "}
                    >
                        {thread.title}
                        <Trash2
                            size={14}
                                className="deleteIcon"

                            onClick={(e) => {
                                e.stopPropagation();
                                deleteThread(thread.threadId);
                            }}
                        />
                    </li>
                ))}
            </ul>

            <div className="sign">
                <p>By ApnaCollege ❤️</p>
            </div>
        </section>
    );
}

export default Sidebar;