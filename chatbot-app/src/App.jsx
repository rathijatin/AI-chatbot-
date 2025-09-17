
import React, { useState, useRef, useEffect } from 'react';
import './App.css';

function Star({ width, height }) {
  const [x, setX] = useState(Math.random() * width);
  const [y, setY] = useState(Math.random() * height);
  const [speed] = useState(0.5 + Math.random() * 1.5);

  useEffect(() => {
    const move = () => {
      setY((prevY) => {
        let newY = prevY + speed;
        if (newY > height) {
          newY = 0;
          setX(Math.random() * width);
        }
        return newY;
      });
    };
    const interval = setInterval(move, 16);
    return () => clearInterval(interval);
  }, [height, width, speed]);

  return (
    <circle cx={x} cy={y} r={1.2} fill="white" />
  );
}

function StarsBackground({ numStars = 100 }) {
  const width = window.innerWidth;
  const height = window.innerHeight;
  return (
    <svg className="stars-bg" width={width} height={height} style={{ position: 'fixed', top: 0, left: 0, zIndex: 0 }}>
      {Array.from({ length: numStars }).map((_, i) => (
        <Star key={i} width={width} height={height} />
      ))}
    </svg>
  );
}

function Chatbot() {
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hello! How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const userMsg = input;
    setMessages((msgs) => [...msgs, { sender: 'user', text: userMsg }]);
    setInput('');
    try {
      const res = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg })
      });
      const data = await res.json();
      if (data.reply) {
        setMessages((msgs) => [...msgs, { sender: 'bot', text: data.reply }]);
      } else {
        setMessages((msgs) => [...msgs, { sender: 'bot', text: 'Sorry, I could not process your request.' }]);
      }
    } catch (err) {
      setMessages((msgs) => [...msgs, { sender: 'bot', text: 'Error connecting to AI service.' }]);
    }
  };

  return (
    <div className="chatbot-container">
      <div className="chat-window">
        {messages.map((msg, idx) => (
          <div key={idx} className={`message ${msg.sender}`}>{msg.text}</div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form className="input-area" onSubmit={sendMessage}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}

function App() {
  return (
    <div className="app-root">
      <StarsBackground numStars={120} />
      <div className="ai-header">
        RATHI AI
      </div>
      <Chatbot />
    </div>
  );
}

export default App;
