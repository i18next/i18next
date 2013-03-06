/*global $:false, _:false, Morris:false, CodeMirror:false, __report:false */
/*jshint browser:true*/

$(function(){
  "use strict";

  _.templateSettings = {
    interpolate : /\{\{(.+?)\}\}/g
  };

  function focusFragment() {
    $('.plato-mark').removeClass('focus');
    var markId = window.location.hash.substr(1);
    if (markId) $('.' + markId).addClass('focus');
    return focusFragment;
  }

  window.onhashchange = focusFragment();

  var srcEl = document.getElementById('file-source');

  var options = {
    lineNumbers : true,
    gutters     : ['plato-gutter-jshint','plato-gutter-complexity'],
    readOnly    : 'nocursor'
  };

  var cm = CodeMirror.fromTextArea(srcEl, options);

  var byComplexity = [], bySloc = [];

  __report.complexity.functions.forEach(function(fn,i){
    byComplexity.push({
      label : fn.name,
      value : fn.complexity.cyclomatic
    });
    bySloc.push({
      label : fn.name,
      value : fn.complexity.sloc.physical,
      formatter: function (x) { return x + " lines"; }
    });

    var name = fn.name === '<anonymous>' ? 'function\\s*\\([^)]*\\)' : fn.name;
    var line = fn.line - 1;
    var className = 'plato-mark-fn-' + i;
    var gutter = {
      gutterId : 'plato-gutter-complexity',
      el : $('<a name="' + className + '"><i class="plato-gutter-icon icon-cog"></i></a>')[0]
    };
    var popover = {
      type : 'popover',
      title : fn.name === '<anonymous>' ? '&lt;anonymous&gt;' : 'function ' + fn.name + '',
      content : _.template($('#complexity-popover-template').text())(fn)
    };
    cm.markPopoverText({line : line, ch:0}, name, className, gutter, popover);
  });

  var scrollToLine = function(i) {
    var origScroll = [window.pageXOffset,window.pageYOffset];
    window.location.hash = '#plato-mark-fn-' + i;
    window.scrollTo(origScroll[0],origScroll[1]);
    var line = __report.complexity.functions[i].line;
    var coords = cm.charCoords({line : line, ch : 0});
    $('body,html').animate({scrollTop : coords.top -50},250);
  };

  // yield to the browser
  setTimeout(function(){
    drawCharts([
      { element: 'fn-by-complexity', data: byComplexity },
      { element: 'fn-by-sloc', data: bySloc }
    ]);
  },0);
  setTimeout(function(){
    addLintMessages(__report);
  },0);


  function drawCharts(charts) {
    charts.forEach(function(chart){
      Morris.Donut(chart).on('click',scrollToLine);
    });
  }

  function addLintMessages(report) {
    var lines = {};
    report.jshint.messages.forEach(function (message) {
      var text = 'Column: ' + message.column + ' "' + message.message + '"';
      if (_.isArray(message.line)) {
        message.line.forEach(function(line){
          if (!lines[line]) lines[line] = '';
          lines[line] += '<div class="plato-jshint-message text-'+message.severity+'">' + text + '</div>';
        });
      } else {
        if (!lines[message.line]) lines[message.line] = '';
        lines[message.line] += '<div class="plato-jshint-message text-'+message.severity+'">' + text + '</div>';
      }
    });
    var gutterIcon = $('<a><i class="plato-gutter-icon icon-eye-open"></i></a>');
    Object.keys(lines).forEach(function(line){
      cm.setGutterMarker(line - 1, 'plato-gutter-jshint', gutterIcon.clone()[0]);
      cm.addLineWidget(line - 1, $('<div>' + lines[line] + '</div>')[0]);
    });
  }
});

