'use strict';

describe('Doodles E2E Tests:', function () {
  describe('Test Doodles page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/doodles');
      expect(element.all(by.repeater('doodle in doodles')).count()).toEqual(0);
    });
  });
});
