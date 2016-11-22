function Transformator($table, $function, $conditions, $inalienability, $direction) {
    this._table = $table;
    this._before = $function.length;
    this._conditions = $conditions;
    this._function = $function.slice();
    this._direction = $direction;
    this._processedRows = [];
    this._artificial = [];
    this._inalienability = $inalienability;
    this._segregated = [];
    this._transformed = {
        direction: false,
        extraVars: false,
        artificialVars: false,
        results: false,
        inalienability: false
    };

    this.processFirstStep = function () {
        if (this._direction == -1) {
            for (var i = 0; i < this._function.length; i++) {
                this._function[i].mult(this._direction);
            }
            this._transformed.direction = true;
        }
    };

    this.processSecondStep = function () {
        for (var i = 0; i < this._table.length; i++) {
            if ((this._table[this._table[i].length - 1] < 0) || (this._table[this._table[i].length - 1] == 0 && this._conditions[i] == 1)) {
                for (var j = 0; j < this._table[i].length; j++) {
                    this._table[i][j].mult(-1);
                    this._conditions[i] *= -1;
                }
                this._transformed.results = true;
            }
        }
    };

    this.processThirdStep = function () {
        for (var i = 0; i < this._conditions.length; i++) {
            if (this._conditions[i] == -1) {
                this._function.push(new Fraction(0));
                for (var j = 0, k = this._table[i].length - 1; j < this._table.length; j++) {
                    var z = this._table[j][k];
                    this._table[j][k] = new Fraction((j == i ? 1 : 0));
                    this._table[j][k + 1] = z;
                }
                k++;
                this._conditions[i] = 0;
                this._processedRows.push(i);
                this._transformed.extraVars = true;
            }
        }
    };

    this.processFourthStep = function () {
        var minus = [];
        for (var i = 0; i < this._conditions.length; i++) {
            if (this._conditions[i] == 1) {
                this._function.push(new Fraction(0));
                for (var j = 0, k = this._table[i].length - 1; j < this._table.length; j++) {
                    var z = this._table[j][k];
                    this._table[j][k] = new Fraction((j == i ? -1 : 0));
                    this._table[j][k + 1] = z;
                }
                minus.push(i);
                k++;
                this._conditions[i] = 0;
                this._transformed.extraVars = true;
            }
        }
        var simple = new SimplexMethod(this._table, this._function);
        var basis = simple.findBasis();
        if (basis.length == this._table.length) {
            return;
        }

        var marked = -1, max = new Fraction(-1);
        if (minus.length){
            for (i = 0, k = this._table[i].length - 1; i < this._table.length; i++) {
                if (this._table[i][k].gt(max) && this._processedRows.indexOf(i) == -1) {
                    max = this._table[i][k];
                    marked = i;
                }
            }

            for (i = 0; i < this._table.length; i++) {
                if (i != marked && minus.indexOf(i) != -1) {
                    for (j = 0; j < this._table[i].length; j++) {
                        this._table[i][j] = Fraction.calculate(this._table[marked][j], this._table[i][j], '-');
                    }
                }
            }
        }
        for (i = 0; i < this._table.length; i++) {
            var flag = true;
            for (var x =0; x< basis.length; x++) {
                if (this._table[i][basis[x]].eq(1)) {
                   flag = false;
                    break;
                }
            }
            if (flag && this._processedRows.indexOf(i) == -1 && (minus.indexOf(i) == -1 || i == marked)) {
                this._function.push(new Fraction(M));
                for (j = 0, k = this._table[i].length - 1; j < this._table.length; j++) {
                    z = this._table[j][k];
                    this._table[j][k] = new Fraction((j == i ? 1 : 0));
                    this._table[j][k + 1] = z;
                }
                this._artificial.push(k);
                k++;
                this._transformed.artificialVars = true;
            }
        }
    };

    this.processFifthStep = function() {
        for(var i = 0, j = 0; i< this._inalienability.length; i++, j++) {
            if (this._inalienability[i] == 0) {
                j++;
                this._function.splice(j, 0, new Fraction(
                    this._function[j-1].getDividend() * -1,
                    this._function[j-1].getDivisor()));
                this._segregated.push(j-1);
                this._transformed.inalienability = true;

                for(var x = 0; x < this._table.length; x++) {
                    this._table[x].splice(j, 0,
                        new Fraction(this._table[x][j-1].getDividend() * -1, this._table[x][j-1].getDivisor()));
                }
            }
        }

    };

    this.getTable = function () {
        return this._table;
    };

    this.getFunction = function () {
        return this._function;
    };


    this.transform = function () {
        this.processFirstStep();
        this.processSecondStep();
        this.processThirdStep();
        this.processFourthStep();
        this.processFifthStep();

        return this._transformed;
    }
}