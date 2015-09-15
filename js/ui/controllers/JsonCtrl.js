////////////////////////////////////////////////////////////////////
// Import/Export Json Controller
////////////////////////////////////////////////////////////////////
myApp.controller('JsonCtrl', function($scope, $location, probeRepo) {
    var probes = probeRepo.getProbes(),
        originalJson = JSON.stringify(probes, ['title', 'url'], '  ');
    $scope.json = originalJson

    $scope.reset = function() {
        $scope.json = originalJson;
    };
    $scope.saveJson = function() {
        var objects;
        try {
            objects = JSON.parse($scope.json);
        } catch(e) {
            objects = [];
        }
        probeRepo.importProbes(objects);

        $location.path("/");
    };
});
