'use strict';

var nevernoteBasePath = 'https://nevernote-1150.herokuapp.com/api/v1/';
var apiKey = '$2a$10$TTc8gLTzfWBk9SsDO7p.J.acOzMMG535814CudrCMQgmjUSvbQ2ju';

var noteApp = angular.module('notely.notes', ['ngRoute', 'textAngular']);

noteApp.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/notes', {
    templateUrl: 'notes/notes.html'
  });
}]);

noteApp.controller('NotesController', function NotesController($scope, $rootScope, $filter, NotesBackend) {
  var _this = this;
  $scope.notes = [];
  $scope.note = {};

  this.sidebarScope = function() {
    return angular.element(document.getElementById("sidebar")).scope();
  };

  this.refreshNotes = function(notes, note) {
    if (note) {
      $scope.note = $scope.cloneNote(note);
    }
    _this.sidebarScope().notes = notes;
  };

  $scope.commit = function() {
    if ($scope.note.id) {
      NotesBackend.updateNote($scope.note, _this.refreshNotes);
    }
    else {
      $scope.note = NotesBackend.postNote($scope.note, _this.refreshNotes);
    }
  };

  $scope.hasNotes = function() {
    return this.notes.length > 0;
  };

  $scope.findNoteById = function(noteID) {
    return $filter('filter')(_this.sidebarScope().notes, { id: noteID }, true)[0];
  };

  $scope.cloneNote = function(note) {
    return JSON.parse(JSON.stringify(note));
  };

  $scope.loadNote = function(note) {
    $scope.note = this.cloneNote(note);
  };

  $scope.buttonText = function(note) {
    return (note && note.id) ? 'Update Note' : 'Create Note';
  };

  $scope.clearNote = function() {
    $scope.note = {};
    $scope.$broadcast('noteCleared');
  };

  $scope.deleteNote = function() {
    NotesBackend.deleteNote($scope.note, _this.refreshNotes);
    this.clearNote();
  };

  NotesBackend.fetchNotes(this.refreshNotes);
  $rootScope.$on('notesLoaded', function(ev, notes) {
    _this.refreshNotes(notes);
  });
});
