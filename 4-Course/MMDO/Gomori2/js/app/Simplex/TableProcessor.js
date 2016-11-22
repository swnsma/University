TableProcessor = (function()
{
    var instance;

    function TableProcessor(){
        if (!instance) {
            return instance;
        } else {
            instance = this;
        }
    }

    TableProcessor.prototype.buildFirstTable = function(limits, coeficients, basis) {
      var table = limits, marks = [];
        for(var i =0; i < limits[0].length; i++) {
            marks.push(Fraction.calculate(limits[0][i], coeficients[basis[0]], '*'));
        }
        for (i = 1; i<limits.length; i++) {
            for (var j = 0; j < limits[i].length; j++) {
                marks[j].add(Fraction.calculate(limits[i][j], coeficients[basis[i]], '*'));
            }
        }

        for(i = 0; i< coeficients.length; i++) {
            marks[i].min(coeficients[i]);
        }

        table.push(marks);

        return table;
    };

    TableProcessor.prototype.findMinMax = function(table, basis) {
        var result = {min:-1, max:-1, errCode: 0}, max = -1, j = table.length - 1;
        for (var i = 0; i < table[j].length - 1; i++) {
            if (table[j][i].gt(0)) {
                var p = 0;
                for(var k = 0; k < j; k++) {
                    if(table[k][i].gt(0)) {
                        p++;
                    }
                }
                if (p == 0) {
                    result.errCode = 1;
                }

                if (table[j][i].gt(max)) {
                    result.max = i;
                    max = table[j][i];
                }
            }
        }

        if (result.max < 0) {
            result.errCode = 2;
            result.point = [];
            for (i = 0; i< table[0].length-1; i++ ) {
                var index = basis.indexOf(i);
                if (index != -1 ){
                    result.point.push(table[index][table[index].length-1]);
                } else {
                   result.point.push(new Fraction(0));
                }
            }
            result.point.push(table[table.length-1][table[0].length-1]);
            return result;
        }

        var min;
        for (j = 0, i = result.max; j < table.length-1; j++) {
            if (table[j][i].gt(0)) {
                var el = Fraction.calculate(table[j][table[0].length - 1], table[j][i], '/');

                if((min && el.lt(min)) || (!min && (el.gt(0) || el.eq(0)))) {
                    result.min = j;
                    min = el;
                }
            }
        }

        return result;
    };

    TableProcessor.prototype.processNext = function(table, newBasis, basisPos) {
        var curVal = table[basisPos][newBasis];
        var newTable = new Array(table.length);
        for (var i=0; i< table.length; i++) {
            newTable[i] = new Array(table[i].length);
        }

        for (i = 0; i < table[basisPos].length; i++) {
            newTable[basisPos][i] = Fraction.calculate(table[basisPos][i], curVal, '/');
        }

        for (i = 0; i < table.length; i++) {
            if (i == basisPos) continue;
            var el = Fraction.calculate(table[i][newBasis], -1, '*');
            for (var j=0; j < table[i].length; j++) {
                newTable[i][j] = Fraction.calculate(
                    table[i][j],
                    Fraction.calculate(el, newTable[basisPos][j], '*')
                );
            }
        }

        return newTable;
    };

    return TableProcessor;
})();