import http from 'http';
import os from 'os';

let app = require('./server').default;

const server = http.createServer(app);

let currentApp = app;

server
  .listen(process.env.PORT || 3000, () => {
    console.log(`🚀 started at: http://${getNetworkAddress()}:${process.env.PORT || 3000}`);
  })
  .on('error', error => {
    console.log(error);
  });

if (module.hot) {
  console.log('✅  Server-side HMR Enabled!');

  module.hot.accept('./server', () => {
    console.log('🔁  HMR Reloading `./server`...');

    try {
      app = require('./server').default;
      server.removeListener('request', currentApp);
      server.on('request', app);
      currentApp = app;
    } catch (error) {
      console.error(error);
    }
  });
}

function getNetworkAddress() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const interf of interfaces[name]) {
      const { address, family, internal } = interf;
      if (family === "IPv4" && !internal) {
        return address;
      }
    }
  }
};
