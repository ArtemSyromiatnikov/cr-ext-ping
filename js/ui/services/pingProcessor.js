//////////////////////////////////////////////////////////////////////
// Imports the service from background page
//////////////////////////////////////////////////////////////////////
myApp.factory("pingProcessor", function(serviceImporter) {
    return serviceImporter.get("pingProcessor");
});