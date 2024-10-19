import React from 'react';
import ChatbotPopup from '../components/ChatbotPopup';

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold mb-4 text-center">Welcome to Gaming Support</h1>
      <p className="text-xl text-gray-600 mb-8 text-center">
        Need help? Our AI-powered chatbot is here to assist you!
      </p>
      <div className="text-center">
        <p className="text-lg mb-2">Click the chat icon in the bottom right corner to get started.</p>
        <p className="text-sm text-gray-500">Our chatbot can help with game tips, troubleshooting, and more!</p>
      </div>
      <ChatbotPopup />
    </div>
  );
};

export default Index;