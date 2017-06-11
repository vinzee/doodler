(function () {
  'use strict';

  angular
    .module('doodles')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'My Doodles',
      state: 'doodles',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'doodles', {
      title: 'List Doodles',
      state: 'doodles.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'doodles', {
      title: 'Create Doodle',
      state: 'doodles.create',
      roles: ['user']
    });
  }
}());
