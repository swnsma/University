function Component(name, link)
{
    var self = this;
    self.name = name;
    self.link = link;

    self.selectComponent = function() {
        localStorage.setItem('selectedComponent', self.link);
        launcher.launch();
    };

    self.delete = function(callback) {
        api.deleteFolder({path: self.link}, callback);
    }
}