function Kernel() {
    var self = this;
    this.testRun  = function() {
        var lim = [
            [new Fraction(-1), new Fraction(-3), new Fraction(-16)],
            [new Fraction(-2), new Fraction(-1), new Fraction(-18)]
        ];
        var fun = [new Fraction(2), new Fraction(3)];
        var signs = [-1, -1];
        var direction = -1;
            var trans = new Transformator(lim, fun, signs, direction);
            var result = trans.transform();

            for(var r in result) {
                if (result[r]) {
                    self.withTransformation(lim, fun, trans, result);
                    return;
                }
            }

            self.withoutTransformation(lim, fun);
    };

    this.testRunSimplexTable = function() {
        var lim = [
            [new Fraction(0), new Fraction(-5, 2), new Fraction(1, 1), new Fraction(-1, 2), new Fraction(-7, 1)],
            [new Fraction(1), new Fraction(1, 2), new Fraction(0), new Fraction(-1, 2), new Fraction(9)],
            [new Fraction(0), new Fraction(-2), new Fraction(0), new Fraction(-1), new Fraction(18)]
        ];

        var fun = [new Fraction(2), new Fraction(3), new Fraction(0), new Fraction(3)];

        this.withoutTransformation(lim, fun, true);
    };

    this.getBack = function() {
        var $cont = $('#container');
        $cont.html('');
        self.runApplication();
    };

    this.runApplication = function() {

        var inp = new Inputer();
        var $cont = $('#container');
        var getBack = $('<button>');
        getBack.text('Повернутися').addClass('btn').addClass('btn-danger').addClass('get-back');
        getBack.on('click', self.getBack);
        inp.generateMetaDataInput($cont, getBack, function(variables, limits, strategy){

            if (strategy == 1) {
            inp.generateInputTable($('#container'), variables, limits, function(lim, fun, signs, inalienability, direction, ints) {
                var trans = new Transformator(lim, fun, signs, inalienability, direction);
                var result = trans.transform();
                for(var r in result) {
                    if (result[r]) {
                        self.withTransformation(lim, fun, trans, result, ints);
                        return;
                    }
                }

                self.withoutTransformation(lim, fun, ints);
            });
            }

            if (strategy == 2) {
                inp.generateSimplexTable($('#container'), limits, variables, function(lim, fun) {
                    self.withoutTransformation(lim, fun, true);
                });
            }
        });
    };

    this.withTransformation = function(lim, func, transform, result, ints) {
        var gomori = new Gomori(transform.getTable(), transform.getFunction(), ints);
        var $cont = self.getOutputContainer();
        $cont.appendTo($('#container'));

        var extractedData = gomori.run();

        var minMax = extractedData.minMax;
            var value = extractedData.tableData[extractedData.tableData.length - 1]
                [extractedData.tableData[extractedData.tableData.length - 1].length - 1];
            if (result.direction) {
                value.mult(-1);
            }

            if (result.artificialVars) {
                minMax.ahtung = [];
                for (var j = 0; j < transform._artificial.length; j++) {
                    if (!minMax.point[transform._artificial[j]].eq(0)) {
                        minMax.errCode = 3;
                        var obj = {};
                        obj.x = transform._artificial[j];
                        obj.val = minMax.point[transform._artificial[j]];
                        minMax.ahtung.push(obj);
                    }
                }
            }

            if(transform._transformed.inalienability){
                var arr = [];
                for (var x = 0; x < minMax.point.length; x++) {
                    if (transform._segregated.indexOf(x) != -1) {
                        arr.push(Fraction.calculate(minMax.point[x], minMax.point[x+1], '-'));
                        x++;
                    } else {
                        arr.push(minMax.point[i]);
                    }
                }
                minMax.point = arr;
            }

            minMax.point = minMax.point.splice(0, transform._before);
            minMax.point.push(value);
        var inf = $('<div>');
        var str = gomori.displayMessage(minMax) + '<br/>';
        inf.html(str);
        inf.appendTo($cont);
    };

    this.getOutputContainer = function() {
        var out = $('#output');
        if (out.length) {
            out.remove();
        }

        return $('<div>').attr('id', 'output');
    };

    this.withoutTransformation = function(lim, fun, ints) {
        var gomori = new Gomori(lim, fun, ints);
        var $cont = self.getOutputContainer();
        $cont.appendTo($('#container'));
        gomori.run();
    }
}