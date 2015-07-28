'use strict';

describe('notely.version module', function() {
  beforeEach(module('notely.version'));

  describe('version service', function() {
    it('should return current version', inject(function(version) {
      expect(version).toEqual('0.1');
    }));
  });
});
