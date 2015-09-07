myApp.factory("pingProcessor", function($http, $q, $log, $rootScope, CONST, probeRepo) {

    // private variables
    var isPingInProgress = false,
        lastPingTime = null,
        viewModels;

    // private methods
    var pingOneCore = function(viewModel, resolve, reject) {
        //$log.log("requesting ", viewModel.data.url, "...");
        var startTime = new Date().getTime();
        viewModel.inProgress = true;
        viewModel.quality = CONST.quality.none;
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
        },
        createViewModel = function(model){
            return {
                data: model,
                quality: CONST.quality.none,
                isPristine: true,		// ping was not performed yet
                inProgress: false,
                isFail: false,
                ms: 0,
                setStatus: function(statusCode, ms) {
                    this.isPristine = false;
                    this.isFail = statusCode === 0;
                    if (!this.isFail) {
                        this.ms = ms;
                        if (this.ms > 0 && this.ms < 500) {
                            this.quality = CONST.quality.good;
                        } else if (this.ms < 1500) {
                            this.quality = CONST.quality.avg;
                        } else {
                            this.quality = CONST.quality.bad;
                        }
                    } else {
                        this.ms = 0;
                        this.quality = CONST.quality.fail;
                    }
                }
            };
        },
        initViewModels = function() {
            var models = probeRepo.getProbes();
            return models.map(createViewModel);
        };

    viewModels = initViewModels();

    return {
        refreshViewModels: function() {
            viewModels = initViewModels();
        },
        getViewModels: function() {
            return viewModels;
        },
        // Creates new set of ViewModels. Returns list of Promises
        pingAll: function() {
            var promises = viewModels.map(this.pingOne);

            isPingInProgress = true;
            $q.all(promises).then(function() {
                isPingInProgress = false;
                lastPingTime = new Date();

                $rootScope.$emit("allPingsDone", viewModels);
            });
            return promises;
        },
        // Returns Promise
        pingOne: function(viewModel) {
            return $q(function(resolve, reject) {
                pingOneCore(viewModel, resolve, reject);
            });
        }
    };
});
