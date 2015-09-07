////////////////////////////////////////////////////////////////////
// Configuration page controller
////////////////////////////////////////////////////////////////////
myApp.controller('ConfigCtrl', function($scope, probeRepo, pingProcessor) {
    $scope.probes = probeRepo.getProbes();
    $scope.remove = function(id) {
        probeRepo.removeProbe(id);
        $scope.probes = probeRepo.getProbes();

        pingProcessor.refreshViewModels();         // TODO: This is too bad!
    };
});
