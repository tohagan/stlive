// AOP functions to inject functions before, after or around an existing function.

module.exports = {
    before: function(onBefore, fn) {
        return function () {
            onBefore.apply(this, arguments);
            return fn.apply(this, arguments);
        };
    },
 
    after: function(fn, onAfter) {
        return function () {
            var result = fn.apply(this, arguments);
            onAfter.call(this, result);
            return result;
        };
    },
    
    around: function(over, fn, under) {
        return this.before(over, this.after(fn, under));
    }
};