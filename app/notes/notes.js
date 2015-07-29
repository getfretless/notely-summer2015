'use strict';

var nevernoteBasePath = 'https://nevernote-1150.herokuapp.com/api/v1/';
var apiKey = '$2a$10$TTc8gLTzfWBk9SsDO7p.J.acOzMMG535814CudrCMQgmjUSvbQ2ju';

var noteApp = angular.module('notely.notes', ['ngRoute']);

noteApp.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/notes', {
    templateUrl: 'notes/notes.html'
  });
}]);

noteApp.service('NotesBackend', function NotesBackend($http) {
  var notes = [];

  this.getNotes = function() {
    return notes;
  };

  this.fetchNotes = function fetchNotes(callback) {
    $http.get(nevernoteBasePath + 'notes?api_key=' + apiKey)
      .success(function(notesData) {
        notes = notesData;
        typeof callback === 'function' && callback(notes);
      });
  };

  this.postNote = function(noteData, callback) {
    var _this = this;
    $http.post(nevernoteBasePath + 'notes', {
      api_key: apiKey,
      note: noteData
    }).success(function(newNoteData){
      _this.fetchNotes(callback);
    });
  };
});

noteApp.controller('NotesController', function NotesController($scope, NotesBackend) {
  var _this = this;
  $scope.notes = [];
  $scope.note = {};

  this.refreshNotes = function(notes) {
    var sidebarScope = angular.element(document.getElementById("sidebar")).scope();
    sidebarScope.notes = notes;
  };

  $scope.commit = function() {
    NotesBackend.postNote($scope.note, _this.refreshNotes);
  };

  NotesBackend.fetchNotes(this.refreshNotes);
});
