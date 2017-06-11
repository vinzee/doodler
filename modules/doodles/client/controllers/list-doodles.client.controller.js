(function () {
  'use strict';

  angular
    .module('doodles')
    .controller('DoodlesListController', DoodlesListController);

  DoodlesListController.$inject = ['DoodlesService'];

  function DoodlesListController(DoodlesService) {
    var vm = this;

    vm.doodles = DoodlesService.query();
  }
}());
