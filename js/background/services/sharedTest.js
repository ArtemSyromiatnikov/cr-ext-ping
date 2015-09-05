myApp.factory("sharedTest", function($http, defaultData) {
    var myVariable = 8888;

    return {
        set: function(val) {
            myVariable = val;
        },
        get: function() {
            return myVariable;
        }
    };
});
