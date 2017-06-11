// Doodles service used to communicate Doodles REST endpoints
(function () {
  'use strict';

  angular
    .module('doodles')
    .factory('DoodlesService', DoodlesService);

  DoodlesService.$inject = ['$resource'];

  function DoodlesService($resource) {
    return $resource('api/doodles/:doodleId', {
      doodleId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
