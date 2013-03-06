/*global $:false, _:false, Morris:false, __report:false, Raphael:false */
/*jshint browser:true*/

$(function(){
  "use strict";

  // Workaround for jshint complaint I don't want to turn off.
  var raphael = Raphael;

  //  $('.plato-file-link').fitText(1.2, { minFontSize: '20px', maxFontSize: '28px' });

  var colors = [
    '#50ABD2',
    '#ED913D',
    '#E8182E'
  ];

  var graphHeight = 10,
    lineHeight = 1.35;

  var horizontalGraph = function(paper, num, orig, width, label, color){
    var offset = 70;
    var y = parseInt(graphHeight * num * lineHeight,10);
    paper.rect(offset, y, width, graphHeight).attr({fill: color, stroke:'none'});
    paper.text(offset - 5, y + 5, label).attr({'font-size':12,'text-anchor':'end' });
    paper.text(width + offset + 8, y + 6, orig).attr({'font-size':10,'text-anchor':'start' });
  };

  function getColor(value, colors, thresholds) {
    thresholds = thresholds || [];
    for (var i = thresholds.length - 1; i > -1; i--) {
      if (value > thresholds[i]) return colors[i+1];
    }
    return colors[0];
  }

  function drawFileCharts(reports) {
    reports.forEach(function(report, i){
      var $container = $('#plato-file-' + i + ' .plato-file-chart');
      var width = $container.width(),
          height = $container.height();

      var chart = $container.data('chart');
      if (!chart) $container.data('chart', chart = raphael($container[0],width,height));
      chart.clear();
      chart.setSize(width, height);

      // yield for UI
      setTimeout(function(){
        //leave room at the end for the value labels.
        width = width - 120;

        var value = report.complexity.aggregate.complexity.cyclomatic;
        horizontalGraph(chart,0,value, Math.min(value * 2, width),'complexity', getColor(value, colors, [5,10]));

        value = report.complexity.aggregate.complexity.sloc.physical;
        horizontalGraph(chart,1,value, Math.min(value, width), 'sloc', getColor(value,colors,[400,600]));

        value = report.complexity.aggregate.complexity.halstead.bugs.toFixed(2);
        horizontalGraph(chart,2,value, value * 5, 'est bugs', getColor(value,colors,[1,5]));
      },0);
    });
  }

  function drawOverviewCharts(reports) {
    $('.chart').empty();

    var sloc = {
      element: 'chart_sloc',
      data: [],
      xkey: 'label',
      ykeys: ['value'],
      ymax : 400,
      labels: ['Lines'],
      barColors : ['#FAAF78']
    };
    var maintainability = {
      element: 'chart_maintainability',
      data: [],
      xkey: 'label',
      ykeys: ['value'],
      ymax : 171,
      labels: ['Maintainability'],
      barColors : ['#FAAF78']
    };
    var bugs = {
      element: 'chart_bugs',
      data: [],
      xkey: 'label',
      ykeys: ['value'],
      labels: ['Bugs'],
      ymax: 20,
      barColors : ['#D54C2C']
    };

    reports.forEach(function(report){

      sloc.ymax = Math.max(sloc.ymax, report.complexity.aggregate.complexity.sloc.physical);
      bugs.ymax = Math.max(bugs.ymax, report.complexity.aggregate.complexity.halstead.bugs.toFixed(2));


      sloc.data.push({
        value : report.complexity.aggregate.complexity.sloc.physical,
        label : report.complexity.module
      });
      bugs.data.push({
        value : report.complexity.aggregate.complexity.halstead.bugs.toFixed(2),
        label : report.complexity.module
      });
      maintainability.data.push({
        value : report.complexity.maintainability.toFixed(2),
        label : report.complexity.module
      });
    });

    function onGraphClick(i){
      document.location = __report.reports[i].info.link;
    }

    var charts = [
      Morris.Bar(bugs),
      Morris.Bar(sloc),
      Morris.Bar(maintainability)
    ];

    charts.forEach(function(chart){
      chart.on('click', onGraphClick);
    });
    return charts;
  }

  drawOverviewCharts(__report.reports);
  drawFileCharts(__report.reports);

  $(window).on('resize', _.debounce(function(){
    drawFileCharts(__report.reports);
    drawOverviewCharts(__report.reports);
  },200));
});



