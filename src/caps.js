'use strict';

const server = require('./server.js');

// Initial connection listener for vendor and driver
server.on('connection', (socket) => {
  console.log(`Successfully connected to ${socket.id}`);
  socket.emit('success');

  // Grabs payload from vendor after intial connection here
  socket.on('pickup', ({ payload }) => {
    console.log(`EVENT ${payload}`);
    server.emit('pickup', { payload: payload });
  });

  // Subscribes to in-transit whenever the driver picks up the package here
  socket.on('in-transit', ({ payload }) => {
    console.log(`EVENT ${payload}`);
  });

  // When delivery driver delivers package, sends 'delivery' to server, and this is subscribed to here and published to vendor through 'delivery'
  socket.on('delivered', ({ payload }) => {
    console.log(`EVENT ${payload}`);
    socket.broadcast.emit('delivered', { payload: payload });
  });
});
