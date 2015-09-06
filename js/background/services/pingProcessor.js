myApp.factory("pingProcessor", function($http, $q, $log, $rootScope, pingVMRepo) {
    var pingOneCore = function(viewModel, resolve, reject) {
        $log.log("requesting ", viewModel.data.url, "...");
        var startTime = new Date().getTime();
        viewModel.inProgress = true;
        $http.get(viewModel.data.url)
            .success(function(data, status) {
                //$log.log("SUCCESS: ", viewModel.data.url, " - ", status);
                viewModel.setStatus(status, new Date().getTime() - startTime);
                viewModel.inProgress = false;
                resolve(viewModel);

            }).error(function(data, status) {
                //$log.warn("FAIL: ", viewModel.data.url, " - ", status);
                viewModel.setStatus(status, new Date().getTime() - startTime);
                viewModel.inProgress = false;
                resolve(viewModel);
            });
    };

    return {
        // returns list of Promises
        pingAll: function(viewModels) {
            var promises = viewModels.map(this.pingOne);
            $q.all(promises).then(function() {
                $rootScope.$emit("allPingsDone", viewModels);
            });
            return promises;
        },
        // Returns Promise
        pingOne: function(viewModel) {
            return $q(function(resolve, reject) {
                pingOneCore(viewModel, resolve, reject);
            });
        },
    }
});
