var spark_jobserver = require('./spark_jobserver');
var jobserver = new spark_jobserver();

jobserver.jobs.start('theapp', 'com.foo.blah.awesome', {context: 'awesome', sync: true}, '', function(err, data){
  console.log(data);
});

jobserver.jobs.result('5ab8f3f9-c7d1-42ec-87cb-344d0d0b5c5c', function(err, data){
  console.log(data);
});