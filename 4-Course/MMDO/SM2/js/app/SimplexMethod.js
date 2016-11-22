function SimplexMethod($limitMatrix, $function) {
    var tables = [];
    var limits = $limitMatrix;
    var func = $function;
    var basis = [];
    var processor = new TableProcessor();
    var visualizator = new Visualizator();


    SimplexMethod.prototype.displayMessage = function (minMax) {
        var str='';
        switch (minMax.errCode)
        {
            case 0:
                str = 'Серед вільних членів є від\'ємні. Навпроти кожного від\'ємного вільного члену є від\'ємні елементи. <br/>';
                str += 'min = X<sub>' + (minMax.max + 1) + '</sub> - Вводмо в базис.<br/>';
                str += 'max = X<sub>' + (minMax.lostBasis + 1) + '</sub> - Виводимо з базису.';
                return str;
            case 1:
                return "Серед оцінок знайдено додатні оцінки. Неможливо застосувати двоїстий симплекс-метод до даної задачі.";
            case 2:
                var point = minMax.point;
                str =  "Від'ємні вільні члени відсутні. Оптимальний розв'язок знайдено. X("+visualizator.fractionToString(point[0]);
                for(var i = 1; i< point.length-1; i++) {
                    str+=', ' + visualizator.fractionToString(point[i]);
                }
                str+= ') F(X) = ' + visualizator.fractionToString(point.pop());
                return str;
            case 3:
                return "Не знайдено від'ємних оцінок, над якими розміщені від'ємні елементи. МПР порожня.";
            case 4:
                return "Розв\'язок знайдено. Навпроти від'ємного вільного члену відсутні від'ємні елементи. МПР порожня.";
            case 5:
                return "Неможливо визначити базис. Будь ласка, перевірте введенні данні. При розв'язку стратегією симплекс-таблиці, задача повинна бути приведена в зручний, для застосування двоїстого симплекс-методу, вигляд.";
        }
    };

    this.findBasis = function () {
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
    this.run = function(partialSolution) {
        basis = this.findBasis();
        var table = {};
        var iteration = 0;
        if (!partialSolution) {
            table = processor.buildFirstTable(limits, func, basis);
        } else {
            if (basis.length != limits.length - 1) {
                alert(this.displayMessage({errCode: 5}));
                return;
            }
            table = limits;
        }
        if(!processor.checkMarks(table)) {
            alert(this.displayMessage({errCode: 1}));
            return;
        };
        var minMax = processor.findMinMax(table, basis);

        var obj = {
            table: visualizator.prepareTable(table, basis, minMax),
            i: iteration,
            minMax: minMax
        };

        tables.push(obj);
        while(minMax.errCode == 0) {
            minMax.lostBasis = basis[minMax.min];
            basis[minMax.min] = minMax.max;

            table = processor.processNext(table, minMax.max, minMax.min);
            iteration++;
            minMax = processor.findMinMax(table, basis);

            obj = {
                table: visualizator.prepareTable(table, basis, minMax),
                i: iteration,
                minMax: minMax
            };

            tables.push(obj)
        }

        return tables;
    }
}
