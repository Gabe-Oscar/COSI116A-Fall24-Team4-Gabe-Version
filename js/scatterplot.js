
var margin = {top: 10, right: 10, bottom: 10, left: 10},
    width = 500,
    height = 500;

var svg = d3.select("#scatterplot_svg")
    .append(svg)
        .attr("width", width)
        .attr("height", height)

d3.csv("../Data/Rapid Transit Reliability")