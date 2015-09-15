////////////////////////////////////////////////////////////////////
// Ping List controller (Home page)
////////////////////////////////////////////////////////////////////
myApp.controller('PingListCtrl', function($scope, $http, $q, pingProcessor) {
    $scope.probes = pingProcessor.getViewModels();

    $scope.pingNow = function() {
        var promises = pingProcessor.pingAll($scope.probes);
        promises.map(function(pingPromise){
            pingPromise.then(function(){
                $scope.$apply();
            })
        });
    };
});
