function Launcher()
{
    var self = this;
    self.tool  = new ToolViewModel();
    self.components = new ComponentSelectViewModel();

    self.runCompareTool = function(component) {
        var tool = $('#compare-tool');
        self.tool.component(component);
        if(self.tool.isLoaded){
            self.tool.flush();
            self.tool.activation();
        } else {
            tool.load('html/tool.html', function() {
                self.tool.compareByDefault.subscribe(self.tool.setDefaultCompare);
                self.tool.cursor.subscribe(self.tool.validateCursor);
                self.tool.cursor.subscribe(self.tool.cursorRelocateAfter);
                self.tool.activation();
                ko.applyBindings(self.tool, $('#compare-tool')[0]);
            });
        }
        $('#components').hide();
        tool.show();
    };

    self.runComponentSelect = function() {
        var components =  $('#components');
        if(!self.components.isLoaded) {
            components.load('html/components.html', function() {
                self.components.activation();
                ko.applyBindings(self.components, $('#components')[0]);
            });
        }
        $('#compare-tool').hide();
        components.show();
    };

    self.launch = function() {
        var selectedComponent = localStorage.getItem('selectedComponent');
        if(selectedComponent) {
            self.runCompareTool(selectedComponent);
        } else {
            self.runComponentSelect();
        }
    }
}
launcher = new Launcher();
launcher.launch();