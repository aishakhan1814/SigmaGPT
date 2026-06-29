import './App.css';
import Sidebar from "./Sidebar.jsx";
import ChatWindow from "./ChatWindow.jsx";
import Auth from "./Auth.jsx";
import {MyContext} from "./MyContext.jsx";
import { useState, useEffect } from 'react';
import {v1 as uuidv1} from "uuid";
import { useAuth } from "./AuthContext.jsx";

function App() {
  const { user, authLoading } = useAuth();
  const [prompt, setPrompt] = useState("");
  const [reply, setReply] = useState(null);
  const [currThreadId, setCurrThreadId] = useState(uuidv1());
  const [prevChats, setPrevChats] = useState([]); //stores all chats of curr threads
  const [newChat, setNewChat] = useState(true);
  const [allThreads, setAllThreads] = useState([]);

  useEffect(() => {
    // Whenever the logged-in user changes (login or logout), wipe any
    // leftover chat state from the previous session so it can't leak
    // into the next person's view.
    setPrompt("");
    setReply(null);
    setPrevChats([]);
    setNewChat(true);
    setAllThreads([]);
    setCurrThreadId(uuidv1());
  }, [user]);

  const providerValues = {
    prompt, setPrompt,
    reply, setReply,
    currThreadId, setCurrThreadId,
    newChat, setNewChat,
    prevChats, setPrevChats,
    allThreads, setAllThreads
  }; 

 if (authLoading) {
    return null;
  }

  if (!user) {
    return <Auth />;
  }

  return (
    <div className='app'>
      <MyContext.Provider value={providerValues}>
          <Sidebar></Sidebar>
          <ChatWindow></ChatWindow>
        </MyContext.Provider>
    </div>
  )
}

export default App
