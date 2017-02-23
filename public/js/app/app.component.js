'use strict';
(function() {
console.log('connected to app comp');
  angular.module('app')
    .component('app', {
      templateUrl: 'js/app/app.template.html',
      controller: controller
    });

    function controller() {

    }
}());
