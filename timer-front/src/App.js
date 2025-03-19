import React, { useState, useEffect } from 'react';
import './App.css';
function App() {
  const [time, setTime] = useState(30);
  const [ws, setWs] = useState(null);

  useEffect(() => {
    const socket = new WebSocket('ws://localhost:3000');
    setWs(socket);

    socket.onmessage = (event) => {
      const { time } = JSON.parse(event.data);
      setTime(time);
    };

    return () => socket.close();
  }, []);

  const startTimer = () => {
    ws.send(JSON.stringify({ action: 'start' }));
  };

  const pauseTimer = () => {
    ws.send(JSON.stringify({ action: 'pause' }));
  };

  const resetTimer = () => {
    ws.send(JSON.stringify({ action: 'reset' }));
  };

  const formatTime = (seconds) => {
    if (seconds <= 10) {
      return `00:00:${String(seconds).padStart(2, '0')}`;
    }
    const hrs = String(Math.floor(seconds / 3600)).padStart(2, '0');
    const mins = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
    const secs = String(seconds % 60).padStart(2, '0');
    return `${hrs}:${mins}:${secs}`;
  };

  const backgroundClass = time <= 10 ? 'dark-green-background' : '';

  return (
    <div className={`App ${backgroundClass}`}>
      <h1>Timer: {formatTime(time)}</h1>
      <button onClick={startTimer}>Play</button>
      <button onClick={pauseTimer}>Pause</button>
      <button onClick={resetTimer}>Reset</button>
    </div>
  );
}

export default App;
