'use strict';

angular.module('notely.login', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/login', {
    templateUrl: 'login/login.html',
    controller: 'LoginController'
  });
}])

.controller('LoginController', function($scope, $rootScope, $location, NotesBackend) {
  $scope.user = {};
  $scope.submit = function() {
    NotesBackend.fetchUser($scope.user, function(user, notes) {
      $location.path('notes');
      $scope.user = user;
      $rootScope.$broadcast('notesLoaded', notes);
    });
  };
});
