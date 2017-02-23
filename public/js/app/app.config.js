(function() {
  'use strict';
console.log('connected to app config');

  angular.module('app')
    .config(config)

    config.$inject = ["$stateProvider", "$urlRouterProvider", "$locationProvider"];

    function config($stateProvider, $urlRouterProvider, $locationProvider) {

      $locationProvider.html5Mode(true)

      $stateProvider
        .state({
          name: "app",
          abstract: true,
          component: "app"
        })
        .state({
          name: "home",
          url: "/",
          parent: "app",
          component: "home"
        })
        .state({
          name: "newPost",
          parent: "app",
          url: "/new-post",
          component: "newPost"
        })
        .state({
          name: "editPost",
          parent: "app",
          url: "/edit-post",
          component: "editPost",
          params: {
            selectedPost: {}
          }
        });
    }
})();
