'use strict';

// Declare app level module which depends on views, and components
var app = angular.module('notely', [
  'ngRoute',
  'notely.version',
  'notely.notes'
]);

app.config(['$routeProvider', function($routeProvider) {
  $routeProvider.otherwise({redirectTo: '/notes'});
}]);

app.directive('focusOn', function() {
  return function(scope, elem, attr) {
    scope.$on(attr.focusOn, function(e) {
      elem[0].focus();
    });
  };
});
