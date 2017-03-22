function searchcontroller($scope, $http, $routeParams, $q, $translate, DTOptionsBuilder, DTColumnBuilder) {

    var vm = this;
    vm.searchContent = $routeParams.searchContent;
    // set the searchcontroller parent's parent's searchContent,
    // this is not a good way, just here for quick fix the issue
    $scope.$parent.$parent.searchContent = vm.searchContent;


    vm.formatHLData = function(highLight) {
        var str = "";
        angular.forEach(highLight, function(value, key) {
            switch (key)
            {
                case "id":
                    str = str + $translate.instant('detail.label.id') + ": " + value.join("") + "<br/>";
                    break;
                case "type":
                    str = str + $translate.instant('detail.label.type') + ": " + value.join("") + "<br/>";
                    break;
                case "description":
                    str = str + $translate.instant('detail.label.description') + ": " + value.join("") + "<br/>";
                    break;
                case "explanation":
                    str = str + $translate.instant('detail.label.explanation') + ": " + value.join("") + "<br/>";
                    break;
                case "level":
                    str = str + $translate.instant('detail.label.level') + ": " + value.join("") + "<br/>";
                    break;
                case "impact":
                    str = str + $translate.instant('detail.label.impact') + ": " + value.join("") + "<br/>";
                    break;
                case "possible_cause":
                    str = str + $translate.instant('detail.label.reason') + ": ";
                    angular.forEach(value, function(v, k) {
                        str = str + (k + 1) + "." + v;
                    });
                    str = str + "<br/>";
                    break;
                case "processing_step":
                    str = str + $translate.instant('detail.label.steps') + ": ";
                    angular.forEach(value, function(v, k) {
                        str = str + (k + 1) + "." + v;
                    });
                    str = str + "<br/>";
                    break;
                case "reference":
                    str = str + $translate.instant('detail.label.reference') + ": " + value.join("") + "<br/>";
                    break;
                default:
                    str = "";
            }
        });
        return str;
    };


    vm.formatSourceData = function(source) {
        var str = "";
        str = $translate.instant('detail.label.id') + ": " + source.id + "<br/>" +
                $translate.instant('detail.label.type') + ": " + source.type + "<br/>" +
                $translate.instant('detail.label.description') + ": " + source.description + "<br/>" +
                $translate.instant('detail.label.explanation') + ": " + source.explanation + "<br/>" +
                $translate.instant('detail.label.level') + ": " + source.level + "<br/>" +
                $translate.instant('detail.label.impact') + ": " + source.impact + "<br/>";

        str = str + $translate.instant('detail.label.reason') + ": ";
        angular.forEach(source.possible_cause, function(v, k) {
            str = str + (k + 1) + "." + v;
        });
        str = str + "<br/>";

        str = str + $translate.instant('detail.label.reason') + ": ";
        angular.forEach(source.processing_step, function(v, k) {
            str = str + (k + 1) + "." + v;
        });
        str = str + "<br/>";

        str = str + $translate.instant('detail.label.reference') + ": " + source.reference + "<br/>";

        return str;
    };


    $scope.search = function() {
        var defered = $q.defer();
        var query = '{' +
                        //'"track_scores": true,' + { "告警描述" : "desc" }, { "处理步骤" : "desc" },
//                        '"sort": [{ "_score" : "asc" }],' +
                        '"sort":  [{ "_score": { "order": "desc" }}],' +
                        '"size": 100,' +
                        '"query": {' +
                            '"query_string": {' +
                                '"fields" : ["id", "description", "explanation", "level", "impact", "possible_cause", "processing_step", "reference"],' +
                                '"query": "' + vm.searchContent + '",' +
//                                '"fields": [_all],' +
                                '"default_operator": "or"' +
                                '}' +
                            '},' +
                            '"highlight": {"fields": {"id": {},"description": {},"explanation": {},"level": {},"impact": {},"possible_cause": {},"processing_step": {},"reference": {}}}' +
                      '}';

        $http({
//                url: 'http://103.235.243.213:9200/occikb/_search',
                url: 'http://36.110.131.101:9200/occikb/_search',
                method: 'POST',
                data: query
             }).then(function (result) {
                $scope.data = result;
                defered.resolve(result.data.hits.hits);
             }).catch(function (result) {
                defered.reject(result);
             });
         return defered.promise;
    };

    var promise = $scope.search();



    $scope.dtOptions = DTOptionsBuilder
                        .fromFnPromise(promise)
                        .withPaginationType('full_numbers')
                        .withOption('searching', false)
                        .withOption('lengthChange', false)
                        .withOption('stateSave', false)
                        .withOption('ordering', false)
                        .withDisplayLength(10)
                        .withLanguage({
                            "oPaginate": {
                                "sFirst": "&lt;&lt;",
                                "sLast": "&gt;&gt;",
                                "sNext": "&gt;",
                                "sPrevious": "&lt;"
                            }
                        });

    $scope.dtColumns = [
        DTColumnBuilder.newColumn(null).withTitle($translate('index.table.search.results')).notSortable()
            .renderWith(actionsHtml)
    ];




   function actionsHtml(data, type, full, meta) {

        var idLink = '<a href="#!/detail/' +
                            data._type +
                            '/' +
                            data._id +
                            '">' +
                            data._id +
                            '</a><br/>';
         if (typeof(data.highlight) == 'undefined') {
            return idLink + vm.formatSourceData(data._source);
         } else {
//            return idLink + angular.toJson(data.highlight);
            return idLink + vm.formatHLData(data.highlight);
         }
    }




//    $scope.search = function() {
//        var defered = $q.defer();
//        var query = '{' +
//                        //'"track_scores": true,' + { "告警描述" : "desc" }, { "处理步骤" : "desc" },
////                        '"sort": [{ "_score" : "asc" }],' +
//                        '"sort":  [{ "_score": { "order": "desc" }}],' +
//                        '"size": 100,' +
//                        '"query": {' +
//                            '"query_string": {' +
//                                '"fields" : ["id", "description", "explanation", "level", "impact", "possible_cause", "processing_step", "reference"],' +
//                                '"query": "' + $scope.searchContent + '",' +
////                                '"fields": [_all],' +
//                                '"default_operator": "or"' +
//                                '}' +
//                            '},' +
//                            '"highlight": {"fields": {"id": {},"description": {},"explanation": {},"level": {},"impact": {},"possible_cause": {},"processing_step": {},"reference": {}}}' +
//                      '}';
//
//                                //"告警描述": "' + $scope.searchContent + '"}}}';
//        $http({
//                url: 'http://103.235.243.213:9200/occikb/_search',
//                method: 'POST',
//                data: query
//             }).then(function (result) {
//                $scope.data = result;
////                $scope.results = result.data.hits.hits;
//                defered.resolve(result.data.hits.hits);
//             }).catch(function (result) {
//                defered.reject(result);
//             });
//         return defered.promise;
//    };
//
//    var promise = $scope.search();

//    promise.then(function(data) {
//             $scope.results = data;
//         }, function(data) {
//             $scope.results = {error: 'can not find'};
//         });


}