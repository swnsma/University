function Kernel() {

    var self = this;
    this.testRun  = function() {
        var lim = [
            [new Fraction(1), new Fraction(4), new Fraction(-1), new Fraction(4)],
            [new Fraction(2), new Fraction(-1), new Fraction(1), new Fraction(1)],
            [new Fraction(-2), new Fraction(0), new Fraction(-8), new Fraction(10)],
            [new Fraction(5), new Fraction(1), new Fraction(0), new Fraction(3)]
        ];
        var fun = [new Fraction(-2), new Fraction(-6), new Fraction(1)];
        var signs = [1, 1, -1, 0];
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

    this.runApplication = function() {

        var inp = new Inputer();
        inp.generateMetaDataInput($('#container'), function(variables, limits){
            inp.generateInputTable($('#container'), variables, limits, function(lim, fun, signs, inalienability, direction) {
                var trans = new Transformator(lim, fun, signs, inalienability, direction);
                var result = trans.transform();

                for(var r in result) {
                    if (result[r]) {
                        self.withTransformation(lim, fun, trans, result);
                        return;
                    }
                }

                self.withoutTransformation(lim, fun);
            });
        });
    };

    this.withTransformation = function(lim, func, transform, result) {
        var Simplex = new SimplexMethod(transform.getTable(), transform.getFunction());
        var extractedData = Simplex.run();
        var $cont = $('#container');
        var inf;
        for (var i = 0; i < extractedData.length - 1; i++) {
            extractedData[i].table.appendTo($cont);
            inf = $('<div>');
            var str = 'Ітерація: ' + extractedData[i].i + '<br/>';
            str += Simplex.displayMessage(extractedData[i].minMax) + '<br/>';
            inf.html(str);
            inf.appendTo($cont);
        }
        var minMax = extractedData[i].minMax;
        if (minMax.errCode != 1) {
            var value = minMax.point[minMax.point.length - 1];
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
        }
        extractedData[i].table.appendTo($cont);
        inf = $('<div>');
        str = 'Ітерація: ' + extractedData[i].i + '<br/>';
        str += Simplex.displayMessage(minMax) + '<br/>';
        inf.html(str);
        inf.appendTo($cont);
    };

    this.withoutTransformation = function(lim, fun) {
        var Simplex = new SimplexMethod(lim, fun);
        var extractedData = Simplex.run();
        var $cont = $('#container');
        var inf;
        for (var i = 0; i < extractedData.length; i++) {
            extractedData[i].table.appendTo($cont);
            inf = $('<div>');
            var str = 'Ітерація: ' + extractedData[i].i + '<br/>';
            str += Simplex.displayMessage(extractedData[i].minMax) + '<br/>';
            inf.html(str);
            inf.appendTo($cont);
        }
    }
}