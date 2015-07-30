'use strict';

var nevernoteBasePath = 'https://nevernote-1150.herokuapp.com/api/v1/';
var apiKey = '$2a$10$TTc8gLTzfWBk9SsDO7p.J.acOzMMG535814CudrCMQgmjUSvbQ2ju';

var noteApp = angular.module('notely.notes', ['ngRoute', 'textAngular']);

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

  this.fetchNotes = function (callback) {
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
      var note = newNoteData.note;
      notes.push(note);
      typeof callback === 'function' && callback(notes, note);
    });
  };

  this.replaceNote = function(note, callback) {
    for(var i=0; i < notes.length; i++) {
      if (notes[i].id === note.id) {
        notes[i] = note;
      }
    }
    typeof callback === 'function' && callback(notes);
  };

  this.updateNote = function(noteData, callback) {
    var _this = this;
    $http.put(nevernoteBasePath + 'notes/' + noteData.id, {
      api_key: apiKey,
      note: noteData
    }).success(function(newNoteData){
      _this.replaceNote(newNoteData.note, callback);
    });
  };

  this.deleteNote = function(note, callback) {
    var _this = this;
    $http.delete(nevernoteBasePath + 'notes/' + note.id + '?api_key=' + apiKey)
    .success(function(newNoteData){
      _this.fetchNotes(callback);
    });
  };
});

noteApp.controller('NotesController', function NotesController($scope, $filter, NotesBackend) {
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
    debugger
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
});
