function Gomori($table, $function, $listOfInt) {

    var self = this;
    self._table = $table;
    self._function = $function;
    self._listOfInt = $listOfInt;
    self._currentIndex = null;
    self._creationMessage = "";
    self._iteration = 0;
    var visualizator = new Visualizator();

    this.displayMessage = function (minMax) {
        var str='';
        switch (minMax.errCode)
        {
            case 0:
                return "<span class=\"alarm\">Умова цілочисельності не виконується. Твірний рядок: " + (this._currentIndex + 1) + "</span><br/>"
                    + this._creationMessage;
            case 2:
                var point = minMax.point;
                str =  "<span class=\"solution\">Умова цілочисельності виконується. Оптимальний розв'язок знайдено. X("+visualizator.fractionToString(point[0]);
                for(var i = 1; i< point.length-1; i++) {
                    str+=', ' + visualizator.fractionToString(point[i]);
                }
                str+= ') F(X) = ' + visualizator.fractionToString(point.pop());
                str += "</span>";
                return str;
        }
    };

    this.findBasis = function ($limitMatrix) {
        var basis = [];
        for (var i = 0; i< $limitMatrix.length; i++) {
            for (var j = 0; j< $limitMatrix[i].length; j++) {
                if ($limitMatrix[i][j].eq(1)) {
                    var count = 0;
                    for (var x = 0; x < $limitMatrix.length; x++) {
                        if(!$limitMatrix[x][j].eq(0)) {
                            count ++;
                        }
                    }
                    if (count == 1) {
                        basis.push(j);
                        break;
                    }
                }
            }
        }
        return basis;
    };

    this.run = function () {
        var simplex = new SimplexMethod(self._table, self._function);

        var result = simplex.run();
        var $cont = $('#output');
        var inf;

        for (var i = 0; i < result.length; i++) {
            result[i].table.appendTo($cont);
            inf = $('<div>');
            var str = 'Ітерація: ' + result[i].i + '<br/>';
            str += simplex.displayMessage(result[i].minMax) + '<br/>';
            inf.html(str);
            inf.appendTo($cont);
        }
        this._table = result[i - 1].tableData;

        var table;
        while (table = this.GomoriProcessTable(this._table)) {
            this._table = table;
            this._iteration ++ ;

            inf = $('<div>');
            inf.html(this.displayMessage({errCode:  0}));
            inf.appendTo($cont);

            var ds = new DualSimplexMethod(this._table, this._function);
            result = ds.run(1);
            for (var i = 0; i < result.length; i++) {
                result[i].table.appendTo($cont);
                inf = $('<div>');
                str = 'Ітерація: ' + result[i].i + '<br/>';
                str += ds.displayMessage(result[i].minMax) + '<br/>';
                inf.html(str);
                inf.appendTo($cont);
            }

            if (result[i - 1].minMax.errCode == 4) {
                break;
            }

            this._table = result[result.length - 1].tableData;
        }

        return result[i - 1];
    };

    this.GomoriProcessTable = function (table) {

        var max = new Fraction(0), current = new Fraction(0), index = -1;
        var basis = this.findBasis(table);
        for (var i = 0; i < table.length - 1; i++) {
            current = table[i][table[i].length - 1].getResidue();
            if (this._listOfInt.indexOf(basis[i]) != -1 && max.lt(current)) {
                index = i;
                max = current;
            }
        }

        if (index == -1) {
            this._currentIndex = null;
            return null;
        }
        this._currentIndex = index;


        return this.initiate(table, index);
    };

    this.initiate = function(table, index) {
        var line = [], element, a;
        for (var i =0 ;i< table[index].length -1 ; i++) {
            if (this._listOfInt.indexOf(i) != -1) {
                if (table[index][table[index].length - 1].lt(table[index][i])) {
                    element = table[index][table[index].length - 1].getResidue();
                    a = new Fraction(1, 1);
                    element.div(a.min(table[index][table[index].length - 1].getResidue()));
                    a = new Fraction(1, 1);
                    a.min(table[index][i].getResidue());
                    element.mult(a);
                } else {
                    element = table[index][i].getResidue();
                }
            } else {

                if (table[index][i].lt(0)) {
                    element = table[index][table[index].length - 1].getResidue();
                    a = new Fraction(1, 1);
                    element.div(a.min(table[index][table[index].length - 1].getResidue()));
                    a = new Fraction(table[index][i].getDividend(), table[index][i].getDivisor());
                    a.mult(-1);
                    element.mult(a);
                } else {
                    element = new Fraction(table[index][i].getDividend(), table[index][i].getDivisor());
                }
            }
            if (!element.eq(0))
            this._creationMessage += visualizator.fractionToString(element) + "X<sup>" + (i+1) + "</sup> + ";
            line.push(element.mult(-1));
        }

        this._creationMessage += " S<sup>" + this._iteration + "</sup> = ";
        line.push(new Fraction(1, 1));
        line.push(table[index][table[index].length - 1].getResidue().mult(-1));
        this._creationMessage += visualizator.fractionToString(line[line.length - 1]);

        for(var i = 0 ; i < table.length; i++) {
            table[i].push(table[i][table[i].length - 1]);
            table[i][table[i].length - 2] = new Fraction(0, 1);
        }

        table.push(table[table.length - 1]);
        table[table.length - 2] = line;

        this._function.push(new Fraction(0, 1));
        return table;
    }
};