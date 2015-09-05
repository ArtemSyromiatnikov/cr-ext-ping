////////////////////////////////////////////////////////////////////
// JSON validation directive
////////////////////////////////////////////////////////////////////
myApp.directive('json', function() {
    return {
        require: 'ngModel',
        link: function(scope, elm, attrs, ctrl) {
            ctrl.$validators.json = function(modelValue, viewValue) {
                try {
                    JSON.parse(viewValue);
                    return true;	// it is valid JSON
                } catch(ex) {
                    return false;	// it is invalid JSON
                }
            };
        }
    };
});
