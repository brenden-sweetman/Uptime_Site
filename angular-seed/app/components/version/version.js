'use strict';

angular.module('wuptime.version', [
  'wuptime.version.interpolate-filter',
  'wuptime.version.version-directive'
])

.value('version', '0.1');
