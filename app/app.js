'use strict';

// Declare app level module which depends on views, and components
var app = angular.module('notely', [
  'ngRoute',
  'ngCookies',
  'notely.version',
  'notely.notes',
  'notely.login'
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

app.service('NotesBackend', function NotesBackend($http, $cookies) {
  var notes = [];
  var apiKey = $cookies.get('apiKey') || '';

  this.getApiKey = function() {
    return apiKey;
  };

  this.fetchApiKey = function(user, callback) {
    var _this = this;
    $http.post(nevernoteBasePath+'session', {
      user: {
        username: user.username,
        password: user.password
      }
    }).success(function(data){
      apiKey = data.api_key;
      $cookies.put('apiKey', apiKey);
      _this.fetchNotes(function() {
        typeof callback === 'function' && callback(notes);
      });
    });
  };

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
