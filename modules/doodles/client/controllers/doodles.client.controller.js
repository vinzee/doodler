(function () {
  'use strict';

  // Doodles controller
  angular
    .module('doodles')
    .controller('DoodlesController', DoodlesController);

  DoodlesController.$inject = ['$scope', '$state', '$window', 'Authentication', 'doodleResolve'];

  function DoodlesController ($scope, $state, $window, Authentication, doodle) {
    var vm = this;

    vm.authentication = Authentication;
    vm.doodle = doodle;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Doodle
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.doodle.$remove($state.go('doodles.list'));
      }
    }

    // Save Doodle
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.doodleForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.doodle._id) {
        vm.doodle.$update(successCallback, errorCallback);
      } else {
        vm.doodle.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('doodles.view', {
          doodleId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
