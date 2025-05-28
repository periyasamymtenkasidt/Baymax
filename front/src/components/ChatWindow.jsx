// import React, { useState } from "react";
// import { addMessageToChat } from "../api/chatApi";

// const ChatWindow = ({ section, sectionIndex, refresh }) => {
//   const [message, setMessage] = useState("");
//   const [loading, setLoading] = useState(false);

//   if (!section) return <div className="flex-1 p-6">Select a chat</div>;

//   const handleSend = async () => {
//     if (message.trim()) {
//       const userMessage = message;
//       setMessage("");
//       setLoading(true);

//       await addMessageToChat(sectionIndex, "user", userMessage);

//       try {
//         const response = await fetch("http://localhost:5001/predict", {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({ sentence: userMessage }),
//         });

//         const data = await response.json();
//         const botText = response.ok
//           ? `🩺 Predicted Disease: ${data.predicted_disease}\n💊 Treatment: ${data.treatment_recommendation}`
//           : `❌ Error: ${data.error}`;

//         await addMessageToChat(sectionIndex, "bot", botText);
//         const utterance = new SpeechSynthesisUtterance(botText.replace(/[\n🔺🩺💊❌]/g, ''));
//         utterance.lang = 'en-US';
//         window.speechSynthesis.speak(utterance);
//       } catch {
//         await addMessageToChat(sectionIndex, "bot", "❌ Server error.");
//         const utterance = new SpeechSynthesisUtterance("Server error occurred.");
//         utterance.lang = 'en-US';
//         window.speechSynthesis.speak(utterance);
//       }

//       setLoading(false);
//       refresh();
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
// <div className="flex-1 flex items-center justify-center h-screen px-4 sm:px-8 md:px-16 bg-gray-100">
//   <div className="w-full max-w-4xl h-[90vh] bg-white shadow-lg rounded-xl overflow-hidden flex flex-col">
//     <div className="flex-1 p-4 flex flex-col">
//       <div className="flex-1 overflow-y-auto mb-4 space-y-2">
//         {section.messages.map((msg, index) => (
//           <div
//             key={index}
//             className={`whitespace-pre-line p-3 rounded-lg max-w-[75%] ${
//               msg.sender === "user"
//                 ? "bg-red-500 text-white self-end ml-auto"
//                 : "bg-gray-100 text-gray-800 self-start"
//             }`}
//           >
//             {msg.text}
//           </div>
//         ))}
//         {loading && (
//           <div className="bg-gray-100 text-gray-800 p-3 rounded-lg max-w-[75%] self-start">
//             ⏳ Thinking...
//           </div>
//         )}
//       </div>

//       <div className="flex items-center space-x-2 mt-2">
//         <textarea
//           value={message}
//           onChange={(e) => setMessage(e.target.value)}
//           placeholder="Type or speak your symptoms..."
//           rows={2}
//           className="flex-1 border border-gray-300 rounded-md p-3 resize-none"
//         />
//         <button
//           onClick={handleSend}
//           className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
//         >
//           Send
//         </button>
//         <button
//           onClick={handleVoiceInput}
//           className="bg-white text-red-500 border border-red-500 px-3 py-2 rounded-md hover:bg-red-100 transition"
//         >
//           🎤
//         </button>
//       </div>
//     </div>
//   </div>
// </div>


//   );
// };

// export default ChatWindow;
import React, { useState } from "react";
import { addMessageToChat,submitReview } from "../api/chatApi";
import { Star } from "lucide-react";
import { toast } from "react-toastify";
import { FaRobot, FaUser } from "react-icons/fa";


