const { Worker } = require('worker_threads');
const http = require('http');
const { fibo } = require('./fibo');
const HTTP_PORT = 3333;
const fiboN = 30;

const workers = Array.from({ length: 4 })
  .fill(null)
  .map((_) => getNewWorker());
  
let count = 0;

function getNewWorker() {
  return new Worker('./worker.js').setMaxListeners(1000);
}
const requestListener = (req, res) => {
  switch (req.url) {
    case '/worker':
      ++count;
      if (count > 10000) {
        count = 0;
      }
      let currentWorker = workers[count % 4];

      const listener = (value) => {
        res.write(`${value}`);
        res.end();
        currentWorker.removeListener('message', listener);
      };
      currentWorker.on('message', listener);
      currentWorker.postMessage(fiboN);

      break;
    default: {
      const value = fibo(fiboN);
      res.write(`${value}`);
      res.end();
    }
  }
};

const server = http.createServer(requestListener);

server.listen(HTTP_PORT, () => {
  console.log(`Server listening on: ${HTTP_PORT}`);
});
