////////////////////////////////////////////////////////////////////
// Configuration page controller
////////////////////////////////////////////////////////////////////
myApp.controller('ConfigCtrl', function($scope, probeRepo) {
    $scope.probes = probeRepo.getProbes();
    $scope.remove = function(id) {
        probeRepo.removeProbe(id);
        $scope.probes = probeRepo.getProbes();
    };
});
