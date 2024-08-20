import React, { useState } from 'react';
import axios from 'axios';

const AdminChat = ({ userId, userType, userEmail }) => {
  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = async () => {
    if (newMessage) {
      try {
        await axios.post('http://localhost/website/my-project/Backend/sendemail.php', {
          user_id: userId,
          user_type: userType,
          user_email: userEmail,
          message: newMessage
        });
        setNewMessage('');
        alert('Message sent to admin successfully');
      } catch (error) {
        console.error('Error sending message:', error);
        alert('Failed to send message');
      }
    }
  };

  return (
    <div className="bg-red-900 h-1/3 w-1/2 mt-10">
      <div className="bg-white h-full shadow-md rounded-lg p-6">
        <div className="mb-4">
          <div className="text-xl font-bold">Chat with Admin</div>
        </div>
        <div className="flex">
          <input 
            type="text" 
            value={newMessage}
            href="mailto:jesnerperillo7@gmail.com"
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
