Optimizer = (function() {
    var instance;

    function Optimizer() {
        if (!instance) {
            instance = this;
        } else {
            return instance;
        }
    }

    Optimizer.prototype.optimizeFraction = function($fraction) {
        var divd = $fraction.getDividend();
        var divr = $fraction.getDivisor();

        if(divd == 0 || divr == 0) {
            $fraction.setDividend(0);
            $fraction.setDivisor(1);
            return;
        }
        var fminus = divd > 0 ? 1 : -1;
        divd = Math.abs(divd);

        var gcd = this.GCD(divd, divr);
        $fraction.setDividend((fminus * divd) / gcd);
        $fraction.setDivisor(divr / gcd);
    };

    Optimizer.prototype.GCD = function(a, b) {
        if (a == 0) {
            return b;
        }
        while (b!=0) {
            if (a > b) {
                a = a - b;
            } else {
                b = b - a;
            }
        }

        return a;
    };

    return Optimizer;
})();