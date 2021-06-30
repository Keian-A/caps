'use strict';

const server = require('./server.js');
const caps = server.of('/caps');
const other = server.of('/other');
const MessageQueue = require('./MessageQueue.js');
const packages = new MessageQueue();
const MessageQueue1 = require('./MessageQueue1.js');
const packages1 = new MessageQueue1();

// For client 1 connections
caps.on('connection', (socket) => {
  console.log(`Successfully connected to ${socket.id}`);
  socket.emit('success');

  // Grabs payload from vendor after intial connection here
  socket.on('pickup', ({ payload }) => {
    try {
      console.log(`EVENT ${payload}`);
      let package1 = packages.add(payload);
      caps.emit('pickup', {
        id: package1.id,
        payload: package1.value,
      });
    } catch (e) {
      console.error(e);
    }
  });

  socket.on('getall', () => {
    const allPackages = packages.getAll();
    allPackages.forEach(package1 => {
      socket.emit('pickup', package1);
    });
  });

  // Subscribes to in-transit whenever the driver picks up the package here
  socket.on('in-transit', ({ payload }) => {
    console.log(`EVENT ${payload}`);
  });

  // Subscribes to the done event, removing the package from the server queue once delivered
  socket.on('done', (payload) => {
    packages.received(payload.id);
  });

  // When delivery driver delivers package, sends 'delivery' to server, and this is subscribed to here and published to vendor through 'delivery'
  socket.on('delivered', ({ payload }) => {
    console.log(`EVENT ${payload}`);
    socket.broadcast.emit('delivered', { payload: payload });
  });
});

// For client 2 connections
other.on('connection', (socket) => {
  console.log(`Successfully connected to ${socket.id}`);
  socket.emit('success');

  // Grabs payload from vendor after intial connection here
  socket.on('pickup', ({ payload }) => {
    try {
      console.log(`EVENT ${payload}`);
      let package1 = packages1.add(payload);
      other.emit('pickup', {
        id: package1.id,
        payload: package1.value,
      });
    } catch (e) {
      console.error(e);
    }
  });

  socket.on('getall', () => {
    const allPackages = packages1.getAll();
    allPackages.forEach(package1 => {
      socket.emit('pickup', package1);
    });
  });

  // Subscribes to in-transit whenever the driver picks up the package here
  socket.on('in-transit', ({ payload }) => {
    console.log(`EVENT ${payload}`);
  });

  // Subscribes to the done event, removing the package from the server queue once delivered
  socket.on('done', (payload) => {
    packages1.received(payload.id);
  });

  // When delivery driver delivers package, sends 'delivery' to server, and this is subscribed to here and published to vendor through 'delivery'
  socket.on('delivered', ({ payload }) => {
    console.log(`EVENT ${payload}`);
    socket.broadcast.emit('delivered', { payload: payload });
  });
});