import React from 'react';

const WhatsAppButton = () => {
  return (
    <a 
      href="https://wa.me/+5493873032323" 
      className="fixed bottom-4 right-4 bg-green-500 p-4 rounded-full shadow-lg flex items-center justify-center"
      target="_blank" 
      rel="noopener noreferrer"
    >
      <img 
        src="/icon-whatsapp.png" 
        alt="WhatsApp" 
        style={{ width: '50px', height: '50px' }}
      />
    </a>
  );
};

export default WhatsAppButton;