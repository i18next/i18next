
var readFixtures = function() {
  return jsFixtures.getFixtures().proxyCallTo_('read', arguments);
};

var preloadFixtures = function() {
  jsFixtures.getFixtures().proxyCallTo_('preload', arguments);
};

var loadFixtures = function() {
  jsFixtures.getFixtures().proxyCallTo_('load', arguments);
};

var setFixtures = function(html) {
  jsFixtures.getFixtures().set(html);
};

var sandbox = function(attributes) {
  return jsFixtures.getFixtures().sandbox(attributes);
};
jsFixtures = function() {
  this.containerId = 'js-fixtures';
  this.fixturesCache_ = {};
  this.fixturesPath = 'spec/javascripts/fixtures';
};

jsFixtures.getFixtures = function() {
  return jsFixtures.currentFixtures_ = jsFixtures.currentFixtures_ || new jsFixtures();
};

jsFixtures.prototype.set = function(html) {
  this.cleanUp();
  this.createContainer_(html);
};

jsFixtures.prototype.preload = function() {
  this.read.apply(this, arguments);
};

jsFixtures.prototype.load = function() {
  this.cleanUp();
  this.createContainer_(this.read.apply(this, arguments));
};

jsFixtures.prototype.read = function() {
  var htmlChunks = [];

  var fixtureUrls = arguments;
  for(var urlCount = fixtureUrls.length, urlIndex = 0; urlIndex < urlCount; urlIndex++) {
    htmlChunks.push(this.getFixtureHtml_(fixtureUrls[urlIndex]));
  }

  return htmlChunks.join('');
};

jsFixtures.prototype.clearCache = function() {
  this.fixturesCache_ = {};
};

jsFixtures.prototype.cleanUp = function() {
  $('#' + this.containerId).remove();
};

jsFixtures.prototype.sandbox = function(attributes) {
  var attributesToSet = attributes || {};
  return $('<div id="sandbox" />').attr(attributesToSet);
};

jsFixtures.prototype.createContainer_ = function(html) {
  var container;
  if(html instanceof $.fn.constructor) {
    container = $('<div id="' + this.containerId + '" />');
    container.html(html);
  } else {
    container = '<div id="' + this.containerId + '">' + html + '</div>';
  }
  $('body').append(container);
};

jsFixtures.prototype.getFixtureHtml_ = function(url) {  
  if (typeof this.fixturesCache_[url] == 'undefined') {
    this.loadFixtureIntoCache_(url);
  }
  return this.fixturesCache_[url];
};

jsFixtures.prototype.loadFixtureIntoCache_ = function(relativeUrl) {
  var self = this;
  var url = this.fixturesPath.match('/$') ? this.fixturesPath + relativeUrl : this.fixturesPath + '/' + relativeUrl;
  $.ajax({
    async: false, // must be synchronous to guarantee that no tests are run before fixture is loaded
    cache: false,
    dataType: 'html',
    url: url,
    success: function(data) {
      self.fixturesCache_[relativeUrl] = data;
    },
    error: function(jqXHR, status, errorThrown) {
        throw new Error('Fixture could not be loaded: ' + url + ' (status: ' + status + ', message: ' + (errorThrown ? errorThrown.message : "") + ')');
    }
  });
};

jsFixtures.prototype.proxyCallTo_ = function(methodName, passedArguments) {
  return this[methodName].apply(this, passedArguments);
};

if (afterEach) {
  afterEach(function() {
    jsFixtures.getFixtures().cleanUp();
  });
}
