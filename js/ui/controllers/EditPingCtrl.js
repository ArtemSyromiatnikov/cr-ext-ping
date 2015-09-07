////////////////////////////////////////////////////////////////////
// Create/Edit Ping Controller
////////////////////////////////////////////////////////////////////
myApp.controller('EditPingCtrl', function($scope, $location, $routeParams, probeRepo, pingProcessor) {
    var id = Number($routeParams.pingId);
    $scope.probe = probeRepo.getProbe(id);
    $scope.isNew = !$scope.probe;
    if ($scope.isNew) {
        $scope.probe = {
            url: "http://"
        };
    }

    $scope.saveProbe = function() {
        if ($scope.probe.title && $scope.probe.url) {
            probeRepo.saveProbe($scope.probe);
        }
        pingProcessor.refreshViewModels();         // TODO: This is too bad!
        $location.path("/config");
    };
});
