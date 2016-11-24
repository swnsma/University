m = 11;

function Cell() {
    var self = this;
    self.online = ko.observable(false);
    self.active = ko.pureComputed(function () {
        return this.online() ? "active" : "passive";
    }, self);

    self.activate = function () {
        self.online(!self.online());
    }

}

function NN(inputSize, hiddenSize, outputSize) {
}

NN.getRandom = function() {
    return 2 * Math.random() - 1;
};

NN.sigmoidFunction = function (x) {
    return 1 / (1 + Math.exp(-x));
};

NN.sigmoidDerivative = function (f) {
    return f * (1 - f)
};

function Data() {
    var self = this;
    self.numbers = [
        [ 0,1,1,1,0,1,0,0,0,1,1,0,0,0,1,1,0,0,0,1,1,0,0,0,1,1,0,0,0,1,0,1,1,1,0 ],
        [ 0,0,1,0,0,0,1,1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1,0,0,0,1,1,1,0 ],
        [ 0,1,1,1,0,1,0,0,0,1,0,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,1,1,1,1 ],
        [ 1,1,1,1,1,0,0,0,1,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,1,1,0,0,0,1,0,1,1,1,0 ],
        [ 0,0,0,1,0,0,0,1,1,0,0,1,0,1,0,1,0,0,1,0,1,1,1,1,1,0,0,0,1,0,0,0,0,1,0 ],
        [ 1,1,1,1,1,1,0,0,0,0,1,1,1,1,0,0,0,0,0,1,0,0,0,0,1,1,0,0,0,1,0,1,1,1,0 ],
        [ 0,0,1,1,0,0,1,0,0,0,1,0,0,0,0,1,1,1,1,0,1,0,0,0,1,1,0,0,0,1,0,1,1,1,0 ],
        [ 1,1,1,1,1,0,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,0,1,0,0,0,0,1,0,0,0 ],
        [ 0,1,1,1,0,1,0,0,0,1,1,0,0,0,1,0,1,1,1,0,1,0,0,0,1,1,0,0,0,1,0,1,1,1,0 ],
        [ 0,1,1,1,0,1,0,0,0,1,1,0,0,0,1,0,1,1,1,1,0,0,0,0,1,0,0,0,1,0,0,1,1,0,0 ]
    ];

    self.y = [
        [ 1,1,1,1,0,1,0,0,0,1,1,0,0,0,1,1,0,0,0,1,1,0,0,0,1,1,0,0,0,1,0,1,1,1,0 ],
        [ 1,0,1,0,0,0,1,1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1,0,0,0,1,1,1,0 ],
        [ 1,1,1,1,0,1,0,0,0,1,0,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,1,1,1,1 ],
        [ 0,1,1,1,1,0,0,0,1,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,1,1,0,0,0,1,0,1,1,1,0 ],
        [ 1,0,0,1,0,0,0,1,1,0,0,1,0,1,0,1,0,0,1,0,1,1,1,1,1,0,0,0,1,0,0,0,0,1,0 ],
        [ 0,1,1,1,1,1,0,0,0,0,1,1,1,1,0,0,0,0,0,1,0,0,0,0,1,1,0,0,0,1,0,1,1,1,0 ],
        [ 1,0,1,1,0,0,1,0,0,0,1,0,0,0,0,1,1,1,1,0,1,0,0,0,1,1,0,0,0,1,0,1,1,1,0 ],
        [ 0,1,1,1,1,0,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,0,1,0,0,0,0,1,0,0,0 ],
        [ 1,1,1,1,0,1,0,0,0,1,1,0,0,0,1,0,1,1,1,0,1,0,0,0,1,1,0,0,0,1,0,1,1,1,0 ],
        [ 1,1,1,1,0,1,0,0,0,1,1,0,0,0,1,0,1,1,1,1,0,0,0,0,1,0,0,0,1,0,0,1,1,0,0 ]
    ];

    self.w = [];
    self.v = [];
    var i, j;
    for (i =0; i< 35; i++) {
        self.w[i] = [];
        for (j = 0; j < m; j++) {
            self.w[i][j] = NN.getRandom();
        }
    }

    for (i =0; i< m; i++) {
        self.v[i] = [];
        for (j = 0; j < 35; j++) {
            self.v[i][j] = NN.getRandom();
        }
    }
}


function ViewModel() {
    var self = this;
    self.rows = ko.observableArray([]);
    var i;
    for (i = 0; i < 7; i++) {
        self.rows()[i] = ko.observableArray([]);
        for (var j = 0; j < 5; j++) {
            self.rows()[i].push(new Cell());
        }
    }

    self.network = new NN(15, 15, 10);
    self.message = ko.observable("");
    self.valid = ko.observable(true);

    self.training = function () {
        var data = new Data();
        var iterations = 10000;

        for (var i = 0; i < iterations; i++) {
            for (var j = 0; j < data.numbers.length; j++) {
                self.network.train(data.numbers[j]);
                self.network.backPropagate(data.answers[j]);
            }
        }
    };

    self.validValue = ko.pureComputed(function () {
        return self.valid() ? "valid" : "not-valid"
    });

    self.execute = function () {
        var number = [];
        debugger;
        for (var majorIterator = 0; majorIterator < self.rows().length; majorIterator++) {
            for (var minorIterator = 0; minorIterator < self.rows()[majorIterator]().length; minorIterator++) {
                number[majorIterator * self.rows()[majorIterator]().length + minorIterator] =
                    self.rows()[majorIterator]()[minorIterator].online() ? 1 : 0;
            }
        }
        console.log(number);

        var output = self.network.compute(number);
        var message = "<p>Probability:";
        var max = -9379992, result = 0;

        for (var i = 0; i < output.length; i++) {
            if (output[i] > max) {
                max = output[i];
                result = i;
            }

            message += '<br/>' + i + ' = ' + output[i];
        }

        message += '<br/>' + 'This is number: ' + result;
        self.message(message);
    }
}

var viewModel = new ViewModel();
ko.applyBindings(viewModel);