var request = require('request'),
  qs = require('querystring'),
  util = require('util'),
  AWS = require('aws-sdk');

var spark_jobserver = function(options) {
  this.endpoint = options.host || 'localhost:8090';

  this.queue = '';
  var queue_config = options.queue || '';

  if (queue_config !== '') {
    var region = queue_config.region || 'us-east-1';
    this.queue_url = 'https://sqs.' + region + '.amazonaws.com' + queue_config.name;

    this.queue = new AWS.SQS(queue_config);
  }
};

spark_jobserver.prototype = {
  get jars() {
    var instance = this;
    return {
      list: function(callback) {
        return instance.command('jars', {}, '', callback);
      },
      upload: function(app_name, jar_file, callback) {
        callback(new Error('not yet implemented'));
      }
    };
  },
  get contexts() {
    var instance = this;
    return {
      list: function(callback) {
        return instance.command('contexts', {}, '', callback);
      },
      create: function(name, config, callback) {
        return instance.command('contexts/' + name, config, '', callback, 'POST');
      },
      stop: function(name, callback) {
        return instance.command('contexts/' + name, {}, '', callback, 'DELETE');
      }
    };
  },
  get jobs() {
    var instance = this;
    return {
      list: function(callback) {
        return instance.command('jobs', {}, '', callback);
      },
      start: function(app_name, class_path, options, body, callback) {
        var qs = {
          appName: app_name,
          classPath: class_path
        };
        for (var attr in options) { qs[attr] = options[attr]; }
        return instance.command('jobs', qs, body, callback, 'POST');
      },
      queue: function(app_name, class_path, options, body, callback) {
        if (instance.queue === '') {
          throw new Error("Queue not configured.");
        }

        var message = {
          appName: app_name,
          classPath: class_path,
          options: options,
          body: body
        };
        instance.queue.sendMessage({
          QueueUrl: instance.queue_url,
          MessageBody: JSON.stringify(message)
        }, callback);
      },
      result: function(job_id, callback) {
        return instance.command('jobs/' + job_id, {}, '', callback);
      },
      kill: function(job_id, callback) {
        return instance.command('jobs/' + job_id, {}, '', callback);
      },
      config: function(job_id, callback) {
        return instance.command('jobs/' + job_id + '/config', {}, '', callback);
      }
    };
  },
  command: function(path, querystring, body, callback, method) {
    var options = {
      method: method || 'GET',
      uri: this.endpoint + "/" + path,
      timeout: 5000
    };
    params = qs.stringify(querystring);
    options.uri += '?' + params;
    if('POST' == method) {
      options.body = body;
    }
    request(options, function(err, res, body) {
      if (typeof body != 'undefined') {
        body = JSON.parse(body);
      }
      callback(err, body);
    });
    return this;
  }
};

module.exports = spark_jobserver;
