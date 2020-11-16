const { parentPort } = require('worker_threads');
const { fibo } = require('./fibo');
parentPort.on('message', (n) => {
  try {
    const value = fibo(n);

    parentPort.postMessage(value);
  } catch (err) {
    console.log('worker err', err);
  }
});
