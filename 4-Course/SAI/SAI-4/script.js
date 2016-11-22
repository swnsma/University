function Cell()
{
    var self = this;
    self.online = ko.observable(false);
    self.active = ko.pureComputed(function() {
        return this.online() ? "active" : "passive";
    }, self);

    self.activate = function() {
        self.online(!self.online());
    }

}
function Neuron(data, bl)
{
    var self = this;

    self.data = data;
    self.w = [];
    self.y = bl;

    self.isOdd = false;
    for(var i = 0; i < self.data.length; i++) {
        self.w[i] = Math.random();
    }
}

function Data()
{
    var self = this;
    self.numbers = [
        "111101101101111",
        "001001001001001",
        "111001111100111",
        "111001111001111",
        "101101111001001",
        "111100111001111",
        "111100111101111",
        "111001001001001",
        "111101111101111",
        "111101111001111"];

    self.isEven = [0, 1, 0, 1, 0, 1, 0, 1, 0, 1];

    self.numberString = function(j) {
        var input = self.numbers[j];
        var output = [];

        for(var i = 0; i < input.length; i++) {
            output[i] = input[i];
        }

        return output;
    }
}


function ViewModel()
{
    var self = this;
    self.rows = ko.observableArray([]);
    var i = 0;
    for (i = 0; i < 5; i++) {
        self.rows()[i] = ko.observableArray([]);
        for (var j = 0; j < 3; j++) {
            self.rows()[i].push(new Cell());
        }
    }

    self.thetha = 0.5;

    self.message = ko.observable("");
    self.eras = ko.observable("");
    self.valid = ko.observable(true);

    self.training = function() {
        var data = new Data();
        self.boss = new Neuron(data.numberString(0), 0);
        var boss = self.boss;
        var isOdd = 0;

        var neurons = [];
        for (i = 0; i < data.numbers.length; ++i) {
            isOdd = data.isEven[i];
            var n = new Neuron(data.numberString(i), data.isEven[i]);
            neurons.push(n);
        }

        var next = true;

        var eraCount = 0;

        var y = -1, delta = 0, nu = 0.1, thetha = self.thetha;

        do {
            eraCount++;

            next = true;

            for (i = 0; i < neurons.length; i++) {
                n = neurons[i];
                do {
                  var NET = 0;
                    for (j = 0; j < boss.w.length; j++) {
                        NET += boss.w[j] * n.data[j];
                    }

                    y = NET > thetha ? 1 : 0;

                    delta = n.y - y;

                    if (delta != 0) {
                        next = false;

                        for (var k = 0; k < n.w.length; ++k) {
                            boss.w[k] = boss.w[k] + (delta * nu * n.data[k]);
                        }
                    }
                } while (delta != 0);
            }
        } while (!next);

        self.eras(eraCount);
    };

    self.validValue = ko.pureComputed(function() {
        return self.valid() ? "valid" : "not-valid"
    });

    self.execute = function() {
        var number = [];
        var data = new Data();
        var num = "";
        for(var majorIterator = 0; majorIterator < self.rows().length; majorIterator++) {
            for(var minorIterator = 0; minorIterator < self.rows()[majorIterator]().length; minorIterator++) {
                var val = self.rows()[majorIterator]()[minorIterator].online() ? 1 : 0;
                number[majorIterator * self.rows()[majorIterator]().length + minorIterator] = val;
                num += val;
            }
        }
        console.log(num);
        for (var j = 0; j< data.numbers.length; j++) {
            if (data.numbers[j] == num) {
                break;
            }

            if (j == data.numbers.length - 1) {
                self.message("Entered not valid number. Sorry, we can not determine the number.");
                self.valid(false);
                return;
            }
        }
        self.valid(true);
        var NET = 0;
        for (var i = 0; i < self.boss.w.length; ++i) {
            NET += self.boss.w[i] * number[i];
        }

        if (NET > self.thetha) {
            self.message("Entered number is ODD");
        } else {
            self.message("Entered number is EVEN");
        }
    }
}

var viewModel = new ViewModel();
viewModel.training();
ko.applyBindings(viewModel);