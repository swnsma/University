Visualizator = (function ($) {
    var instance;

    function Visualizator() {
        if (!instance) {
            instance = this;
        } else {
            return instance;
        }
    }

    Visualizator.prototype.prepareFraction = function ($fraction) {
        var table = $('<table>');
        var tr = $('<tr>');
        tr.appendTo(table);
        var td = $('<td>');
        var str = '';
        if(Math.abs(Math.round($fraction.getDividend() / M)) >= 1) {
            var m = Math.round($fraction.getDividend() / M);
            var free = $fraction.getDividend() - (m * M);
            str += m+'M'+ (free > 0? '+'+free: free==0?'':free);
        } else {
            str += $fraction.getDividend();
        }

        td.text(str);
        td.appendTo(tr);

        if ($fraction.getDivisor() != 1) {
            tr = $('<tr>');
            tr.appendTo(table);
            td = $('<td>');
            td.addClass('divisor');
            td.text($fraction.getDivisor());
            td.appendTo(tr);
        }
        return table;
    };

    function prepareTableHeader(count) {
        var th = $('<thead>');
        var tr = $('<tr>');
        var td = $('<td>');
        td.text('Змінні');
        td.appendTo(tr);
        for (var i = 0; i < count - 1; i++) {
            td = $('<td>');
            td.html('X<sub>' + (i + 1) + '<sub/>');
            td.appendTo(tr);
        }
        td = $('<td>');
        td.text('В.Ч.');
        td.appendTo(tr);
        tr.appendTo(th);
        return th;
    }

    Visualizator.prototype.fractionToString = function ($fraction) {
        var str = '';
        if ($fraction.getDivisor() != 1) {
            str += '<sup>';

            if(Math.round($fraction.getDividend() / M) >= 1) {
                var m = Math.round($fraction.getDividend() / M);
                var free = $fraction.getDividend() / M - m * M;
                str += (m==1? '': m == -1 ? '-' : m) + 'M' + free;
            } else {
                str += $fraction.getDividend();
            }

            str += '</sup>/' + '<sub>' + $fraction.getDivisor() + '</sub>';
        } else {
            str += $fraction.getDividend();
        }

        return str;

    };

    Visualizator.prototype.prepareTable = function ($table, basis, minMax) {
        var table = $('<table>');
        table.attr('cellspacing', '0');
        table.attr('border', '2');
        var tr = prepareTableHeader($table[0].length);
        tr.appendTo(table);
        var td;
        var content;
        for (var i = 0; i < $table.length; i++) {
            tr = $('<tr>');
            td = $('<td>');
            if (i != $table.length - 1) {
                td.html('X<sub>' + (basis[i] + 1) + '</sub>');
            } else {
                td.html('F');
            }
            td.addClass('labels');
            td.appendTo(tr);

            for (var j = 0; j < $table[i].length; j++) {
                td = $('<td>');
                if (i == minMax.min && j == minMax.max) {
                    td.addClass('target');
                } else {
                    if (i == minMax.min || j == minMax.max) {
                        td.addClass('matched');
                    }
                }

                content = this.prepareFraction($table[i][j]);
                content.appendTo(td);
                td.appendTo(tr);
            }
            tr.appendTo(table);
        }

        return table;
    };

    return Visualizator;
})($);