d3.json("./final_workforce_data.json").then(function(data) {

    var all_years = data.data.map(row => row.year)
    //find min max
    min_year = d3.min(all_years)
    max_year = d3.max(all_years)
    //first create a list of years in an array
    
    //North America
    var years = d3.range(1990, max_year)
    var avgFemLaborForce_NA = [];
    years.forEach(year =>{
        var rows = data.data.filter(row => row.year == year & row.continent_name == "North America")
        avgFemLaborForce_NA.push(d3.mean(rows.map(row => row.fem_laborforce)))
    })
    
    //Asia
    var years = d3.range(1990, max_year)
    var avgFemLaborForce_Asia = [];
    years.forEach(year =>{
        var rows = data.data.filter(row => row.year == year & row.continent_name == "Asia")
        avgFemLaborForce_Asia.push(d3.mean(rows.map(row => row.fem_laborforce)))
    })
    
    var trace1 = {
      x: years,
      y:avgFemLaborForce_NA,
      type: "line",
      color: "red",
      name: "North America"
        
    };
    
    
    var trace2 = {
        x: years,
        y:avgFemLaborForce_Asia,
        type: "line",
        color:"blue",
        name: "Asia"
          
      };
        
    var data =[trace1, trace2];
    
    Plotly.newPlot("plot",data)
    
    });
    