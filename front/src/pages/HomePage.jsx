import React, { useState, useEffect } from "react";
import ChatSidebar from "../components/ChatSidebar";
import ChatWindow from "../components/ChatWindow";
import { createChatSection, getChatHistory } from "../api/chatApi";

const HomePage = () => {
  const [sections, setSections] = useState([]);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(null);

  useEffect(() => {
    const loadChats = async () => {
      const history = await getChatHistory();
      setSections(history);
      if (history.length > 0) setCurrentSectionIndex(0);
    };
    loadChats();
  }, []);

  const handleNewChat = async () => {
    const newSection = await createChatSection("New Chat");
    const updatedSections = [...sections, newSection];
    setSections(updatedSections);
    setCurrentSectionIndex(updatedSections.length - 1);
  };

  return (
    <div className="flex h-screen w-screen">
      <ChatSidebar
        sections={sections}
        onSelect={setCurrentSectionIndex}
        onNewChat={handleNewChat}
        current={currentSectionIndex}
      />
      <ChatWindow
        section={sections[currentSectionIndex]}
        sectionIndex={currentSectionIndex}
        refresh={() => getChatHistory().then(setSections)}
      />
    </div>
  );
};

export default HomePage;


// import React, { useState } from "react";

// function HomePage() {
//   const [message, setMessage] = useState("");
//   const [chat, setChat] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const handleSend = async () => {
//     if (message.trim()) {
//       const userMessage = message;
//       setChat((prev) => [...prev, { text: userMessage, sender: "user" }]);
//       setMessage("");
//       setLoading(true);

//       try {
//         const response = await fetch("http://localhost:5000/predict", {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({ sentence: userMessage }), // sending sentence instead of symptoms list
//         });

//         const data = await response.json();
//         setLoading(false);

//         if (response.ok) {
//           const botMessage = `🩺 Predicted Disease: ${data.predicted_disease}\n💊 Treatment: ${data.treatment_recommendation}`;
//           setChat((prev) => [...prev, { text: botMessage, sender: "bot" }]);
//         } else {
//           setChat((prev) => [...prev, { text: `❌ Error: ${data.error}`, sender: "bot" }]);
//         }
//       } catch (error) {
//         setLoading(false);
//         console.error("❌ Server Error:", error);
//         setChat((prev) => [
//           ...prev,
//           { text: "❌ Server error. Please try again later.", sender: "bot" },
//         ]);
//       }
//     }
//   };

//   const handleVoiceInput = () => {
//     const recognition = new window.webkitSpeechRecognition();
//     recognition.lang = "en-US";
//     recognition.onresult = (event) => {
//       const transcript = event.results[0][0].transcript;
//       setMessage(transcript);
//     };
//     recognition.start();
//   };

//   return (
//     <div className="min-h-screen bg-cover bg-center relative" style={{ backgroundImage: `url('/R.jpg')` }}>
//       <div className="absolute inset-0 bg-white/40 backdrop-md"></div>

//       <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
//         <div className="w-full max-w-3xl bg-white/80 backdrop-blur-xl shadow-xl rounded-xl p-6 flex flex-col">
//           <h1 className="text-3xl font-bold text-red-600 mb-4 text-center">
//             BAYMAX Chat
//           </h1>

//           {/* Chat Box */}
//           <div className="flex-1 overflow-y-auto max-h-[60vh] mb-4 px-1 space-y-2">
//             {chat.map((msg, index) => (
//               <div
//                 key={index}
//                 className={`whitespace-pre-line p-3 rounded-lg max-w-[75%] ${
//                   msg.sender === "user"
//                     ? "bg-red-500 text-white self-end ml-auto"
//                     : "bg-gray-100 text-gray-800 self-start"
//                 }`}
//               >
//                 {msg.text}
//               </div>
//             ))}
//             {loading && (
//               <div className="bg-gray-100 text-gray-800 p-3 rounded-lg max-w-[75%] self-start">
//                 ⏳ Thinking...
//               </div>
//             )}
//           </div>

//           {/* Input */}
//           <div className="flex items-center space-x-2 mt-auto">
//             <textarea
//               value={message}
//               onChange={(e) => setMessage(e.target.value)}
//               placeholder="Type or speak your symptoms..."
//               rows={2}
//               className="flex-1 border border-gray-300 rounded-md p-3 resize-none"
//             />
//             <button
//               onClick={handleSend}
//               className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
//             >
//               Send
//             </button>
//             <button
//               onClick={handleVoiceInput}
//               className="bg-white text-red-500 border border-red-500 px-3 py-2 rounded-md hover:bg-red-100 transition"
//             >
//               🎤
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default HomePage;

// import React, { useState } from "react";

// function HomePage() {
//   const [message, setMessage] = useState("");
//   const [chat, setChat] = useState([]);

//   const handleSend = () => {
//     if (message.trim()) {
//       setChat([...chat, { text: message, sender: "user" }]);
//       setMessage("");

//       setTimeout(() => {
//         setChat((prev) => [
//           ...prev,
//           {
//             text: "I'm Baymax, your healthcare assistant. How can I help you?",
//             sender: "bot",
//           },
//         ]);
//       }, 1000);
//     }
//   };

//   const handleVoiceInput = () => {
//     const recognition = new window.webkitSpeechRecognition();
//     recognition.lang = "en-US";
//     recognition.onresult = (event) => {
//       const transcript = event.results[0][0].transcript;
//       setMessage(transcript);
//     };
//     recognition.start();
//   };

//   return (
//     <div className="min-h-screen bg-cover bg-center relative" style={{ backgroundImage: `url('/R.jpg')` }}>
//       <div className="absolute inset-0 bg-white/40 backdrop-md"></div>

//       <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
//         <div className="w-full max-w-3xl bg-white/80 backdrop-blur-xl shadow-xl rounded-xl p-6 flex flex-col">
//           <h1 className="text-3xl font-bold text-red-600 mb-4 text-center">
//             BAYMAX Chat
//           </h1>

//           {/* Chat Box */}
//           <div className="flex-1 overflow-y-auto max-h-[60vh] mb-4 px-1 space-y-2">
//             {chat.map((msg, index) => (
//               <div
//                 key={index}
//                 className={`p-3 rounded-lg max-w-[75%] ${
//                   msg.sender === "user"
//                     ? "bg-red-500 text-white self-end ml-auto"
//                     : "bg-gray-100 text-gray-800 self-start"
//                 }`}
//               >
//                 {msg.text}
//               </div>
//             ))}
//           </div>

//           {/* Input */}
//           <div className="flex items-center space-x-2 mt-auto">
//             <textarea
//               value={message}
//               onChange={(e) => setMessage(e.target.value)}
//               placeholder="Type or speak your symptoms..."
//               rows={2}
//               className="flex-1 border border-gray-300 rounded-md p-3 resize-none"
//             />
//             <button
//               onClick={handleSend}
//               className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
//             >
//               Send
//             </button>
//             <button
//               onClick={handleVoiceInput}
//               className="bg-white text-red-500 border border-red-500 px-3 py-2 rounded-md hover:bg-red-100 transition"
//             >
//               🎤
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default HomePage;