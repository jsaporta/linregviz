var svg = d3.select('svg')
  .attr('width', 650)
  .attr('height', 650)
var margin = {
  top: 25, bottom: 25,
  left: 25, right: 25
}
var height = svg.attr('height') - margin.top - margin.bottom
var width = svg.attr('width') - margin.left - margin.right
var g = svg.append("g").attr("transform",
  "translate(" + margin.left + "," + margin.top + ")");
var xScale = d3.scaleLinear()
  .domain([0, 1])
  .range([0, width]);
var yScale = d3.scaleLinear()
  .domain([0, 1])
  .range([height, 0]);
var line = d3.line()
  .x(d => xScale(d.x))
  .y(d => yScale(d.y));

g.append('g')
  .attr('class', 'x-axis')
  .attr('transform', 'translate(0,' + height + ')')
  .call(d3.axisBottom()
    .scale(xScale)
    .ticks(4));
g.append('g')
  .attr('class', 'y-axis')
  .call(d3.axisLeft()
    .scale(yScale)
    .ticks(4));

function render_plot(dataset, estimates) {
  var x_vals = numeric.linspace(0, 1, 1001);

  // The circle colors are set in style.css,
  // just to make sure I could do it.
  g.selectAll('circle')
    .data(dataset)
    .enter()
    .append('circle')
    .attr('cx', d => xScale(d.x))
    .attr('cy', d => yScale(d.y))
    .attr('r', 10);

  if (dataset.length >= 2) {
    var plot_x_vals = x_vals.filter(function (d) {
      var y_val = estimates.intercept + estimates.slope * d
      if (y_val <= 1) {
        return true;
      }
      return false;
    });
    var line_dat = plot_x_vals.map(d =>
      ({ x: d, y: estimates.intercept + estimates.slope * d }
      ));
  }

  if (dataset.length >= 2 &&
    !d3.selectAll('.regline').empty()) {
    d3.selectAll('.regline')
      .datum(line_dat)
      .transition()
      .attr("d", line);
  }
  else if (dataset.length >= 2 &&
    d3.selectAll('.regline').empty()) {
    g.append("path")
      .datum(line_dat)
      .attr('class', 'regline')
      .attr("d", line);
  }
};


d3.json('/data', function (dataset) {
  d3.json('/model', function (estimates) {
    render_plot(dataset, estimates);
  });
});

svg.on("click", function () {
  var coords = d3.mouse(this);

  var newData = {
    x: xScale.invert(coords[0] - margin.left),
    y: yScale.invert(coords[1] - margin.bottom)
  }

  d3.request('/data')
    .header('Content-Type', 'application/json')
    .post(JSON.stringify(newData), function (d) {
      d3.json('/model', function (estimates) {
        render_plot(JSON.parse(d.response), estimates);
      });
    });
});

document.getElementById("button")
  .onclick = function (event) {
    d3.request('/data')
      .send('DELETE', function (d) {
        d3.json('/model', callback = function (estimates) {
          d3.selectAll('circle').remove();
          d3.selectAll('.regline').remove();
          render_plot(JSON.parse(d.response), estimates);
        });
      });
  };
