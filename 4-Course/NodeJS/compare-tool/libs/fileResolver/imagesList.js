var fs = require('fs');
var path = require('path');
var root = path.dirname(process.mainModule.filename);
var conf = require(root+'/config');
var async = require('async');
var mkdir = require('mkdirpd');

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

function findMatches(first, second) {
    var result = [];
    for (var img in first) {
        if (img && second.indexOf(first[img])>=0) {
            result.push(first[img]);
        }
    }
    return result;
}

module.exports = function(req, res){
    var component = req.body.component;
    var currentLine = path.join(conf.get('folder'), conf.get('current'), component);
    var baseLine = path.join(conf.get('folder'), conf.get('base'), component);

    async.parallel([
        function(callback) {
            fs.readdir(baseLine, callback);
        },
        function(callback) {
            fs.readdir(currentLine, callback);
        }
    ], function(err, results) {
        if (err) {
            async.waterfall([
                function(callback){
                    checkAndCreate(currentLine, callback)
                },
                function(callback) {
                    checkAndCreate(baseLine, callback)
                }
            ], function(err) {
                if (err) {
                    console.log(err);
                    console.log('Can\'  t create a images folder.');
                }
            });
            res.json([]);
            return;
        }
        var result = findMatches(results[0], results[1]);
        res.json(result);
    });
};