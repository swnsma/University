function Comparator()
{
    var self = this;
    self.control = {};
    self.ignore = ko.observable('nothing');
    self.changeIgnore = function(type) {
        self.ignore(type);
        if (!$.isEmptyObject(self.control)) {
            self.setIgnore();
        }
    };
    self.setIgnore = function() {
        switch(self.ignore()) {
            case 'nothing':
                self.control.ignoreNothing();
                break;
            case 'color':
                self.control.ignoreColors();
                break;
            case 'antialising':
                self.control.ignoreAntialiasing();
                break;
        }
        self.control.repaint();
    };

    self.popUp = ko.observable(localStorage.getItem('openPopUp') == 'true');
    self.openPopUp = function() {
        self.popUp(!self.popUp());
        localStorage.setItem('openPopUp', self.popUp());
    };

    self.red = ko.observable('255');
    self.green = ko.observable('0');
    self.blue = ko.observable('255');
    self.advanceColorPanel= ko.observable(false);
    self.advanceColor = function() {
        self.advanceColorPanel(!self.advanceColorPanel());
    };
    self.applyColor = function(red, green, blue) {
        self.red(red);
        self.green(green);
        self.blue(blue);
        self.setColor();
    };

    self.setColor = function() {
        resemble.outputSettings({
            errorColor: {
                red: self.red(),
                green: self.green(),
                blue: self.blue()
            }
        });
        if (!$.isEmptyObject(self.control)) {
            self.control.repaint();
        }
    };
    self.errorType= ko.observable('flat');
    self.changeErrorType = function(type) {
        self.errorType(type);
        resemble.outputSettings({
            errorType:self.errorType()
        });
        if (!$.isEmptyObject(self.control)) {
            self.control.repaint();
        }
    };
    self.compareResultUrl = ko.observable('');
    self.compareAnalysisText = ko.observable('');
    self.compareAnalysisMisMatch = 0;
    self.prepareAnalysisTextFromData = function(data) {
        var text = '';
        if (self.compareAnalysisMisMatch == 0) {
            text = 'These images are <strong>the same!</strong>';
        } else {
            text = 'The second image is <strong>' + data.misMatchPercentage + '</strong>% different compared to the first. ';
            if (!data.isSameDimensions) {
                text += 'And they have different dimensions.';
            }
        }

        return text;
    };
    self.transparancy=ko.observable(1);
    self.transparancyChange = ko.pureComputed({
        read:function() {
            return self.transparancy();
        },
        write: function(value) {
            self.transparancy(value);
            resemble.outputSettings({
                transparency: self.transparancy()
            });
            if (!$.isEmptyObject(self.control)) {
                self.control.repaint();
            }
        }
    });
    self.compareImage= function(base, current)
    {
        self.control = resemble(base).compareTo(current).onComplete(function(data) {
            self.compareResultUrl(data.getImageDataUrl());
            self.compareAnalysisMisMatch = data.misMatchPercentage;
            self.compareAnalysisText(self.prepareAnalysisTextFromData(data));
        });
        self.ignore('nothing');
    }

}