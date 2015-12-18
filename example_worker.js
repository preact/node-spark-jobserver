/**
 * NOTE: run `npm i sqs-worker` before doing this example
 */
var spark_jobserver = require('spark_jobserver'),
  SQSWorker = require('sqs-worker');

var config = {
  host: "localhost:8090",
  queue: {
    key: "<aws key>",
    secret: "<aws secret>",
    region: "us-east-1",
    name: "/838405463324/jobs-queued"
  }
};

var endpoint = 'https://sqs.' + config.queue.region + '.amazonaws.com';
var opts = {
  endpoint: endpoint,
  region: config.queue.region,
  url: endpoint + config.queue.name
};

var queue_worker = new SQSWorker(opts, worker);
var jobserver = new spark_jobserver({host: config.host});

function worker(message, done) {
  try {
    message = JSON.parse(message);
    console.log(message);
  } catch (err) {
    throw err;
  }

  jobserver.jobs.start(message.appName, message.classPath, message.options, message.body, function(err, data){
    console.log(data);

    var success = false;
    success = (data.status == 'STARTED') || (data.status == 'ERROR') || (data.status == 'VALIDATION FAILED');

    if ((data.status == 'ERROR') || (data.status == 'VALIDATION FAILED')) {
      // let the humans know
    }

    if (data.status == 'NO SLOTS AVAILABLE') {
      // sleep and try again later?
    }

    done(null, success);
  });

}