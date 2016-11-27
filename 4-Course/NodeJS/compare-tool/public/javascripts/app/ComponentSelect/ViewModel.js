function ComponentSelectViewModel()
{
    var self = this;

    self.isLoaded = false;
    self.projects = ko.observableArray([]);
    self.addNew = ko.observable(false);
    self.newName = ko.observable('');
    self.activation = function() {
        api.loadComponentsList(function(response) {
            self.isLoaded = true;
            for(var i in response) {
                self.projects.push(new Project(i, response[i]));
            }
        });
    };
    self.validationStatus = ko.observable(false);
    self.newAdd = function() {
        self.addNew(true);
    };
    self.validate = function(str) {
        if((str.match(/\//g) || []).length>0 || (str.match(/\.\./)||[]).length>0) {
            self.validationStatus(true);
        } else {
            self.validationStatus(false);
        }
        return !self.validationStatus();
    };

    self.submit = function(){
        if(self.validate(self.newName())) {
            console.log('Try to send...');
            api.createFolder({path: self.newName()}, function () {
                self.projects.push(new Project(self.newName()));
                self.newName('');
                self.addNew(false);
            });
        }
    };
    self.deleteProject = function(project) {
        if (confirm('Are you sure you want to delete project ' + project.name + '?' )) {
            project.delete(function(){
                self.projects.remove(project)
            });
        }
    };

    self.reject = function() {
        self.newName('');
        self.addNew(false);
    }
}