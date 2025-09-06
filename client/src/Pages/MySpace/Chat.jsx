import React, { useState, useRef, useEffect } from "react";
import { Search, Users, User, Trash2, Settings, Send, Paperclip, Mic, Smile, MoreVertical } from "lucide-react";

const friendsList = [
  { id: 1, name: "Mical Clark", avatar: "https://i.pravatar.cc/40?img=1", status: "online", lastSeen: "10:00pm" },
  { id: 2, name: "Colin Nathan", avatar: "https://i.pravatar.cc/40?img=2", status: "offline", lastSeen: "9:30pm" },
  { id: 3, name: "Nathan Johen", avatar: "https://i.pravatar.cc/40?img=3", status: "online", lastSeen: "8:45pm" },
  { id: 4, name: "Semi Doe", avatar: "https://i.pravatar.cc/40?img=4", status: "offline", lastSeen: "yesterday" },
  { id: 5, name: "Emma Wilson", avatar: "https://i.pravatar.cc/40?img=5", status: "online", lastSeen: "just now" },
  { id: 6, name: "Alex Johnson", avatar: "https://i.pravatar.cc/40?img=6", status: "online", lastSeen: "2 mins ago" },
];

const Chat = () => {
  const [selectedFriend, setSelectedFriend] = useState(friendsList[0]);
  const [messages, setMessages] = useState([
    { sender: "friend", text: "Hey! What do you think about our plans?", time: "09:25" },
    { sender: "friend", text: "Looks like you have a lot planned!", time: "09:28" },
    { sender: "me", text: "I would suggest you discuss with the team.", time: "09:41" },
    { sender: "friend", text: "That sounds good. Let's schedule a meeting tomorrow.", time: "09:45" },
    { sender: "me", text: "Perfect! I'll send out the invites.", time: "09:46" },
  ]);
  const [input, setInput] = useState("");
  const [chatType, setChatType] = useState("private");
  const [searchQuery, setSearchQuery] = useState("");
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    const newMessage = {
      sender: "me",
      text: input,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages([...messages, newMessage]);
    setInput("");
    
    // Simulate reply after 1-2 seconds
    setTimeout(() => {
      const replies = [
        "That's interesting!",
        "I'll think about it.",
        "Sounds good to me!",
        "Let me check my schedule.",
        "Can we discuss this later?"
      ];
      const randomReply = replies[Math.floor(Math.random() * replies.length)];
      setMessages(prev => [...prev, {
        sender: "friend",
        text: randomReply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    }, 1000 + Math.random() * 1000);
  };

  const handleClear = () => {
    if (window.confirm("Are you sure you want to clear all messages?")) {
      setMessages([]);
    }
  };

  const handleSettings = () => {
    alert("Settings option clicked");
  };

  const handleGroupInfo = () => {
    alert("Group info option clicked");
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  const handleAttachment = () => {
    alert("Attachment option clicked");
  };

  const handleVoiceMessage = () => {
    alert("Voice message option clicked");
  };

  const handleEmoji = () => {
    alert("Emoji picker option clicked");
  };

  const handleMoreOptions = () => {
    alert("More options clicked");
  };

  const filteredFriends = friendsList.filter(friend => 
    friend.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-200 bg-gray-100">
      {/* Sidebar */}
      <div className="w-1/3 border-r border-gray-200 flex flex-col bg-white shadow-md">
        {/* User Profile Header */}
        <div className="flex items-center justify-between p-4 bg-[#00eeff] text-white">
          <div className="flex items-center gap-3">
            <img 
              src="https://i.pravatar.cc/40?img=11" 
              alt="Your profile" 
              className="w-10 h-10 rounded-full border-2 border-white" 
            />
            <p className="font-semibold">Rahul Vasava</p>
          </div>
          <div className="flex gap-4">
            <Users size={20} className="cursor-pointer hover:text-green-100" />
            <MoreVertical size={20} className="cursor-pointer hover:text-green-100" onClick={handleMoreOptions} />
          </div>
        </div>

        {/* Toggle */}
        <div className="flex justify-center gap-2 p-3 bg-white">
          <button
            onClick={() => setChatType("private")}
            className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
              chatType === "private" 
                ? "bg-green-500 text-white shadow-md" 
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            <User size={18} /> Private
          </button>
          <button
            onClick={() => setChatType("group")}
            className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
              chatType === "group" 
                ? "bg-green-500 text-white shadow-md" 
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            <Users size={18} /> Group
          </button>
        </div>

        {/* Search Bar */}
        <div className="px-3 py-2 bg-white">
          <div className="flex items-center bg-gray-100 rounded-lg px-3 py-2 transition-all focus-within:bg-white focus-within:ring-2 focus-within:ring-green-400">
            <Search size={18} className="text-gray-500" />
            <input
              type="text"
              placeholder="Search or start new chat"
              className="ml-2 bg-transparent outline-none text-sm w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Friends List */}
        <div className="flex-1 overflow-y-auto bg-white">
          {filteredFriends.map((friend) => (
            <div
              key={friend.id}
              onClick={() => setSelectedFriend(friend)}
              className={`flex items-center justify-between p-3 cursor-pointer border-b border-gray-100 transition-all hover:bg-green-50 ${
                selectedFriend?.id === friend.id ? "bg-green-50" : ""
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img src={friend.avatar} alt={friend.name} className="w-12 h-12 rounded-full" />
                  <span
                    className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                      friend.status === "online" ? "bg-green-500" : "bg-gray-400"
                    }`}
                  ></span>
                </div>
                <div>
                  <p className="font-medium text-gray-800">{friend.name}</p>
                  <p className="text-xs text-gray-500">
                    {friend.status === "online" ? "Online" : `Last seen ${friend.lastSeen}`}
                  </p>
                </div>
              </div>
              <div className="text-xs text-gray-500">{friend.lastSeen}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Window */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        {selectedFriend && (
          <div className="flex items-center justify-between px-6 py-3 border-b border-gray-200 bg-white shadow-sm">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img src={selectedFriend.avatar} alt={selectedFriend.name} className="w-10 h-10 rounded-full" />
                <span
                  className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                    selectedFriend.status === "online" ? "bg-green-500" : "bg-gray-400"
                  }`}
                ></span>
              </div>
              <div>
                <p className="font-semibold text-gray-800">{selectedFriend.name}</p>
                <p className="text-xs text-gray-500">
                  {selectedFriend.status === "online" ? "Online" : `Last seen ${selectedFriend.lastSeen}`}
                </p>
              </div>
            </div>
            <div className="flex gap-4 text-gray-600">
              <Mic size={20} className="cursor-pointer hover:text-green-500 transition-colors" onClick={handleVoiceMessage} />
              <Users size={20} className="cursor-pointer hover:text-green-500 transition-colors" onClick={handleGroupInfo} />
              <Trash2 size={20} className="cursor-pointer hover:text-red-500 transition-colors" onClick={handleClear} />
              <Settings size={20} className="cursor-pointer hover:text-green-500 transition-colors" onClick={handleSettings} />
            </div>
          </div>
        )}

        {/* Messages */}
        <div 
          className="flex-1 overflow-y-auto p-6 space-y-2 bg-gray-100"
          style={{ backgroundImage: "url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')" }}
        >
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.sender === "me" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`px-4 py-2 rounded-lg max-w-xs lg:max-w-md shadow-sm ${
                  msg.sender === "me"
                    ? "bg-green-100 text-gray-800 rounded-br-none border border-green-200"
                    : "bg-white text-gray-800 rounded-bl-none border border-gray-200"
                }`}
              >
                <p className="text-sm">{msg.text}</p>
                <span className="block text-xs mt-1 text-right text-gray-500 opacity-70">{msg.time}</span>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="flex items-center p-3 border-t border-gray-200 bg-white gap-2">
          <div className="flex items-center gap-1 ml-2">
            <Smile 
              size={20} 
              className="text-gray-500 cursor-pointer hover:text-green-500 transition-colors" 
              onClick={handleEmoji}
            />
            <Paperclip 
              size={20} 
              className="text-gray-500 cursor-pointer hover:text-green-500 transition-colors ml-2" 
              onClick={handleAttachment}
            />
          </div>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            className="flex-1 px-4 py-3 rounded-full border border-gray-300 outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
          />
          {input ? (
            <button
              onClick={handleSend}
              className="p-3 rounded-full bg-green-500 text-white hover:bg-green-600 transition-colors flex items-center justify-center ml-2"
            >
              <Send size={16} />
            </button>
          ) : (
            <button
              onClick={handleVoiceMessage}
              className="p-3 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors flex items-center justify-center ml-2"
            >
              <Mic size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;