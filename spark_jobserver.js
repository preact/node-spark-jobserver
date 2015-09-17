// ala https://github.com/chadsmith/node-namecheap/blob/master/namecheap.js
var request = require('request'),
  qs = require('querystring'),
  util = require('util');

var spark_jobserver = function() {
  this.endpoint = 'http://10.0.3.39:8090';
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
      uri: this.endpoint + "/" + path
    };
    params = qs.stringify(querystring);
    options.uri += '?' + params;
    if('POST' == method) {
      options.body = body;
    }
    console.log(options);
    // request(options, function(err, res, body) {
    //   console.log('here!');
    //   if (typeof body != 'undefined') {
    //     body = JSON.parse(body);
    //   }
    //   callback(err, body);
    // });
    return this;
  }
};

module.exports = spark_jobserver;