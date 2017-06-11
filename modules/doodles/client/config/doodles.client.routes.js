(function () {
  'use strict';

  angular
    .module('doodles')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('doodles', {
        abstract: true,
        url: '/doodles',
        template: '<ui-view/>'
      })
      .state('doodles.list', {
        url: '',
        templateUrl: 'modules/doodles/client/views/list-doodles.client.view.html',
        controller: 'DoodlesListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Doodles List'
        }
      })
      .state('doodles.create', {
        url: '/create',
        templateUrl: 'modules/doodles/client/views/form-doodle.client.view.html',
        controller: 'DoodlesController',
        controllerAs: 'vm',
        resolve: {
          doodleResolve: newDoodle
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Doodles Create'
        }
      })
      .state('doodles.edit', {
        url: '/:doodleId/edit',
        templateUrl: 'modules/doodles/client/views/form-doodle.client.view.html',
        controller: 'DoodlesController',
        controllerAs: 'vm',
        resolve: {
          doodleResolve: getDoodle
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Doodle {{ doodleResolve.name }}'
        }
      })
      .state('doodles.view', {
        url: '/:doodleId',
        templateUrl: 'modules/doodles/client/views/view-doodle.client.view.html',
        controller: 'DoodlesController',
        controllerAs: 'vm',
        resolve: {
          doodleResolve: getDoodle
        },
        data: {
          pageTitle: 'Doodle {{ doodleResolve.name }}'
        }
      });
  }

  getDoodle.$inject = ['$stateParams', 'DoodlesService'];

  function getDoodle($stateParams, DoodlesService) {
    return DoodlesService.get({
      doodleId: $stateParams.doodleId
    }).$promise;
  }

  newDoodle.$inject = ['DoodlesService'];

  function newDoodle(DoodlesService) {
    return new DoodlesService();
  }
}());
