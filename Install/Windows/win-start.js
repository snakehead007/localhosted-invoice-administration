var Service = require('node-windows').Service;

// Create a new service object
var svc = new Service({
  name:'Local-hosted-administrator',
  description: 'Create and manage your invoices.',
  script: require('path').join(__dirname,'../../index.js')
});

// Listen for the "install" event, which indicates the
// process is available as a service.
svc.on('start',function(){
  svc.start();
});

svc.start();
