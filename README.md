# Node.js v12.13.1 worker_threads + http module with apache ab benchmarking

requirements:

1. node.js v12.13.1
2. Apache ab v2.3

Using `fibonacci` as cpu intensive function for testing.

## benchmarking

1. `$ node index.js`

check result differences between

1. `$ ab -n 1000 -c 10 -k http://localhost:3333/`

```
ab -n 1000 -c 10 -k http://localhost:3333/
This is ApacheBench, Version 2.3 <$Revision: 1843412 $>
Copyright 1996 Adam Twiss, Zeus Technology Ltd, http://www.zeustech.net/
Licensed to The Apache Software Foundation, http://www.apache.org/

Benchmarking localhost (be patient)
Completed 100 requests
Completed 200 requests
Completed 300 requests
Completed 400 requests
Completed 500 requests
Completed 600 requests
Completed 700 requests
Completed 800 requests
Completed 900 requests
Completed 1000 requests
Finished 1000 requests


Server Software:
Server Hostname:        localhost
Server Port:            3333

Document Path:          /
Document Length:        6 bytes

Concurrency Level:      10
Time taken for tests:   8.892 seconds
Complete requests:      1000
Failed requests:        0
Keep-Alive requests:    0
Total transferred:      81000 bytes
HTML transferred:       6000 bytes
Requests per second:    112.47 [#/sec] (mean)
Time per request:       88.916 [ms] (mean)
Time per request:       8.892 [ms] (mean, across all concurrent requests)
Transfer rate:          8.90 [Kbytes/sec] received

Connection Times (ms)
              min  mean[+/-sd] median   max
Connect:        0    0   1.4      0      14
Processing:    19   88  33.3     83     344
Waiting:        7   57  28.9     55     301
Total:         19   88  33.2     84     344

Percentage of the requests served within a certain time (ms)
  50%     84
  66%     87
  75%     90
  80%     93
  90%    104
  95%    117
  98%    213
  99%    289
 100%    344 (longest request)
```

2. `$ ab -n 1000 -c 10 -k http://localhost:3333/worker`

```
ab -n 1000 -c 10 -k http://localhost:3333/worker
This is ApacheBench, Version 2.3 <$Revision: 1843412 $>
Copyright 1996 Adam Twiss, Zeus Technology Ltd, http://www.zeustech.net/
Licensed to The Apache Software Foundation, http://www.apache.org/

Benchmarking localhost (be patient)
Completed 100 requests
Completed 200 requests
Completed 300 requests
Completed 400 requests
Completed 500 requests
Completed 600 requests
Completed 700 requests
Completed 800 requests
Completed 900 requests
Completed 1000 requests
Finished 1000 requests


Server Software:
Server Hostname:        localhost
Server Port:            3333

Document Path:          /worker
Document Length:        6 bytes

Concurrency Level:      10
Time taken for tests:   2.081 seconds
Complete requests:      1000
Failed requests:        0
Keep-Alive requests:    0
Total transferred:      81000 bytes
HTML transferred:       6000 bytes
Requests per second:    480.62 [#/sec] (mean)
Time per request:       20.806 [ms] (mean)
Time per request:       2.081 [ms] (mean, across all concurrent requests)
Transfer rate:          38.02 [Kbytes/sec] received

Connection Times (ms)
              min  mean[+/-sd] median   max
Connect:        0    0   1.9      0      56
Processing:     1   20  22.3     16     258
Waiting:        0   19  22.3     15     257
Total:          1   20  22.9     16     277

Percentage of the requests served within a certain time (ms)
  50%     16
  66%     21
  75%     24
  80%     27
  90%     34
  95%     44
  98%     61
  99%    165
 100%    277 (longest request)
```

`/worker` http endpoint can handle much more http requests than `/`.

## worker bad stability

while the `fiboN` in `index.js` getting bigger and bigger, worker became slower to respond, once the listeners amount go over limiter `setMaxListeners(1000)`, the worker crash without error.

## info

init code based on https://github.com/tugayilik/node-worker-threads
