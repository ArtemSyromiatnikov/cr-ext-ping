myApp.factory("pingVMRepo", function(CONST, probeRepo) {
    var viewModels;

    var factory = {
        initialize: function() {
            var models = probeRepo.getProbes();
            viewModels = models.map(this.createViewModel);
        },
        getViewModels: function() {
            return viewModels;
        },
        createViewModel: function(model){
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
            }
        }
    };
    factory.initialize();

    return factory;
});
