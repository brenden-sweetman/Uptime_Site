'use strict';

// Declare app level module which depends on views, and components
angular.module('wuptime', [
  'ngRoute',
  'wuptime.overview',
  'wuptime.view2',
  'wuptime.version'
]).
config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
  $locationProvider.hashPrefix('!');

  $routeProvider.otherwise({redirectTo: '/overview'});
}]);
