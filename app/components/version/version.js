'use strict';

angular.module('notely.version', [
  'notely.version.interpolate-filter',
  'notely.version.version-directive'
])

.value('version', '0.1');
