//////////////////////////////////////////////////////////////////////
// This service is desigend to import services from background page
//////////////////////////////////////////////////////////////////////
myApp.factory("serviceImporter", function(chrome) {
    var bgWindow = chrome.extension.getBackgroundPage();
    var bgInjector = bgWindow.angular.element(document.body).injector();

    return {
        get: function(serviceName) {
            return bgInjector.get(serviceName);
        }
    };
});
