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

const peerServer = PeerServer({ port: 3002 });
peerServer.on('connection', (id) => {
  console.log('Local PeerServer: Connection from', id);
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
  const message = lines && lines.length ? lines : 'TypeScript compiler error';
  notifier.notify({
    group: 'dom-fighter',
    title: 'dom-fighter',
    message,
    timeout: 4,
  });
});

watch.start();
