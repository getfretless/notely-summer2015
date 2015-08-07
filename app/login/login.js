'use strict';

angular.module('notely.login', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/login', {
    templateUrl: 'login/login.html',
    controller: 'LoginController'
  });
}])

.controller('LoginController', function($scope, $rootScope, $location, $window, NotesBackend) {
  $scope.user = {};
  $scope.submit = function() {
    NotesBackend.fetchApiKey($scope.user, function(notes) {
      $location.path('notes');
      $rootScope.$broadcast('notesLoaded', notes);
    });
  };
});
