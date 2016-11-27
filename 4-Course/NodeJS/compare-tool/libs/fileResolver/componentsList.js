var fs = require('fs');
var path = require('path');
var root = path.dirname(process.mainModule.filename);
var conf = require(root+'/config');
var folder = conf.get('folder');
var async = require('async');
folder = path.join(folder, conf.get('base'));

module.exports = function(response){
    fs.readdir(folder, function(err, data){
        if(err) {
            response.json({});
            return;
        }
        var result = {};
        async.each(data, function(project, callback) {
            var comps =
                fs.readdirSync(path.join(folder, project)).filter(function(file) {
                return fs.statSync(path.join(folder, project, file)).isDirectory();
            });
            result[project] = {};
            for (var comp in comps) {
                result[project][comps[comp]] = project + '/' + comps[comp];
            }
            callback();
        }, function(err) {
            if(err) {
                console.log('Error, when try to read project components.');
                response.json([]);
                return;
            }
            response.json(result);
        });
    });
};