const url =
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json";

fetch(url)
  .then((response) => response.json())
  .then((response) => {
    const { data } = response;
    chart(data);
  });

function chart(data = [date, value]) {
  //  define div for tooltip
  const tooltip = d3
    .select("body")
    .append("div")
    .attr("id", "tooltip")
    .style("opacity", 0);

  // define canvas
  const w = 1100;
  const h = 600;
  const padding = 45;

  const svg = d3
    .select("#chart-container")
    .append("svg")
    .attr("height", h)
    .attr("width", w);

  // define y scale
  const yScale = d3.scaleLinear();
  yScale.domain([0, d3.max(data, (d) => d[1])]).range([h - padding, padding]);

  // define x scale
  const xScale = d3
    .scaleTime()
    .domain([
      d3.min(data, (d) => new Date(d[0])),
      d3.max(data, (d) => new Date(d[0])),
    ])
    .range([padding, w - padding]);

  // define the y  and x axis
  const yAxis = d3.axisLeft(yScale);

  const xAxis = d3.axisBottom(xScale);

  // draw y and x axis
  svg
    .append("g")
    .attr("transform", "translate(" + padding + ",0)")
    .attr("id", "y-axis")
    .call(yAxis);

  svg
    .append("g")
    .attr("transform", "translate(0," + (h - padding) + ")")
    .attr("id", "x-axis")
    .call(xAxis);

  // create bars and tooltip
  const barwidth = ((w - padding) / data.length) * 0.7;

  svg
    .selectAll("rect")
    .data(data)
    .enter()
    .append("rect")
    .attr("data-date", function (d, i) {
      return data[i][0];
    })
    .attr("data-gdp", function (d, i) {
      return data[i][1];
    })
    .attr("x", (d) => xScale(new Date(d[0])))
    .attr("y", (d) => yScale(d[1]))
    .attr("width", barwidth)
    .attr("height", (d) => h - padding - yScale(d[1]))
    .attr("fill", "navy")
    .attr("class", "bar")
    .on("mouseover", function (d) {
      tooltip.attr("data-date", d3.select(this).attr("data-date"));
      tooltip.transition().duration(200).style("opacity", 0.8);
      tooltip
        .html(
          d3.select(this).attr("data-date") +
            "<br/>" +
            "$" +
            d3.select(this).attr("data-gdp") +
            " Billion"
        )
        .style("left", d3.event.pageX + "px")
        .style("top", d3.event.pageY - 75 + "px");
    })
    .on("mouseout", function (d) {
      tooltip.transition().duration(500).style("opacity", 0);
    });
}
