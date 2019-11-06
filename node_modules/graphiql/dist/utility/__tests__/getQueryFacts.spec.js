"use strict";

var _graphql = require("graphql");

var _getQueryFacts = require("../getQueryFacts");

/**
 *  Copyright (c) 2019 GraphQL Contributors.
 *
 *  This source code is licensed under the MIT license found in the
 *  LICENSE file in the root directory of this source tree.
 */
describe('collectVariables', function () {
  var TestType = new _graphql.GraphQLObjectType({
    name: 'Test',
    fields: {
      id: {
        type: _graphql.GraphQLID
      },
      string: {
        type: _graphql.GraphQLString
      },
      int: {
        type: _graphql.GraphQLInt
      },
      float: {
        type: _graphql.GraphQLFloat
      },
      boolean: {
        type: _graphql.GraphQLBoolean
      }
    }
  });
  var TestSchema = new _graphql.GraphQLSchema({
    query: TestType
  });
  it('returns an empty object if no variables exist', function () {
    var variableToType = (0, _getQueryFacts.collectVariables)(TestSchema, (0, _graphql.parse)('{ id }'));
    expect(variableToType).toEqual({});
  });
  it('collects variable types from a schema and query', function () {
    var variableToType = (0, _getQueryFacts.collectVariables)(TestSchema, (0, _graphql.parse)("\n      query ($foo: Int, $bar: String) { id }\n    "));
    expect(Object.keys(variableToType)).toEqual(['foo', 'bar']);
    expect(variableToType.foo).toEqual(_graphql.GraphQLInt);
    expect(variableToType.bar).toEqual(_graphql.GraphQLString);
  });
  it('collects variable types from multiple queries', function () {
    var variableToType = (0, _getQueryFacts.collectVariables)(TestSchema, (0, _graphql.parse)("\n      query A($foo: Int, $bar: String) { id }\n      query B($foo: Int, $baz: Float) { id }\n    "));
    expect(Object.keys(variableToType)).toEqual(['foo', 'bar', 'baz']);
    expect(variableToType.foo).toEqual(_graphql.GraphQLInt);
    expect(variableToType.bar).toEqual(_graphql.GraphQLString);
    expect(variableToType.baz).toEqual(_graphql.GraphQLFloat);
  });
});