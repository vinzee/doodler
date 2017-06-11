(function () {
  'use strict';

  describe('Doodles Route Tests', function () {
    // Initialize global variables
    var $scope,
      DoodlesService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _DoodlesService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      DoodlesService = _DoodlesService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('doodles');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/doodles');
        });

        it('Should be abstract', function () {
          expect(mainstate.abstract).toBe(true);
        });

        it('Should have template', function () {
          expect(mainstate.template).toBe('<ui-view/>');
        });
      });

      describe('View Route', function () {
        var viewstate,
          DoodlesController,
          mockDoodle;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('doodles.view');
          $templateCache.put('modules/doodles/client/views/view-doodle.client.view.html', '');

          // create mock Doodle
          mockDoodle = new DoodlesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Doodle Name'
          });

          // Initialize Controller
          DoodlesController = $controller('DoodlesController as vm', {
            $scope: $scope,
            doodleResolve: mockDoodle
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:doodleId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.doodleResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            doodleId: 1
          })).toEqual('/doodles/1');
        }));

        it('should attach an Doodle to the controller scope', function () {
          expect($scope.vm.doodle._id).toBe(mockDoodle._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/doodles/client/views/view-doodle.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          DoodlesController,
          mockDoodle;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('doodles.create');
          $templateCache.put('modules/doodles/client/views/form-doodle.client.view.html', '');

          // create mock Doodle
          mockDoodle = new DoodlesService();

          // Initialize Controller
          DoodlesController = $controller('DoodlesController as vm', {
            $scope: $scope,
            doodleResolve: mockDoodle
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.doodleResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/doodles/create');
        }));

        it('should attach an Doodle to the controller scope', function () {
          expect($scope.vm.doodle._id).toBe(mockDoodle._id);
          expect($scope.vm.doodle._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/doodles/client/views/form-doodle.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          DoodlesController,
          mockDoodle;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('doodles.edit');
          $templateCache.put('modules/doodles/client/views/form-doodle.client.view.html', '');

          // create mock Doodle
          mockDoodle = new DoodlesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Doodle Name'
          });

          // Initialize Controller
          DoodlesController = $controller('DoodlesController as vm', {
            $scope: $scope,
            doodleResolve: mockDoodle
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:doodleId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.doodleResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            doodleId: 1
          })).toEqual('/doodles/1/edit');
        }));

        it('should attach an Doodle to the controller scope', function () {
          expect($scope.vm.doodle._id).toBe(mockDoodle._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/doodles/client/views/form-doodle.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
