import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminChat = ({ userId, userType }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [chatSessionId, setChatSessionId] = useState(null);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const fetchChatSession = async () => {
      const adminId = 1; // Replace with actual admin ID
      try {
        const response = await axios.post('http://localhost/website/my-project/Backend/chat.php', {
          action: 'createChatSession',
          user_id: userId,
          user_type: userType,
          admin_id: adminId
        });
        setChatSessionId(response.data.chat_session_id);
      } catch (error) {
        console.error('Error creating chat session:', error);
      }
    };

    fetchChatSession();
  }, [userId, userType]);

  useEffect(() => {
    if (chatSessionId) {
      // Initialize WebSocket connection
      const ws = new WebSocket('ws://localhost:8080');

      ws.onopen = () => {
        console.log('WebSocket connection established');
      };

      ws.onmessage = (event) => {
        const newMessages = JSON.parse(event.data);
        setMessages((prevMessages) => [...prevMessages, ...newMessages]);
      };

      ws.onclose = () => {
        console.log('WebSocket connection closed');
      };

      setSocket(ws);

      return () => {
        ws.close();
      };
    }
  }, [chatSessionId]);

  const handleSendMessage = () => {
    if (socket && newMessage) {
      socket.send(JSON.stringify({
        action: 'sendMessage',
        chat_session_id: chatSessionId,
        sender_id: 1, // Replace with actual admin ID
        sender_type: 'admin',
        message: newMessage
      }));
      setNewMessage('');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="mb-4">
          <div className="text-xl font-bold">Chat with User</div>
        </div>
        <div className="mb-4 h-64 overflow-y-auto border p-4">
          {messages.map((msg, index) => (
            <div key={index} className={`mb-2 ${msg.sender_type === 'admin' ? 'text-right' : 'text-left'}`}>
              <div className={`inline-block px-4 py-2 rounded-lg ${msg.sender_type === 'admin' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}>
                {msg.message}
              </div>
            </div>
          ))}
        </div>
        <div className="flex">
          <input 
            type="text" 
            value={newMessage} 
            onChange={(e) => setNewMessage(e.target.value)} 
            className="flex-grow p-2 border rounded-l-lg"
            placeholder="Type your message..."
          />
          <button 
            onClick={handleSendMessage} 
            className="bg-blue-500 text-white p-2 rounded-r-lg"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminChat;
