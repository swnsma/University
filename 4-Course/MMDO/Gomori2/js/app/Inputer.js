function Inputer() {

    var arr = [
        {val: 1, text: 1},
        {val: 2, text: 2},
        {val: 3, text: 3},
        {val: 4, text: 4},
        {val: 5, text: 5},
        {val: 6, text: 6},
        {val: 7, text: 7},
        {val: 8, text: 8},
        {val: 9, text: 9},
        {val: 10, text: 10}
    ];

    var signs = [
        {val: 0, text: '='},
        {val: -1, text: '=<'},
        {val: 1, text: '=>'}
    ];


    var self = this;
    this.metaData = null;
    this.generateMetaDataInput = function($node, $getBack, callback) {
        self.metaData = $('<div>');
        self.metaData.appendTo($node);
        var container = $('<div>');
        container.appendTo(self.metaData);
        var label = $('<span>');
        var variables  = $('<select>').addClass('btn-warning');
        $(arr).each(function(){
            if (this.val>=2)
            variables.append($('<option>').attr('value', this.val).text(this.text));
        });
        label.text('Кількість змінних: ');
        label.appendTo(container);
        variables.appendTo(container);

        container = $('<div>');
        container.appendTo(self.metaData);
        label = $('<span>');
        var limits  = $('<select>').addClass('btn-warning');
        $(arr).each(function(){
            limits.append($('<option>').attr('value', this.val).text(this.text));
        });
        label.text('Кількість обмежень: ');
        label.appendTo(container);
        limits.appendTo(container);
        var submit = $('<button>');
        submit.text('Система рівнянь').addClass('btn').addClass('btn-info');
        submit.appendTo(self.metaData);
        submit.on('click', function() {
            $getBack.appendTo($node);
            self.metaData.hide();
            callback(variables.val(), limits.val(), 1);
        });

        submit = $('<button>');
        submit.text('Симплекс таблиця').addClass('btn').addClass('btn-info');
        submit.appendTo(self.metaData);

        submit.on('click', function() {
            $getBack.appendTo($node);
            self.metaData.hide();
            callback(variables.val(), limits.val(), 2)
        })

    };

    this.generateSimplexTable = function($node, h, w, callback) {
        $node = $('<div>').addClass('conditions').appendTo($node);
        var container = $('<div>');
        var label;
        container.html('Функція цілі F(x):<br/>');
        container.appendTo($node);
        var inputsF = [];
        for (var i=0; i < w-1; i++) {
            input = $('<input>').val(0).addClass('form-control');
            inputsF.push(input);
            input.appendTo(container);
            slash = $('<span>/</span>');
            slash.appendTo(container);
            input = $('<input>').val(1).addClass('form-control');
            inputsF.push(input);
            input.appendTo(container);


            label = $('<span>');
            label.html('X<sub>' + (i+1) + '</sub> + ');
            label.appendTo(container);
        }
        input = $('<input>').val(0).addClass('form-control');
        inputsF.push(input);
        slash = $('<span>/</span>');
        input.appendTo(container);
        slash.appendTo(container);
        input = $('<input>').val(1).addClass('form-control');
        inputsF.push(input);
        input.appendTo(container);
        label = $('<span>');
        label.html('X<sub>' + (i+1) + '</sub>');
        label.appendTo(container);
        container.addClass('form-group');
        container = $('<table>').appendTo(container);
        container.attr('cellspacing', '0');
        container.attr('border', '2');

        var row, cell, slash, input, inputs = [];

        row = $('<tr>');
        row.appendTo(container);
        for (var i=0; i< +w ; i++) {
            cell = $('<td>').html('X<sup>' + (i +1) + '</sup>');
            cell.appendTo(row);
        }

        cell = $('<td>');
        cell.html('В.Ч.');
        cell.appendTo(row);

        for(var i =0; i< +h + 1; i++ ) {
            row = $('<tr>');
            inputs[i] = [];
            for (var j =0; j< +w + 1; j++) {
                cell = $('<td>');
                input = $('<input>').val(0).addClass('form-control');
                input.appendTo(cell);
                inputs[i].push(input);
                slash = $('<span>/</span>');
                slash.appendTo(cell);
                input = $('<input>').val(1).addClass('form-control');
                input.appendTo(cell);
                inputs[i].push(input);
                cell.appendTo(row);
            }
            row.appendTo(container);
        }
        var button = $('<button>');
        button.text('PROCESS').addClass('btn').addClass('btn-info');
        button.on('click', function() {
            var table = [], f = [];
            for (var i =0; i< inputs.length; i++) {
                table[i] = [];
                for (var j =0; j< inputs[i].length; j++) {
                    table[i].push(new Fraction(inputs[i][j].val(), inputs[i][++j].val()));
                }
            }

            for (var i = 0; i< inputsF.length; i++) {
                f.push(new Fraction(inputsF[i].val(), inputsF[++i].val()))
            }
            callback(table, f);

        });
        button.appendTo($node);


    };


    this.generateInputTable = function($node, variables, limits, callback) {
        $node = $('<div>').addClass('conditions').appendTo($node);
        var container = $('<div>');
        container.html('Функція цілі F(x):<br/>');
        container.appendTo($node);
        var inputs = [];
        var input;
        var label, slash;
        for (var i=0; i < variables-1; i++) {
            input = $('<input>').val(0).addClass('form-control');
            inputs.push(input);
            input.appendTo(container);
            slash = $('<span>/</span>');
            slash.appendTo(container);
            input = $('<input>').val(1).addClass('form-control');
            inputs.push(input);
            input.appendTo(container);


            label = $('<span>');
            label.html('X<sub>' + (i+1) + '</sub> + ');
            label.appendTo(container);
        }
        input = $('<input>').val(0).addClass('form-control');
        inputs.push(input);
        slash = $('<span>/</span>');
        input.appendTo(container);
        slash.appendTo(container);
        input = $('<input>').val(1).addClass('form-control');
        inputs.push(input);
        input.appendTo(container);
        label = $('<span>');
        label.html('X<sub>' + (i+1) + '</sub>');
        label.appendTo(container);
        label = $('<span>');
        label.html('&rarr;');
        label.appendTo(container);
        container.addClass('form-group');
        var select = $('<select>').addClass('btn-info');
        $('<option>').attr('value', '1').text('min').appendTo(select);
        $('<option>').attr('value', '-1').text('max').appendTo(select);
        select.appendTo(container);

        container = $('<div>');
        container.html('Система лінійних обмежень:<br/>');
        container.appendTo($node);
        var limitInputs = [];
        var signInputs = [];
        var row, cell;
        for(i = 0; i < limits; i++) {
            limitInputs[i] = [];
            row = $('<div>');
            row.appendTo(container);
            for(var j=0; j < variables-1; j++) {
                cell = $('<input>').val(0).addClass('form-control');
                label = $('<span>');
                label.html('X<sub>' +(j+1) + '</sub> + ');
                cell.appendTo(row);
                limitInputs[i].push(cell);
                cell = $('<input>').val(1).addClass('form-control');
                slash = $('<span>/</span>');
                slash.appendTo(row);
                cell.appendTo(row);
                label.appendTo(row);
                limitInputs[i].push(cell);
            }
            cell = $('<input>').val(0).addClass('form-control');
            label = $('<span>');
            label.html('X<sub>' +(j+1) + '</sub>');
            limitInputs[i].push(cell);
            cell.appendTo(row);
            cell = $('<input>').val(1).addClass('form-control');
            limitInputs[i].push(cell);
            slash = $('<span>/</span>');
            slash.appendTo(row);
            cell.appendTo(row);
            label.appendTo(row);
            cell = $('<select>').addClass('btn-info').addClass('sign-option');
            $(signs).each(function(){
                cell.append($('<option>').attr('value', this.val).text(this.text));
            });
            signInputs.push(cell);
            cell.appendTo(row);
            cell = $('<input>').val(0).addClass('form-control');
            limitInputs[i].push(cell);
            cell.appendTo(row);
            cell = $('<input>').val(1).addClass('form-control');
            limitInputs[i].push(cell);
            slash = $('<span>/</span>');
            slash.appendTo(row);
            cell.appendTo(row);
        }
        var inalienability = [];
        row = $('<div>');
        for ( i =0; i< variables; i++) {
            cell = $('<select>')
                .append($('<option>').attr('value', '1').text('+'))
                .append($('<option>').attr('value', '0').text('-'));
            cell.addClass('sign-option').addClass('btn-info').addClass('inalienability').appendTo(row);
            inalienability.push(cell);
        }
        row.appendTo(container);

        var button = $('<button>');
        button.text('PROCESS').addClass('btn').addClass('btn-info');
        button.on('click', function() {
            var extractedTable = [];
            for(var i=0; i<limitInputs.length; i++) {
                extractedTable[i] = [];
                for(var j = 0, k = 0; j<limitInputs[i].length; j++, k++) {
                    extractedTable[i][k] = new Fraction(limitInputs[i][j].val(), limitInputs[i][++j].val());
                }
            }
            var extractedS = [];
            for(i = 0; i < signInputs.length; i++) {
                extractedS.push(signInputs[i].val());
            }
            var extractedI = [];
            for(i = 0; i< inalienability.length; i++) {
                extractedI.push(inalienability[i].val());
            }

            var extractedF = [];
            for(i = 0; i < inputs.length; i++) {
                extractedF.push(new Fraction(inputs[i].val(), inputs[++i].val()));
            }

            callback(extractedTable, extractedF, extractedS, extractedI, select.val());

        });
        button.appendTo($node);
    };

}