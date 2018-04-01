'use strict';

describe('wuptime.version module', function() {
  beforeEach(module('wuptime.version'));

  describe('version service', function() {
    it('should return current version', inject(function(version) {
      expect(version).toEqual('0.1');
    }));
  });
});
