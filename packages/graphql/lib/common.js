'use strict';
require('isomorphic-fetch');

var React = require('react');
var ReactApollo = require('react-apollo');

var ApolloClient = require('apollo-client').default;
var ApolloCache = require('apollo-cache-inmemory');
var ApolloLink = require('apollo-link-http');

var hopsConfig = require('hops-config');

var Context = require('hops-redux').Context;

exports.APOLLO_STATE = 'APOLLO_STATE';
exports.APOLLO_IQRD = 'APOLLO_IQRD';

exports.Context = exports.createContext = Context.extend({
  initialize: function (options) {
    Context.prototype.initialize.call(this, options);
    this.client = this.createClient(options.graphql || {});
  },
  createClient: function (options) {
    return new ApolloClient(Object.assign(
      {},
      options,
      {
        link: options.link || this.createLink(),
        cache: options.cache || this.createCache()
      }
    ));
  },
  createLink: function () {
    return new ApolloLink.HttpLink({
      uri: hopsConfig.graphqlUri
    });
  },
  createCache: function () {
    return new ApolloCache.InMemoryCache({
      fragmentMatcher: this.createFragmentMatcher()
    });
  },
  createFragmentMatcher: function () {
    var result = this.getIntrospectionResult();
    if (result) {
      return new ApolloCache.IntrospectionFragmentMatcher({
        introspectionQueryResultData: this.getIntrospectionResult()
      });
    } else {
      return new ApolloCache.HeuristicFragmentMatcher();
    }
  },
  enhanceElement: function (reactElement) {
    return React.createElement(
      ReactApollo.ApolloProvider,
      {
        client: this.client
      },
      Context.prototype.enhanceElement.call(this, reactElement)
    );
  }
});
