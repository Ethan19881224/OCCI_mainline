'use strict';
function detailcontroller($scope, $http, $routeParams, $q, $timeout, CONFIG) {

    $scope.internalUse = CONFIG.internalUse;

    $scope.list = function() {

        var defered = $q.defer();
        var url = CONFIG.protocol + "://" + CONFIG.esHostname + ":" + CONFIG.esPort + "/"
                                + CONFIG.esIndex + "/" + $routeParams.type + '/' + $routeParams.id;
        $http({
                url: url,
                method: 'GET'
             }).then(function (data) {
                defered.resolve(data);
             }).catch(function (data) {
                defered.reject(data);
             });
        return defered.promise;
    };

    var promise = $scope.list();

    promise.then(function(data) {
             $scope.detail = data.data;
         }, function(data) {
             $scope.detail = {error: 'can not find'};
         });


    $timeout(function () {
         var treecontrol = angular.element("treecontrol");
         var firstChildNode = treecontrol.find("#" + $routeParams.type + '_' + $routeParams.type);
         var secondChildNode = treecontrol.find("#" + $routeParams.type + '_' + $routeParams.id);

         if (secondChildNode.length == 0) {
             $timeout(function () {
                 firstChildNode.trigger('click');
             }, 100);

             $timeout(function () {
                 // find again becase first node just expanded
                 treecontrol.find("#" + $routeParams.type + '_' + $routeParams.id).trigger('click');
             }, 100);
         } else {
             $timeout(function () {
                 secondChildNode.trigger('click');
             }, 100);
         }
    }, 1000);




}
