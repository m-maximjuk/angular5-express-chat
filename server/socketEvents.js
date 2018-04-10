exports = module.exports = function (io) {
  // Set socket.io listeners.
  io.on('connection', (client) => {
    console.log('user connected');

    // On conversation entry, join broadcast channel
    client.on('join', (conversation) => {
      client.join(conversation);
      console.log('joined ' + conversation);
    });

    client.on('leave', (conversation) => {
      client.leave(conversation);
      console.log('left ' + conversation);
    });

    client.on('message', (data) => {
      client.emit('thread', data);
      client.broadcast.emit('thread', data);
    });

    client.on('disconnect', () => {
      console.log('user disconnected');
    });
  });
};
