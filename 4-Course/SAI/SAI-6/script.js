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

NN.normalizedB = function(digits, n, m) {
    var normalized = [];
    for (var i = 0; i < n; i++) {
        normalized[i] = [];
        var sum = 0;
        for (var j = 0; j < m; j++) {
            sum += Math.pow(digits[i][j], 2);
        }
        sum = Math.sqrt(sum);
        for (var j = 0; j < m; j++) {
            normalized[i][j] = digits[i][j] / sum;
        }
        normalized[i][m] = sum;
    }

    return normalized;
};

NN.normalizedY = function(digits, n, m) {
    var normalized = [];
    for (var i = 0; i < n; i++) {
        normalized[i] = [];
        var sum = 0;
        for (var j = 0; j < m; j++) {
            sum += Math.pow(digits[i][j], 2);
        }
        sum = Math.sqrt(sum);
        for (var j = 0; j < m; j++) {
            normalized[i][j] = digits[i][j] / sum;
        }
    }

    return normalized;
};

NN.inArray = function(arr, n, elem) {
    for (var i = 0; i < n ; i++) {
        if (elem == arr[i]) {
            return true;
        }
    }

    return false;
};

NN.maxIndex = function(arr, n, inUse, k) {
    var maxIndex = -1;

    for (var i = 0; i < n; i++) {
        if (maxIndex == -1) {
            if (NN.inArray(inUse, k, i)) {
                continue;
            } else {
                maxIndex = i;
            }
        } else {
            if (arr[i] > arr[maxIndex] && !NN.inArray(inUse, k, i)) {
                maxIndex = i;
            }
        }
    }

    return maxIndex;
};

NN.teach = function(x, w, v) {
    var indexesInUse = [];

    for (var nD = 0; nD < 10; nD++) {
        var alpha = 0.7;
        var net = [];
        var maxNeuronIndex = 0;
        while(alpha > 0.05) {
            for (var i = 0; i< m; i++) {
                net[i] = 0.0;
                for (var j = 0; j < 35; j++) {
                    net[i] += w[j][i] * x[nD][j];
                }
            }
            maxNeuronIndex = NN.maxIndex(net, m, indexesInUse, nD);
            for (var i = 0; i < 35; i++) {
                w[i][maxNeuronIndex] = w[i][maxNeuronIndex] + alpha * (x[nD][i] - w[i][maxNeuronIndex]);
            }
            alpha -= 0.07;
        }
        indexesInUse[nD] = maxNeuronIndex;

        var beta = 0.1;
        var out = [];
        while (beta > 0.005) {
            for (var i = 0; i < 35; i++) {
                out[i] = net[maxNeuronIndex] * v[maxNeuronIndex][i];
            }
            for (var i = 0; i < 35; i++) {
                v[maxNeuronIndex][i] =
                    v[maxNeuronIndex][i] + beta * (x[nD][i] - v[maxNeuronIndex][i]) * net[maxNeuronIndex];
            }
            beta -= 0.001;
        }

    }

    return {x: x, v: v, w: w};
};

NN.get = function(digit, digits, w, v) {
    var arg = [];
    arg.push(digit);
    var normalizedDigit = NN.normalizedB(arg, 1, 35)[0];
    var net = [];
    var out = [];
    for (var i = 0; i < m; i++) {
        net[i] = 0.0;
        for (var j = 0; j < 35; j++) {
            net[i] += w[j][i] * normalizedDigit[j];
        }
    }

    var maxNeuronIndex = NN.maxIndex(net, m, null, 0);
    for( var i =0; i< 35; i++) {
        out[i] = Math.floor(net[maxNeuronIndex] * v[maxNeuronIndex][i] * normalizedDigit[35] + 0.5);
    }

    for (var i = 0; i < 10; i++) {
        for (var j = 0; j < 35; j++) {
            if (out[j] != digits[i][j]) {
                break;
            } else {
                if (j == 34) {
                    return i;
                }
            }
        }
    }

    return null;
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

    var w = [];
    var v = [];
    var i, j;
    for (i =0; i< 35; i++) {
        w[i] = [];
        for (j = 0; j < m; j++) {
            w[i][j] = NN.getRandom();
        }
    }

    for (i =0; i< m; i++) {
        v[i] = [];
        for (j = 0; j < 35; j++) {
            v[i][j] = NN.getRandom();
        }
    }

    self.normalizedDigits = NN.normalizedB(self.numbers, 10, 35);
    self.normaliedW = NN.normalizedY(w, 35, m);
    self.normaliedV = NN.normalizedY(v, m, 35);

    var res = NN.teach(self.normalizedDigits, self.normaliedW, self.normaliedV);
    self.normaliedW = res.w;
    self.normaliedV = res.v;
    self.normalizedDigits = res.x;
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

    self.data = new Data();
    self.message = ko.observable("");
    self.valid = ko.observable(true);


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

        var out = NN.get(number, self.data.numbers, self.data.normaliedW, self.data.normaliedV);
        self.message('Entered number: ' + out);
    }
}

var viewModel = new ViewModel();
ko.applyBindings(viewModel);