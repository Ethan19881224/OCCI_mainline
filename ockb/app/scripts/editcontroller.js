'use strict';
function editcontroller($scope, $http, $routeParams, $q, $location, docTypesFactory, CONFIG) {

    var editVm  = this;
    $scope.editMessages = "";
    // get the types from navigator types
    $scope.editTypesSelectOption = docTypesFactory._getTypes();


    editVm.getDoc = function() {
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


    var promise = editVm.getDoc();

    promise.then(function(data) {

             $scope.editContent = {};
             $scope.editContent.id = data.data._source.id;
             $scope.editContent.type = data.data._source.type;
             $scope.editContent.description = data.data._source.description;
             $scope.editContent.explanation = data.data._source.explanation;
             $scope.editContent.level = data.data._source.level;
             $scope.editContent.impact = data.data._source.impact;
             $scope.editContent.reference = data.data._source.reference;


             $scope.editContent.possible_cause = '';
             angular.forEach(data.data._source.possible_cause, function(value, key) {
                $scope.editContent.possible_cause = $scope.editContent.possible_cause + '"' + value.toString() + '",';
             });
             $scope.editContent.possible_cause = '[' + $scope.editContent.possible_cause.slice(0, -1) + ']';


             $scope.editContent.processing_step = '';
             angular.forEach(data.data._source.processing_step, function(value, key) {
                $scope.editContent.processing_step = $scope.editContent.processing_step + '"' + value.toString() + '",';
             });
             $scope.editContent.processing_step = '[' + $scope.editContent.processing_step.slice(0, -1) + ']';

         }, function(data) {
             $scope.editMessages = "can not get the doc info, please contact the admin!";
         });



    editVm.update = function() {

        var url = CONFIG.protocol + "://" + CONFIG.esHostname + ":" + CONFIG.esPort + "/"
                                + CONFIG.esIndex + "/" + $scope.editContent.type + '/' + $scope.editContent.id;
        var defered = $q.defer();
        var editBody = '{' +
                            '"id": "' + $scope.editContent.id + '",' +
                            '"type": "' + $scope.editContent.type + '",' +
                            '"description": "' + $scope.editContent.description + '",' +
                            '"explanation": "' + $scope.editContent.explanation + '",' +
                            '"level": "' + $scope.editContent.level + '",' +
                            '"impact": "' + $scope.editContent.impact + '",' +
                            '"possible_cause": ' + $scope.editContent.possible_cause + ',' +
                            '"processing_step": ' + $scope.editContent.processing_step + ',' +
                            '"reference": "' + $scope.editContent.reference + '"' +
                        '}';
         $http({
                 url: url,
                 method: 'PUT',
                 data: editBody
              }).then(function (data) {
                 defered.resolve(data.status);
              }).catch(function (data) {
                 defered.reject(data.status);
              });
          return defered.promise;
    };



    $scope.saveEditContent = function() {

        var editPromise = editVm.update();
        editPromise.then(function(data) {
                 $scope.editMessages = "edit successfully!";
             }, function(data) {
                 $scope.editMessages = "can not edit the doc info hit the error: " + data;
             });
    };



    $scope.cancelEditContent = function() {
        $location.path('detail/' + $routeParams.type + '/' + $routeParams.id);
    };

}