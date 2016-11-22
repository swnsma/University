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
                str = 'Серед оцінок є додатні. Над усіма додатніми оцінками є додатні елементи. <br/>';
                str += 'min = X<sub>' + (minMax.max + 1) + '</sub> - Вводмо в базис.<br/>';
                str += 'max = X<sub>' + (minMax.lostBasis + 1) + '</sub> - Виводимо з базису.';
                return str;
            case 1:
                return "Над однією з додатніх оцінок відсутні додатні елементи. Функція цілі необмежена на МПР.";
            case 2:
                var point = minMax.point;
                str =  "Додатні оцінки відсутні. Оптимальний розв'язок знайдено. X("+visualizator.fractionToString(point[0]);
                for(var i = 1; i< point.length-1; i++) {
                    str+=', ' + visualizator.fractionToString(point[i]);
                }
                str+= ') F(X) = ' + visualizator.fractionToString(point.pop());
                return str;
            case 3:
                str =  "Розв\'язок знайдено. Не всі штучні змінні дорівнюють нулю. МПР порожня. (";
                for (var j = 0; j< minMax.ahtung.length; j++){
                    str+= "X<sub>" + (minMax.ahtung[j].x+1) + "</sub> = " + visualizator.fractionToString(minMax.ahtung[j].val) + "; ";
                }
                return str + ")";
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
    this.run = function() {
        this.findBasis();
        var iteration = 0;
        var table = processor.buildFirstTable(limits, func, basis);
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
