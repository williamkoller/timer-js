const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

let initialTime = 30;
let timer = initialTime;
let interval;

wss.on('connection', (ws) => {
  ws.send(JSON.stringify({ time: timer }));

  ws.on('message', (message) => {
    const { action } = JSON.parse(message);

    if (action === 'start') {
      if (!interval) {
        interval = setInterval(() => {
          if (timer > 0) {
            timer--;
          } else {
            clearInterval(interval);
            interval = null;
          }
          wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
              client.send(JSON.stringify({ time: timer }));
            }
          });
        }, 1000);
      }
    } else if (action === 'pause') {
      clearInterval(interval);
      interval = null;
    } else if (action === 'reset') {
      clearInterval(interval);
      interval = null;
      timer = initialTime;
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({ time: timer }));
        }
      });
    }
  });
});

server.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});
