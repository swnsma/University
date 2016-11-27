var path = require('path');
var root = path.dirname(process.mainModule.filename);
var conf = require(root+'/config');
var mkdir = require('mkdirpd');
var async = require('async');
var fs = require('fs');

function checkAndCreate(path,callback) {
    fs.lstat(path, function(err, stat) {
        if (err || !stat.isDirectory()) {
            try {
            mkdir.sync(path);
                callback(null);
            } catch(e){
                callback(e);
            }
        } else {
            callback(null);
        }
    })
}

module.exports = function(destination, res) {
    var current = path.join(conf.get('folder'), conf.get('current'), destination);
    var base = path.join(conf.get('folder'), conf.get('base'), destination);
    var reject = path.join(conf.get('folder'), conf.get('reject'), destination);
    async.waterfall([
        function(callback) {
            checkAndCreate(current, callback);
        },
        function(callback) {
            checkAndCreate(base, callback);
        }
    ], function(err) {
        if(err) {
            console.log('Can\'t create component folder.');
            console.log(err);
            res.end(JSON.stringify({success: false}));
        }
        res.end(JSON.stringify({success: true}));
    });

};