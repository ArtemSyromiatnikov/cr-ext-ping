////////////////////////////////////////////////////////////////////
// Create/Edit Ping Controller
////////////////////////////////////////////////////////////////////
myApp.controller('EditPingCtrl', function($scope, probeRepo, $location, $routeParams) {
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
        $location.path("/config");
    };
});
