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
  $scope.error = '';

  $scope.submit = function() {
    NotesBackend.fetchUser($scope.user, function(user, notes) {
      if (user.id) {
        $location.path('notes');
        $scope.user = user;
        $rootScope.$broadcast('notesLoaded', notes);
      }
      else {
        $scope.error = user.error;
        $scope.user.password = '';
      }
    });
  };

  if (NotesBackend.getUser().id) {
    $location.path('notes');
  }
});
