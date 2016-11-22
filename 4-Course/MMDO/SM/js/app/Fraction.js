function Fraction(dividend, divisor)
{
    this._dividend = dividend;
    this._divisor = typeof divisor !== 'undefined' ? divisor : 1;
    this._optimizer = new Optimizer();
}

Fraction.prototype.lt = function($fraction) {
    var fDividend, fDivisor;
    if ($fraction instanceof Fraction) {
        fDividend = $fraction.getDividend();
        fDivisor = $fraction.getDivisor();
    } else {
        fDividend = $fraction;
        fDivisor = 1;
    }

    var div  = this._dividend * fDivisor;
    fDividend *= this._divisor;

    return div < fDividend;
};
Fraction.prototype.gt = function($fraction) {
    var fDividend, fDivisor;
    if ($fraction instanceof Fraction) {
        fDividend = $fraction.getDividend();
        fDivisor = $fraction.getDivisor();
    } else {
        fDividend = $fraction;
        fDivisor = 1;
    }

    var div  = this._dividend * fDivisor;
    fDividend *= this._divisor;

    return div > fDividend;
};
Fraction.prototype.eq = function($fraction) {
    var fDividend, fDivisor;
    if ($fraction instanceof Fraction) {
        fDividend = $fraction.getDividend();
        fDivisor = $fraction.getDivisor();
    } else {
        fDividend = $fraction;
        fDivisor = 1;
    }

    var div  = this._dividend * fDivisor;
    fDividend *= this._divisor;

    return div == fDividend;
};
Fraction.prototype.add = function($fraction) {
    var fDividend, fDivisor;
    if ($fraction instanceof Fraction) {
        fDividend = $fraction.getDividend();
        fDivisor = $fraction.getDivisor();
    } else {
        fDividend = $fraction;
        fDivisor = 1;
    }
    this._dividend *= fDivisor;
    fDividend *= this._divisor;
    this._divisor = fDivisor * this._divisor;

    this._dividend += fDividend;
    this._optimizer.optimizeFraction(this);
};
Fraction.prototype.min = function ($fraction) {
    var fDividend, fDivisor;
    if ($fraction instanceof Fraction) {
        fDividend = $fraction.getDividend();
        fDivisor = $fraction.getDivisor();
    } else {
        fDividend = $fraction;
        fDivisor = 1;
    }

    this._dividend *= fDivisor;
    fDividend *= this._divisor;
    this._divisor = fDivisor * this._divisor;

    this._dividend -= fDividend;
    this._optimizer.optimizeFraction(this);
};
Fraction.prototype.div = function($fraction) {
    var fDividend, fDivisor;
    if ($fraction instanceof Fraction) {
        fDividend = $fraction.getDividend();
        fDivisor = $fraction.getDivisor();
    } else {
        fDividend = $fraction;
        fDivisor = 1;
    }

    if (fDividend < 0) {
        fDividend *= -1;
        fDivisor *= -1;
    }

    this._dividend *= fDivisor;
    this._divisor *= fDividend;

    this._optimizer.optimizeFraction(this);
};
Fraction.prototype.mult = function($fraction) {
    var fDividend, fDivisor;
    if ($fraction instanceof Fraction) {
        fDividend = $fraction.getDividend();
        fDivisor = $fraction.getDivisor();
    } else {
        fDividend = $fraction;
        fDivisor = 1;
    }

    this._dividend *= fDividend;
    this._divisor *= fDivisor;

    this._optimizer.optimizeFraction(this);
};
Fraction.prototype.getDividend = function() {
    return this._dividend;
};
Fraction.prototype.getDivisor = function() {
    return this._divisor;
};
Fraction.prototype.setDividend = function($new) {
    this._dividend = $new;
};
Fraction.prototype.setDivisor = function($new) {
    if ($new == 0) {
        throw new Error('Divisor can\'t be equal zero!');
    }

    this._divisor = $new;
};

Fraction.calculate = function($first, $second, operator) {
    var fDividend, fDivisor;
    if ($first instanceof Fraction) {
        fDividend = $first.getDividend();
        fDivisor = $first.getDivisor();
    } else {
        fDividend = $first;
        fDivisor = 1;
    }
    var fr = new Fraction(fDividend, fDivisor);

    switch (operator)
    {
        case '-':
            fr.min($second);
            break;
        case '/':
            fr.div($second);
            break;
        case '*':
            fr.mult($second);
            break;
        default :
            fr.add($second);
            break;
    }

    return fr;
};
