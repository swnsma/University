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
    var self = this;
    self.learnRate = 0.9;
    self.momentum = 0.04;

    self.inputLayer = [];
    self.hiddenLayer = [];
    self.outputLayer = [];
    var i;

    for (i = 0; i < inputSize; i++) {
        self.inputLayer[i] = new Neuron();
    }

    for (i = 0; i < hiddenSize; i++) {
        self.hiddenLayer[i] = new Neuron(self.inputLayer);
    }

    for (i = 0; i < outputSize; i++) {
        self.outputLayer[i] = new Neuron(self.hiddenLayer);
    }

    self.train = function (inputs) {
        var i;
        for (i = 0; i < self.inputLayer.length; i++) {
            self.inputLayer[i].y = inputs[i];
        }

        for (i = 0; i < self.hiddenLayer.length; i++) {
            self.hiddenLayer[i].getY();
        }

        for (i = 0; i < self.outputLayer.length; i++) {
            self.outputLayer[i].getY();
        }
    };

    self.compute = function (inputs) {
        self.train(inputs);
        var output = [];
        for (var i = 0; i < self.outputLayer.length; i++) {
            output[i] = self.outputLayer[i].y;
        }

        return output;
    };

    self.calculateError = function (targets) {
        var output = 0;
        for (var i = 0; i < self.outputLayer.length; i++) {
            output += Math.abs(self.outputLayer[i].getError(targets[i]));
        }

        return output;
    };

    self.backPropagate = function (vars) {
        var i;

        for (i = 0; i < self.outputLayer.length; i++) {
            self.outputLayer[i].getGrad(vars[i]);
        }

        for (i = 0; i < self.hiddenLayer.length; i++) {
            self.hiddenLayer[i].getGrad();
        }

        for (i = 0; i < self.hiddenLayer.length; i++) {
            self.hiddenLayer[i].rebuildW(self.learnRate, self.momentum);
        }

        for (i = 0; i < self.outputLayer.length; i++) {
            self.outputLayer[i].rebuildW(self.learnRate, self.momentum);
        }
    }
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

function Neuron(data) {
    var self = this;

    self.inputS = [];
    self.outputS = [];
    self.bias = NN.getRandom();
    self.biasd = 0;
    self.y = 0;
    self.grad = 0;

    if (data instanceof Array) {

        for (var i in data) {
            var s = new S(data[i], self);
            data[i].outputS.push(s);
            self.inputS.push(s);
        }
    }

    self.getY = function () {
        var sum = 0;

        for (var i = 0; i < self.inputS.length; i++) {
            sum += self.inputS[i].w * self.inputS[i].inputN.y;
        }

        sum += self.bias;
        self.y = NN.sigmoidFunction(sum);

        return self.y;
    };

    self.getDerivative = function () {
        return NN.sigmoidDerivative(self.y);
    };

    self.getError = function (right) {
        return right - self.y;
    };

    self.getGrad = function (right) {

        if (right) {
            self.grad = self.getError(right) * self.getDerivative();
            return self.grad;
        } else {
            var sum = 0;
            for (var i = 0; i < self.outputS.length; i++) {
                sum += self.outputS[i].w * self.outputS[i].outputN.grad;
            }
            self.grad = sum * self.getDerivative();
        }

        return self.grad;
    };

    self.rebuildW = function (learnRate, momentum) {
        var prevDelta = self.biasd;

        self.biasd = learnRate * self.grad;
        self.bias += self.biasd + momentum * prevDelta;

        for (var i = 0; i < self.inputS.length; i++) {
            prevDelta = self.inputS[i].wd;
            self.inputS[i].wd = learnRate * self.grad * self.inputS[i].inputN.y;
            self.inputS[i].w += self.inputS[i].wd + momentum * prevDelta;
        }
    }
}

function S(inputN, outputN) {

    var self = this;

    self.inputN = inputN;
    self.outputN = outputN;
    self.w = NN.getRandom();
    self.wd = null;
}

function Data() {
    var self = this;
    self.numbers = [
        [1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1],//0
        [0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1],//1
        [1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1],//2
        [1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1],//3
        [1, 0, 1, 1, 0, 1, 1, 1, 1, 0, 0, 1, 0, 0, 1],//4
        [1, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 1],//5
        [1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1],//6
        [1, 1, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1],//7
        [1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1],//8
        [1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1]
    ];

    self.answers = [
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 1]
    ];
}


function ViewModel() {
    var self = this;
    self.rows = ko.observableArray([]);
    var i;
    for (i = 0; i < 5; i++) {
        self.rows()[i] = ko.observableArray([]);
        for (var j = 0; j < 3; j++) {
            self.rows()[i].push(new Cell());
        }
    }

    self.network = new NN(15, 15, 10);
    self.message = ko.observable("");
    self.valid = ko.observable(true);

    self.training = function () {
        var data = new Data();
        var iterations = 100;

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
        var num = "";

        for (var majorIterator = 0; majorIterator < self.rows().length; majorIterator++) {
            for (var minorIterator = 0; minorIterator < self.rows()[majorIterator]().length; minorIterator++) {
                var val = self.rows()[majorIterator]()[minorIterator].online() ? 1 : 0;
                number[majorIterator * self.rows()[majorIterator]().length + minorIterator] = val;
                num += val;
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
viewModel.training();
ko.applyBindings(viewModel);