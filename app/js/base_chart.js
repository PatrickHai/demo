var drawBarChart = function(data, chart_id){

  var margin = {top: 40, right: 20, bottom: 40, left: 40},
    width = 860 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom;

  var formatPercent = d3.format(".0%");

  var x = d3.scale.ordinal()
      .rangeRoundBands([0, width], .1);

  var y = d3.scale.linear()
      .range([height, 0]);

  var xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom");

  var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left")
      .tickFormat(formatPercent);

  var tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0])
    .html(function(d) {
      return "<strong>"+d.category+":</strong> <span style='color:red'>" + d.value + "</span>";
    })

  var svg = d3.select('#'+chart_id)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  svg.call(tip);

  x.domain(data.map(function(d) { return d.category; }));
  y.domain([0, d3.max(data, function(d) { return d.value; })]);

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
      .selectAll("text")
        .style("text-anchor", "end")
        .attr("transform", function() {
            return "rotate(-20)"
        })

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end");

  var bars = svg.selectAll(".bar")
      .data(data)
      .enter().append("rect")
      .on('mouseover', tip.show)
      .on('mouseout', tip.hide)
      .attr("y",function(d,i){ return height; })
      .attr("fill","#4985EA")
      .attr("height",0)
      .transition()
      .duration(2000)
      .ease("bounce")
      .delay(function(d,i){
          return i * 200;
      })
      .attr("x", function(d) { return x(d.category); })
      .attr("y", function(d) { return y(d.value) })
      .attr("width", x.rangeBand())
      .attr("height", function(d) { return height - y(d.value); })
      .attr("fill","#4DB39A")
      .attr("class", "bar");

  function type(d) {
    d.value = +d.value;
    return d;
  }


  d3.select("#sortBar").on("change", change);

  // var sortTimeout = setTimeout(function() {
  //   d3.select("input").property("checked", true).each(change);
  // }, 10000);

  function change() {
    // clearTimeout(sortTimeout);

    // Copy-on-write since tweens are evaluated after a delay.
    var x0 = x.domain(data.sort(this.checked
        ? function(a, b) { return b.value - a.value; }
        : function(a, b) { return d3.ascending(a.category, b.category); })
        .map(function(d) { return d.category; })).copy();

    svg.selectAll(".bar")
        .sort(function(a, b) { return x0(a.category) - x0(b.category); });

    var transition = svg.transition().duration(750),
        delay = function(d, i) { return i * 50; };

    transition.selectAll(".bar")
        .delay(delay)
        .attr("x", function(d) { return x0(d.category); });

    transition.select(".x.axis")
        .call(xAxis)
      .selectAll("g")
        .delay(delay);
  }
}

var drawLiquidChart = function(data, chart_id){
  var config = liquidFillGaugeDefaultSettings();
      config.circleThickness = 0.15;
      config.circleColor = "#808015";
      config.textColor = "#555500";
      config.waveTextColor = "#FFFFAA";
      config.waveColor = "#AAAA39";
      config.textVertPosition = 0.8;
      config.waveAnimateTime = 2000;
      config.waveHeight = 0.05;
      config.waveAnimate = true;
      config.waveRise = false;
      config.waveHeightScaling = false;
      config.waveOffset = 0.45;
      config.textSize = 0.65;
      config.waveCount = 3;
  return loadLiquidFillGauge(chart_id, data, config);
}