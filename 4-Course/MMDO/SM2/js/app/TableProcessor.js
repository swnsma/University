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

        var result = {min:-1, max:-1, errCode: 0}, min = 1, j = table[0].length - 1;

        result.point = [];

        for (var i = 0; i < table.length - 1; i++) {
            if (table[i][j].lt(0)) {
                if (table[i][j].lt(min)) {
                    result.min = i;
                    min = table[i][j];
                }
            }
        }

        if (min > 0) {
            result.errCode = 2;
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

        //actually, this is minimum coefficient.
        var max;
        for (j = 0, i = result.min; j < table[i].length-1; j++) {
            if (table[i][j].lt(0)) {
                var el = Fraction.calculate(table[table.length - 1][j], table[i][j], '/');

                if((max && el.lt(max)) || (!max && (el.gt(0) || el.eq(0)))) {
                    result.max = j;
                    max = el;
                }
            }
        }

        if (result.max == -1) {
            result.errCode = 4;
        }

        return result;
    };

    TableProcessor.prototype.checkMarks = function(table) {
        var i = table.length - 1;
        for (var j = 0; j < table[i].length - 1; j++) {
            if (table[i][j].gt(0)) {
                return false;
            }
        }

        return true;
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