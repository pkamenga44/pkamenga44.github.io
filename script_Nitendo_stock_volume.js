// Set dimensions and margins for the chart
//const margin = { top: 70, right: 60, bottom: 40, left: 80 };
//const width = 1200 - margin.left - margin.right;
//const height = 500 - margin.top - margin.bottom;

const margin = { top: 80, right: 40, bottom: 60, left: 175 }
const width = 800 - margin.left - margin.right
const height = 500 - margin.top - margin.bottom

// Create the SVG element and append it to the chart container
const svg = d3.select("#chart-container")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", `translate(${margin.left},${margin.top})`);


  //Creating our tooltip object.

const tooltip = d3.select("body").append("div")
  .attr("id", "tooltip")
  .style("opacity", 0);



// Adding  a highlight rectangle (initially hidden) for our tooltip


//To get the last five years data
  
const today = new Date();
const fiveYearsAgo = new Date(today.getFullYear() -5, today.getMonth(), today.getDate());

//Load and Process the data

d3.csv("Nintendo_stock_data.csv").then(data => {

  // Parse the date and convert the population to a number
  const parseDate = d3.timeParse("%Y-%m-%d"); //Formatted to start with the year-month-day
  data.forEach(d => {
    d.Date = parseDate(d.Date);  //parsing date to date format 
    d.Volume = +d.Volume;
    
  });
  
  // Filter for the last 5 years
  const lastFiveYears = data.filter(d => d.Date >= fiveYearsAgo);

  //Group by year and sum volume
      const volumeByYear = d3.rollups(
        lastFiveYears,
        v => d3.sum(v, d => d.Volume),
        d => d.Date.getFullYear()
      ).map(([year, volume]) => ({ year, volume }));

      // Sort by year

      volumeByYear.sort((a, b) => d3.ascending(a.year, b.year));

      console.log(volumeByYear);


  //Scaling x-axis

const x = d3.scaleBand()
        .domain(volumeByYear.map(d => d.year))
        .range([0, width])
        .padding(0.4); // Try values like 0.1, 0.3, 0.5 to adjust spacing and bar width:Lower padding → wider bars,Higher padding → narrower bars

//Scaling y-axis


const y = d3.scaleLinear()
        .domain([0, d3.max(volumeByYear, d => d.volume)]).nice()
        .range([height, 0]);

//Adding x-axes

        svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x).tickFormat(d3.format("d")))
        .selectAll("text")
        .attr("transform", "rotate(-45)")
        .style("text-anchor", "end");


//Adding y-axes
       svg.append("g")
        .call(d3.axisLeft(y)
              .tickFormat(d3.format(".2s"))); //Formatting my y-axis in million.

//
// Bars
      svg.selectAll(".bar")
        .data(volumeByYear)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", d => x(d.year))
        .attr("y", d => y(d.volume))
        .attr("width", x.bandwidth())
        .attr("height", d => height - y(d.volume))
        .on("mouseover", (event, d) => {
        tooltip.transition().duration(200).style("opacity", 0.9);
        tooltip.html(`Year: ${d.year}<br>Volume: ${(d.volume / 1e6).toFixed(2)}M`)
        .style("left", (event.pageX + 10) + "px")
        .style("top", (event.pageY - 28) + "px");

        
  })

.on("mouseout", () => {
    tooltip.transition().duration(500).style("opacity", 0);
    
  });








// Volume labels on top of bars

    svg.selectAll(".label")
      .data(volumeByYear)
      .enter().append("text")
      .attr("class", "label")
      .attr("x", d => x(d.year) + x.bandwidth() / 2)
      .attr("y", d => y(d.volume) - 5)
      .attr("text-anchor", "middle")
      //.text(d => d.volume.toLocaleString());
      .text(d => (d.volume / 1e6).toFixed(2) + "M");


/// Add Y-axis label

svg.append("text")
  .attr("transform", "rotate(-90)")
  .attr("y", 0 - margin.left + 100)
  .attr("x", 0 - (height / 2))
  .attr("dy", "1em")
  //.style("text-anchor", "middle")
  .style("text-anchor", "middle")
  .style("font-weight", "normal")
  .text("Stock Volume");


// Add the chart title

  svg.append("text")
  .attr("class", "chart-title")
  .attr("x", margin.left - 115)
  .attr("y", margin.top - 110)
  .style("font-size", "15px")
  .style("font-weight", "normal")
  .style("font-family", "sans-serif")
  .text("Nintendo Co., Ltd. (NTDOY) total volume per Year");


  //console.log(lastFiveYears);
  //console.log(d3.extent(lastFiveYears, d => d.Date)); checking last five years
  //console.log(data);
  //console.log(d3.extent(data, d => d.Date));//checking  min and max Date.
  
  // Set the domains for the x and y scales
  
 

    

 

  
  // Add the x-axis

  //svg.append("g")
  //.attr("transform", `translate(0,${height})`)
  //.call(d3.axisBottom(x));  //Without any tick() function provided for formatting , only year will be returned,

  //reformatting x-axis

 
  
 // Add the y-axis

//svg.append("g")
  //.attr("transform", `translate(${width},0)`)
  //.call(d3.axisRight(y).tickFormat(d => {
    //if (isNaN(d)) return "";
   // return `$${d.toFixed(2)}`;
  //})
//)

// Reformate the y-axis
  



   })