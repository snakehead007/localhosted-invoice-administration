var forever=require('forever');

var child = new (forever.Monitor)('index.js', {
  max: 3,
  silent: true,
  args: []
});

child.on('exit', function () {
    console.log('index.js has exited after 3 restarts');
});

console.log("running");
child.start();
