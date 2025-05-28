import React from "react";
import { Trash2 } from "lucide-react";
import { deleteChatSection } from '../api/chatApi'; // adjust path
import { useState ,useEffect } from "react";


const ChatSidebar = ({ sections, onSelect, onNewChat, current }) => {
  const [deleted, setDeleted] = useState(false);
  const handleDelete = async (index) => {
  try {
    const response = await deleteChatSection(index);
    console.log('Deleted:', response.message);
    setDeleted(true);
    // Update your local state here, e.g. remove the section from the list
  } catch (error) {
    console.error('Failed to delete chat section:', error.response?.data?.error || error.message);
  }
  };
  useEffect(() => {
    if (deleted) {
      // Reload the page after a short delay (optional)
      window.location.reload();
    }
  }, [deleted]);


  return (
    <div className="w-64 bg-white border-r p-4 flex flex-col">
      <button
        onClick={onNewChat}
        className="mb-4 bg-red-500 text-white py-2 px-3 rounded-md hover:bg-red-600"
      >
        ➕ New Chat
      </button>
      <div className="flex-1 overflow-y-auto space-y-2">
        {sections.map((s, idx) => (
          <div
            key={s._id}
            onClick={() => onSelect(idx)}
            className={`flex items-center justify-between cursor-pointer p-2 rounded-md ${
              idx === current ? "bg-red-100" : "hover:bg-gray-100"
            }`} 
          >
            🗂️ {s.title || `Chat ${idx + 1}`}
            <Trash2 className="w-4 h-4 text-red-500 hover:text-red-700" 
            onClick={(e) => {
        e.stopPropagation(); // prevent selecting the chat when deleting
        handleDelete(idx);
      }}/>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatSidebar;

