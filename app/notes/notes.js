'use strict';

var notelyBasePath = 'https://nevernote-1150.herokuapp.com/api/v1/';
var apiKey = '$2a$10$TTc8gLTzfWBk9SsDO7p.J.acOzMMG535814CudrCMQgmjUSvbQ2ju';

angular.module('notely.notes', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/notes', {
    templateUrl: 'notes/notes.html',
    controller: 'NotesController'
  });
}])

.controller('NotesController', function NotesController($scope, $http) {
  $http.get(notelyBasePath + 'notes?api_key=' + apiKey)
    .success(function(notes_data) {
      $scope.notes = notes_data;
    });
});
