'use strict';
var configApp = angular.module('ockbConfigApp', []);

configApp.constant('CONFIG', {
                        "protocol": "http",
                        "esHostname": "103.235.243.213",
                        "esPort": "9200",
                        "esIndex": "occikb",
                        "internalUse": false
                    }
                  );