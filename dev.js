const watch = require('tsc-watch/client');
const notifier = require('node-notifier');
const browserSync = require('browser-sync');

const bs = browserSync.create();
bs.init({
  server: true,
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
