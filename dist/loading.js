(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function () {
    angular.module('zt.angular-loading', []);
    require('./loading.provider.js');
    require('./loading.directive.js');
})();
},{"./loading.directive.js":2,"./loading.provider.js":3}],2:[function(require,module,exports){
(function() {
    angular.module('zt.angular-loading')
        .directive('loading', function ($http, $timeout, Loading) {
            return {
                priority: -1000,
                restrict: 'A',
                link: function ($scope, elm, attrs)
                {
                    var latencyThresholdReached = false;
                    var latencyTimeoutSet = false;
                    $scope.isLoading = function () {
                        var numRequests = 0;
                        if (Loading.forceLoading) {
                            return true;
                        }
                        if (!latencyTimeoutSet) {
                            $timeout(function() {
                                latencyThresholdReached = true;
                            }, Loading.latencyThreshold);
                            latencyTimeoutSet = true;
                        }
                        for (var i = $http.pendingRequests.length - 1; i >= 0; i--) {
                            if (Loading.requestTypes.indexOf($http.pendingRequests[i].method) < 0) {
                                continue;
                            }
                            if ($http.pendingRequests[i].hideLoading) {
                                continue;
                            }
                            if (latencyThresholdReached) {
                                numRequests += 1;
                            }
                        }
                        if (numRequests === 0 && latencyThresholdReached === true) {
                            latencyTimeoutSet = false;
                            latencyThresholdReached = false;
                        }
                        return numRequests > 0;
                    };
                    $scope.$watch($scope.isLoading, function (status)
                    {
                        if (status) {
                            elm[0].style.visibility = 'visible';
                        } else {
                            elm[0].style.visibility = 'hidden';
                        }
                    });
                }
            };
        });
})();
},{}],3:[function(require,module,exports){
(function () {
    angular.module('zt.angular-loading')
        .provider('Loading', function LoadingSaving() {
            this.requestTypes = ['GET'];
            this.latencyThreshold = 0;
            this.show = function() {
                this.forceLoading = true;
            }.bind(this);
            this.hide = function() {
                this.forceLoading = false;
            }.bind(this);
            this.$get = function() {
                return this;
            };
        });
})();
},{}]},{},[1])