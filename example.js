var spark_jobserver = require('./spark_jobserver');
var config = {
  host: "localhost:8090",
  queue: {
    key: "<aws key>",
    secret: "<aws secret>",
    region: "us-east-1",
    name: "/838405463324/jobs-queued"
  }
};

var jobserver = new spark_jobserver(config);

jobserver.jobs.start('theapp', 'com.foo.blah.awesome', {context: 'awesome', sync: true}, '', function(err, data){
  console.log(data);
});

jobserver.jobs.result('5ab8f3f9-c7d1-42ec-87cb-344d0d0b5c5c', function(err, data){
  console.log(data);
});

var config = '{"stress": {"test": {"duration": "15"}}}';
jobserver.jobs.queue('testjob', 'spark.jobserver.test', {context: 'awesome'}, config, function(err, data){
  console.log(data);
});