var path = require('path');
var root = path.dirname(process.mainModule.filename);
var conf = require(root+'/config');
var async = require('async');
var rimraf = require('rimraf');

module.exports = function(destination, res) {
    var current = path.join(conf.get('folder'), conf.get('current'), destination);
    var base = path.join(conf.get('folder'), conf.get('base'), destination);
    var reject = path.join(conf.get('folder'), conf.get('reject'), destination);
    async.parallel([
        function(callback) {
            rimraf(current, callback);
        },
        function(callback) {
            rimraf(base, callback);
        },
        function(callback) {
            rimraf(reject, callback);
        }
    ], function(err) {
        if(err) {
            console.log('Can\'t delete folder: ' + path);
            console.log(err);
            res.json({success: true});
        }
        res.end(JSON.stringify({success: true}));
    });

};