function Project(name, data)
{
    var self = this;

    self.name = name;
    self.components = ko.observableArray([]);
    self.addNewComponent = ko.observable(false);
    self.newName = ko.observable('');
    self.validationStatus = ko.observable(false);
    self.selected = ko.observable(false);

    for (var i in data) {
        self.components.push(new Component(i, data[i]));
    }

    self.select = function() {
        self.selected(!self.selected());
    };

    self.newAddComponent = function() {
        self.addNewComponent(true);
    };

    self.validate = function(str) {
        if((str.match(/\//g) || []).length>0 || (str.match(/\.\./)||[]).length>0) {
            self.validationStatus(true);
        } else {
            self.validationStatus(false);
        }

        return !self.validationStatus();
    };

    self.submit = function() {
        if(self.validate(self.newName())) {
            api.createFolder({path: name+ '/' + self.newName()}, function(){
                self.components.push(new Component(self.newName(), self.name + '/' + self.newName()));
                self.newName('');
                self.addNewComponent(false);
            });
        }
    };
    self.delete = function(callback) {
        api.deleteFolder({path: self.name}, callback)
    };
    self.reject = function() {
        self.newName('');
        self.addNewComponent(false);
    };

    self.deleteComponent = function(component) {
        if (confirm('Are you sure you want to delete component ' + component.name + '?' )) {
            component.delete(function () {
                self.components.remove(component);
            });
        }
    }
}