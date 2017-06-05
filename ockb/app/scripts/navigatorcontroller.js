'use strict';
angular.module('ockbApp').controller('navigatorcontroller', function ($scope, $http, $q, $location, docTypesFactory, CONFIG) {

    var vm = this;

    $scope.dataForTheTree = [];
    // tree options
    $scope.treeOptions = {
        nodeChildren: "children",
        dirSelectable: false,
        allowDeselect: false
    }



    vm.get_type = function() {

        var defered = $q.defer();
        var url = CONFIG.protocol + "://" + CONFIG.esHostname + ":" + CONFIG.esPort + "/" + CONFIG.esIndex;
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


    vm.get_ids = function(type) {
        var defered = $q.defer();
        var url = CONFIG.protocol + "://" + CONFIG.esHostname + ":"
                            + CONFIG.esPort + "/" + CONFIG.esIndex +"/_search";
        var query = '{' +
                        '"size": 10000,' +
                        '"sort" : [' +
                            '{"id" : "asc"}' +
                        '],' +
                        '"query" : {' +
                            '"term" : { "_type" :"' +  type + '"}' +
                        '}' +
                     '}';
        $http({
                url: url, //'http://36.110.131.101:9200/occikb/_search',
                method: 'POST',
                data: query
             }).then(function (result) {
                defered.resolve(result.data.hits.hits);
             }).catch(function (result) {
                defered.reject(result);
             });
         return defered.promise;
    };


    vm.initialTree = function(){
        var promise = vm.get_type();

        promise.then(function(data) {
                 vm.types = data.data.occikb.mappings;
                 var tmpTypes = [];
                 angular.forEach(vm.types, function(value, key) {
                    tmpTypes.push(key);


                    var get_id_promise = vm.get_ids(key);
                    get_id_promise.then(function(data) {

                             var item = {
                                "id": key,
                                "type": key,
                                "description": key,
                                "children": []
                             };
                             angular.forEach(data, function(value, key) {
                                var tmp = value._source;
                                tmp["children"] = [];
                                tmp["id"] = value._source.id;
                                tmp["type"] = value._source.type;
                                tmp["description"] = value._source.description;
                                item.children.push(tmp);
                             });
                             $scope.dataForTheTree.push(item);


                         }, function(data) {
                             vm.header_titles = [];
                             console.log("Error when get the ids!");
                         });
                 });
                 // set the doc types to the service, then other controller can use
                 docTypesFactory._setTypes(tmpTypes);

             }, function(data) {
                 vm.types = {error: 'can not find'};
        });
    };


    vm.initialTree();


    $scope.showSelected = function(sel) {
        $scope.selected = sel.name;
        $location.path('detail/' + sel.type + '/' + sel.id);
    };


   // search section is in the main page so add the click search function in this js
    vm.search = function() {
        $location.path('search/'+ vm.searchContent);
    };


});