const watch = require('tsc-watch/client');
const notifier = require('node-notifier');
const browserSync = require('browser-sync');
const Turn = require('node-turn');
const { PeerServer } = require('peer');

const stunServer = new Turn({
  authMech: 'none',
  listeningIps: ['localhost'],
  listeningPort: 3478,
  debug: (level, message) => {
    if (level !== 'DEBUG' && level !== 'TRACE') {
      console.log('[node-turn:%s] %s', level, message);
    }
  },
});
stunServer.start();

const peerServer = PeerServer({ port: 3002, path: '/' });
peerServer.on('connection', (client) => {
  console.log('Local PeerServer: Connection from', client.id);
});
peerServer.on('disconnect', (client) => {
  console.log('Local PeerServer: Disconnected:', client.id);
});

const bs = browserSync.create();
bs.init({
  server: true,
  startPath: '/test/networking-iframes.html?localport=3002',
  files: [
    '*.css',
    '**/*.html',
    'dist/**/*.js',
  ],
});

watch.on('compile_errors', (lines) => {
  notifier.notify({
    group: 'dom-fighter',
    title: 'dom-fighter',
    message: lines || 'TypeScript compiler error',
    timeout: 4,
  });
});

watch.start();
