var myApp = angular.module('pingBackground', ['ng']);

myApp.controller("BackgroundCtrl", function($interval, $rootScope, $log, chrome, pingProcessor){
    $log.info("Starting background page...");

    $rootScope.$on("pingsInProgress", function(e, viewModels) {
        var notFinished = viewModels.filter(function(vm) { return vm.inProgress; }),
            failed = viewModels.filter(function(vm) { return vm.isFail; }),
            totalCount       = viewModels.length,
            notFinishedCount = notFinished.length,
            failedCount      = failed.length,
            successCount     = totalCount - notFinishedCount - failedCount,
            message;

        if (notFinishedCount > 0) {
            if (successCount > 0) {
                if (failedCount > 0) {
                    message = successCount + " sites are online, " + failedCount + " offline, " + notFinishedCount + " pending";
                } else {
                    message = successCount + " sites are online, " + notFinishedCount + " pending";
                }
            } else {
                message = "No sites are online, " + failedCount + " offline, " + notFinishedCount + " pending";
            }

            // Show Progress!
            chrome.notifications.create({
                type: "progress",
                iconUrl: "img/icon_in_progress_160.png",
                title: "Ping in progress",
                message: message,
                progress: Math.round((totalCount - notFinishedCount) / totalCount * 100)
            });
        }
    });

    $rootScope.$on("allPingsDone", function(e, viewModels) {
        if (!viewModels) return;

        var failed = viewModels.filter(function(vm) { return vm.isFail; });

        if (!failed.length) {
            // All up!
            chrome.notifications.create({
                type: "basic",
                iconUrl: "img/icon_success_160.png",
                title: "Ping complete",
                message: "All " + viewModels.length + " sites are online"
            });
        } else {
            chrome.notifications.create({
                type: "list",
                iconUrl: "img/icon_fail_160.png",
                title: failed.length + " of " + viewModels.length + " sites are offline",
                message: "",
                items: failed.map(function(vm) {
                    return {
                        title: vm.data.title,
                        message: vm.data.url
                    };
                })
            });
        }
    });
});
