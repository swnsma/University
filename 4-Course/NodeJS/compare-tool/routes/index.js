module.exports = function(app) {
  app.get('/', function(req, res) {
    res.render('index', {title: 'Comparator'});
  });
  app.post('/imageList', require('./fileResolver').post);
  app.post('/acceptImage', require('./acceptImage').post);
  app.post('/rejectImage', require('./rejectImage').post);
  app.post('/removeCurrent', require('./removeCurrent').post);
  app.get('/loadComponents', require('./loadComponents').get);
  app.post('/removeFolder', require('./removeFolder').post);
  app.post('/createFolder', require('./createFolder').post);
};
