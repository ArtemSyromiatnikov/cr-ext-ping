window.isBackgroundPage = true;

var myApp = angular.module('pingBackground', ['ng']);
myApp.controller("BgCtrl", function($interval, probeRepo, sharedTest){
    var index = 1;

    sharedTest.set(Math.ceil(Math.random()*100));
    console.log("sharedTest value: ", sharedTest.get());

    $interval(function () {
        index++;
        var views = chrome.extension.getViews();
        for (var i = 0; i < views.length; i++) {
            var view = views[i];

            console.log("Trying to call view... message ", index);

            if (angular.isFunction(view.testMethod)) {
                view.testMethod("Try #" + index);
            }
        }

    }, 5000);
});
