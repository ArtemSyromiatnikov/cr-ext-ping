////////////////////////////////////////////////////////////////////
// Ping List controller (Home page)
////////////////////////////////////////////////////////////////////
myApp.controller('PingListCtrl', function($scope, $http, $q, probeRepo, pingProcessor) {
    console.log("repo? ", probeRepo);
    $scope.projects = probeRepo.getProjects();
    $scope.probes = pingProcessor.getViewModels();

    $scope.pingNow = function() {
        var promises = pingProcessor.pingAll($scope.probes);
        promises.map(function(pingPromise){
            pingPromise.then(function(){
                $scope.$apply();
            })
        });
    };

    $scope.showDrawer = function() {
        $scope.drawerVisible = true;
    };
    $scope.hideDrawer = function() {
        $scope.drawerVisible = false;
    };
});
