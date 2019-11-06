"use strict";

var _normalizeWhitespace = require("../normalizeWhitespace");

/**
 *  Copyright (c) 2019 GraphQL Contributors.
 *
 *  This source code is licensed under the MIT license found in the
 *  LICENSE file in the root directory of this source tree.
 */
describe('QueryEditor', function () {
  it('removes unicode characters', function () {
    var result = (0, _normalizeWhitespace.normalizeWhitespace)(_normalizeWhitespace.invalidCharacters.join(''));
    expect(result).toEqual(' '.repeat(_normalizeWhitespace.invalidCharacters.length));
  });
});