const ChatWindow = ({ section, sectionIndex, refresh }) => {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false); // 👈 New state
  const [showReview, setShowReview] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");

  if (!section) return <div className="flex-1 p-6">Select a chat</div>;

  const handleSend = async () => {
    if (message.trim()) {
      const userMessage = message;
      setMessage("");
      setLoading(true);

      await addMessageToChat(sectionIndex, "user", userMessage);

      try {
        const response = await fetch("http://localhost:5001/predict", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ sentence: userMessage }),
        });

        const data = await response.json();
        const botText = response.ok
          ? `🩺 Predicted Disease: ${data.predicted_disease}\n💊 Treatment: ${data.treatment_recommendation}`
          : `❌ Error: ${data.error}`;

        await addMessageToChat(sectionIndex, "bot", botText);

        const utterance = new SpeechSynthesisUtterance(botText.replace(/[\n🔺🩺💊❌]/g, ''));
        utterance.lang = 'en-US';

        // 🔊 Track speech status
        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);

        window.speechSynthesis.speak(utterance);
      } catch {
        const errorText = "Server error occurred.";
        await addMessageToChat(sectionIndex, "bot", "❌ Server error.");

        const utterance = new SpeechSynthesisUtterance(errorText);
        utterance.lang = 'en-US';
        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);

        window.speechSynthesis.speak(utterance);
      }

      setLoading(false);
      refresh();
    }
  };

  const handleVoiceInput = () => {
    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = "en-US";
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setMessage(transcript);
    };
    recognition.start();
  };
  const handleReviewSubmit = async () => {
  try {
    await submitReview(rating, comment);
    toast.success("Review submitted!");
    setShowReview(false);
  } catch (error) {
    toast.error("Failed to submit review.");
  }
};


  return (
    // <div className="flex-1 flex items-center justify-center h-screen px-4 sm:px-8 md:px-16 bg-gray-100">
    //   <div className="w-full max-w-4xl h-[90vh] bg-white shadow-lg rounded-xl overflow-hidden flex flex-col">
    //     <div className="flex-1 p-4 flex flex-col">
    //       <div className="flex-1 overflow-y-auto mb-4 space-y-2">
    //         {section.messages.map((msg, index) => (
    //           <div
    //             key={index}
    //             className={`whitespace-pre-line p-3 rounded-lg max-w-[75%] ${
    //               msg.sender === "user"
    //                 ? "bg-red-500 text-white self-end ml-auto"
    //                 : "bg-gray-100 text-gray-800 self-start"
    //             }`}
    //           >
    //             {msg.text}
    //           </div>
    //         ))}
    //         {loading && (
    //           <div className="bg-gray-100 text-gray-800 p-3 rounded-lg max-w-[75%] self-start">
    //             ⏳ Thinking...
    //           </div>
    //         )}
    //       </div>

    //       <div className="flex items-center space-x-2 mt-2">
    //         <textarea
    //           value={message}
    //           onChange={(e) => setMessage(e.target.value)}
    //           placeholder="Type or speak your symptoms..."
    //           rows={2}
    //           className="flex-1 border border-gray-300 rounded-md p-3 resize-none"
    //         />
    //         <button
    //           onClick={handleSend}
    //           className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
    //         >
    //           Send
    //         </button>
    //         <button
    //           onClick={handleVoiceInput}
    //           className="bg-white text-red-500 border border-red-500 px-3 py-2 rounded-md hover:bg-red-100 transition"
    //         >
    //           {isSpeaking ? "🔊" : "🎤"}
    //         </button>
    //       </div>
    //     </div>
    //   </div>
    // </div>
    <div className="relative w-full  bg-gray-100 flex items-center justify-center px-4">
       <div
  className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
  style={{
    zIndex: 0,
    fontSize: "18rem",
    fontWeight: "bold",
    color: "rgba(255, 49, 49, 0.1)", // subtle red with low opacity
    filter: "blur(6px)",
    userSelect: "none",
    whiteSpace: "nowrap",
  }}
>
  BAYMAX
</div>

      {/* Chat Window */}
     <div
  className="w-full max-w-4xl h-[90vh] bg-white shadow-lg rounded-xl overflow-hidden flex flex-col"
  style={{ zIndex: 10, position: "relative" }}
>
  {/* Title Bar */}
  <div className="bg-red-500 text-white text-center text-xl font-bold p-4 rounded-t-xl">
    BAYMAX Health Assistant 🩺
  </div>

  <div className="flex-1 p-4 flex flex-col overflow-y-auto">
    <div className="flex-1 overflow-y-auto mb-4 space-y-2">
      {section.messages.map((msg, index) => (
        <div
          key={index}
          className={`flex items-start max-w-[75%] ${
            msg.sender === "user" ? "self-end ml-auto" : "self-start"
          }`}
        >
          {/* Bot icon on left */}
          {msg.sender === "bot" && (
            <img src="/bot.jpg" alt="" className="w-8 h-8 rounded full p-1"/>
          )}

          {/* Message bubble */}
          <div
            className={`whitespace-pre-line p-3 rounded-lg ${
              msg.sender === "user"
                ? "bg-red-500 text-white"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            {msg.text}
          </div>

          {/* User icon on right */}
          {msg.sender === "user" && (
    <img src="/user.jpg" alt="" className="w-8 h-8 rounded full p-1"/>          )}
        </div>
      ))}
    </div>

    <div className="flex items-center space-x-2 mt-2">
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type or speak your symptoms..."
        rows={2}
        className="flex-1 border border-gray-300 rounded-md p-3 resize-none"
      />
      <button
        onClick={handleSend}
        className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
      >
        Send
      </button>
      <button
        onClick={handleVoiceInput}
        className="bg-white text-red-500 border border-red-500 px-3 py-2 rounded-md hover:bg-red-100 transition"
      >
        {isSpeaking ? "🔊" : "🎤"}
      </button>
    </div>
  </div>
</div>

      {/* Floating Star Button */}
      <button
        onClick={() => setShowReview(!showReview)}
        className="fixed bottom-4 right-4 bg-yellow-400 text-white p-3 rounded-full shadow-lg hover:bg-yellow-500 z-50"
      >
        <Star className="w-5 h-5" />
      </button>

      {/* Review Box */}
      {showReview && (
        <div className="fixed bottom-20 right-4 w-80 bg-white p-4 rounded-lg shadow-xl border z-50">
          <h3 className="text-lg font-semibold mb-2">Leave a Review</h3>
          <div className="flex mb-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-6 h-6 cursor-pointer ${
                  (hoverRating || rating) >= star ? "text-yellow-400" : "text-gray-300"
                }`}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setRating(star)}
              />
            ))}
          </div>
          <textarea
            rows={3}
            className="w-full border border-gray-300 rounded-md p-2 mb-2"
            placeholder="Write your comment..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <div className="flex justify-between">
            <button
              onClick={handleReviewSubmit}
              className="bg-red-500 text-white px-4 py-1 rounded-md hover:bg-red-600"
            >
              Submit
            </button>
            <button
              onClick={() => setShowReview(false)}
              className="text-gray-600 hover:underline"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatWindow;
