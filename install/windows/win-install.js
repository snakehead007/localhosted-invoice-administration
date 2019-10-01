//npm install -g express jade mongodb mongoose node-windows chartjs express-fileupload image-to-base64 --save

npm i -g express --save;

npm i -g jade --save;

npm i mongodb -g --save;

npm i -g mongoose --save;

npm i -g node-windows --save;

npm i -g chartjs --save;

npm i -g express-fileupload --save;

npm i -g image-to-base64 --save;

npm link node-windows;

var Service = require('node-windows').Service;

// Create a new service object
var svc = new Service({
  name:'Local-hosted-administrator',
  description: 'Create and manage your invoices.',
  script: require('path').join(__dirname,'../../index.js')
});

// Listen for the "install" event, which indicates the
// process is available as a service.
svc.on('install',function(){
  svc.start();
});

svc.install();
