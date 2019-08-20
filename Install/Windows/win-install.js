echo "Starting node install";
//npm install -g express jade mongodb mongoose node-windows chartjs express-fileupload image-to-base64 --save
echo "Installing npm packages";
echo "Installing express";
npm i -g express --save;
echo "Installing jade";
npm i -g jade --save;
echo "Installing mongodb";
npm i mongodb -g --save;
echo "Installing mongoose";
npm i -g mongoose --save;
echo "Installing node-windows";
npm i -g node-windows --save;
echo "Installing chartjs";
npm i -g chartjs --save;
echo "Installing express-fileupload";
npm i -g express-fileupload --save;
echo "Installing image-to-base64";
npm i -g image-to-base64 --save;

echo "Done installing npm packages";
echo "Linking node-windows";
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
