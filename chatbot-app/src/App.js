import React, { useState, useEffect } from 'react';
import './App.css'; // oletetaan että tyylit ovat täällä

function App() {
  // chatikkunan tila (onko auki vai kiinni)
  const [isOpen, setIsOpen] = useState(false);

  // viestilista
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hei! Miten voin auttaa sinua tänään?' }
  ]);

  // käyttäjän syöte
  const [input, setInput] = useState('');

  // automaattinen avaus 5 sekunnin kuluttua
  useEffect(() => {
    const timer = setTimeout(() => setIsOpen(true), 5000);
    return () => clearTimeout(timer);
  }, []);

  // viestin lähetys
  const handleSend = async () => {
    if (input.trim() === '') return;

    const newMessage = { sender: 'user', text: input };
    setMessages(prev => [...prev, newMessage]);
    setInput('');

    try {
      // lähetä viesti backendille
      const res = await fetch('http://localhost:3001/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input })
      });

      const data = await res.json();

      // lisää AI:n vastaus
      setMessages(prev => [...prev, { sender: 'bot', text: data.reply }]);
    } catch (error) {
      // virhetilanne
      setMessages(prev => [...prev, { sender: 'bot', text: 'Virhe palvelussa. Yritä myöhemmin uudelleen.' }]);
    }
  };

  return (
    <div className="App">
      {/* chattipainike (näkyy vain jos ei vielä auki) */}
      {!isOpen && (
        <button className="chat-button" onClick={() => setIsOpen(true)}>
          💬
        </button>
      )}

      {/* chatikkuna */}
      {isOpen && (
        <div className="chatbox">
          <div className="chat-header">
            <span>Jarin Chatbot</span>
            <button onClick={() => setIsOpen(false)}>✖</button>
          </div>

          <div className="chat-messages">
            {messages.map((msg, index) => (
              <div key={index} className={`message ${msg.sender}`}>
                {msg.text}
              </div>
            ))}
          </div>

          <div className="chat-input">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Kirjoita viesti..."
            />
            <button onClick={handleSend}>➤</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
