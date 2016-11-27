function ToolViewModel() {
    var self = this;
    self.component = ko.observable('');
    self.images = ko.observableArray([]);
    self.cursor = ko.observable('0');
    self.title = ko.computed(function () {
        var img = self.images()[self.cursor()];
        if (img) {
            return img.url;
        } else {
            return "Images not found";
        }
    });
    self.maintenance = ko.observable(false);
    /** Get images utl to show**/
    self.currentSrc = ko.computed(function () {
        var img = self.images()[self.cursor()];
        if (img) {
            return img.currentUrl;
        } else {
            return "images/default.png";
        }
    });
    self.baseSrc = ko.computed(function () {
        var img = self.images()[self.cursor()];
        if (img) {
            return img.baseUrl;
        } else {
            return "images/default.png";
        }
    });
    self.compareByDefault = ko.observable(false);
    /** Check next image allowed. **/
    self.nextAllow = ko.computed(function () {
        return self.cursor() < self.images().length - 1;
    });
    self.prevAllow = ko.computed(function () {
        return self.cursor() > 0;
    });
    self.setDefaultCompare = function () {
        localStorage.setItem('compareByDefault', self.compareByDefault());
    };

    /** Arrows actions. **/
    self.next = function () {
        if (self.nextAllow()) {
            self.cursor(+self.cursor() + 1);
        }
    };
    self.last = function () {
        if (self.cursor() < self.images().length) {
            self.cursor(self.images().length - 1);
        }
    };
    self.first = function () {
        console.log(self.cursor());
        console.log(self.images().length);
        if (self.cursor() != 0) {
            self.cursor(0);
        }
    };
    self.prev = function () {
        if (self.prevAllow()) {
            self.cursor(self.cursor() - 1);
        }
    };
    self.comparator = new Comparator();

    self.cursorRelocateAfter = function () {
        self.compareMode(false);
        self.comparator.control = {};
        if (self.compareByDefault()) {
            self.compareImages();
        }
    };
    self.compareMode = ko.observable(false);
    self.isLoaded = false;
    self.compareImages = function () {
        if (!self.compareMode()) {

            var img = self.images()[self.cursor()];
            if (img) {
                self.comparator.compareImage(img.baseUrl, img.currentUrl);
                self.compareMode(true);
            }
        } else {
            self.compareMode(false);
        }
    };
    self.acceptImage = function () {
        var img = self.images()[self.cursor()];
        if (img) {
            api.acceptImage({image: img.url, component: self.component()},
                function (response) {
                    response = JSON.parse(response);
                    if (response) {
                        console.log('Successfully accepted.');
                        self.removeCurrentElement();
                    }
                });
        }
    };

    self.removeCurrentElement = function () {
        self.images.splice(self.cursor(), 1);
        if (self.cursor() >= self.images().length) {
            self.cursor(self.images().length - 1);
        } else {
            self.cursorRelocateAfter();
        }
    };
    self.validateCursor = function () {
        if (self.cursor() < 0 ||
            isNaN(parseInt(Number(self.cursor()))) ||
            parseInt(Number(self.cursor())) != self.cursor()) {
            self.cursor(0);
        } else if (self.cursor() >= self.images().length && self.images().length) {
            self.cursor(self.images().length - 1 + (self.images().length ? 0 : 1));
        }
    };

    self.rejectImage = function () {
        var img = self.images()[self.cursor()];
        if (img) {
            api.rejectImage({image: img.url, component: self.component()},
                function (response) {
                    response = JSON.parse(response);
                    if (response) {
                        console.log('Successfully rejected.');
                        self.removeCurrentElement();
                    }
                });
        }
    };
    self.backButton = function() {
        localStorage.removeItem('selectedComponent');
        launcher.launch();
    };
    /** View model activation. **/
    self.activation = function () {
        var def = localStorage.getItem('compareByDefault');
        if (def == 'true') {
            self.compareByDefault(true);
        }
        api.loadImagesList({component: self.component()},function (response) {
            for (var i in response) {
                self.images.push(new ImageUrls(response[i], self.component()));
            }
            if (self.compareByDefault()) {
                self.compareImages();
            }
            self.isLoaded = true;
        });
    };
    self.flush = function() {
        self.cursor(0);
        self.images([]);
    };
    self.log = function(){
        console.log(arguments);
    };
    self.processTheSameDelete = function () {
        if (!confirm('Are you sure? The process can take a long time.')) {
            return;
        }
        self.maintenance(true);
        self.comparator.openPopUp();
        self.cursor(0);
        var deleteList = [];
        var done = function() {
            api.remove({images: JSON.stringify(deleteList), component: self.component()}, function (response) {
                console.log(response);
                if (response.result == true) {
                    console.log('The same images has been removed.');
                } else {
                    console.log('Something going wrong...');
                }
            });
            self.flush();
            launcher.launch();
            self.maintenance(false);
            self.comparator.openPopUp();
        };

        var process =function () {
            self.comparator.compareImage(self.images()[self.cursor()].baseUrl,
                self.images()[self.cursor()].currentUrl);
            if (self.comparator.compareAnalysisMisMatch == 0) {
                deleteList.push(self.images()[self.cursor()].url);
            }

            if (self.cursor() >= self.images().length - 1) {
                done();
                return;
            }
            self.cursor(+self.cursor() + 1);
            setTimeout(process, 1000)
        };

        process();


    }
}