/* Explicit local test launcher; no application code imports this file. */
const path = require('node:path');
const http = require('node:http');
const root = path.resolve(__dirname, '../..');
const preload = path.join(__dirname, 'mock-cms.cjs').replaceAll('\\', '/');
process.env.NODE_OPTIONS = `${process.env.NODE_OPTIONS ?? ''} --require=${preload}`;
require('./mock-cms.cjs');
const next = require('next');
const app = next({ dev: true, dir: root, hostname: '127.0.0.1', port: 3101 });
app.prepare().then(() => {
  http.createServer(app.getRequestHandler()).listen(3101, '127.0.0.1', () => console.log('Local mocked CMS preview ready at http://127.0.0.1:3101'));
}).catch(error => { console.error(error); process.exitCode = 1; });
