const v = {
    margins : { 
        left:80,
        right:20,
        top:10,
        bottom:125
    },
    flag : true
}

function makeButtonsFromTownNames(towns){
    d3.select("#adjustaBar")
    .selectAll("input")
    .data(towns)
    .enter()
        .append("input")
        .attrs({
            "type":"button",
            "class": "townButton",
            "value": d => d,
            display: 'block'
        })
        .on('click', (d) => updateAdjustaBar(dataSourceData, d))

}

function makeAxisGroup(parent, className, transformation){
    return parent.append("g")
    .attrs({
        "class": className,
        "transform": transformation
    });
}

function makeAxisLabel(parent, x, y, transformation, textVal, cl){
    return parent.append("text")
    .attrs({
        "x": x,
        "y": y,
        "font-size": "20px",
        "text-anchor": "middle",
        "transform": transformation,
        'class': cl,
        'fill': '#8E8883'
    })
    .text(textVal);
}

function showToolTip(d){
    return tooltipDiv
        .style("left", (d3.event.pageX - 150 > 0 ) ? d3.event.pageX - 150 +  "px" : 0 + 'px')
        .style("top", d3.event.pageY - 150 + "px")
        .style("display", "inline-block")
        .html(`<b>${d.race}</b>: <br>
        ${d.val}%`);
}

let tooltipDiv = d3.select('.toolTip')
let adjustaBarDiv = document.getElementById("adjustaBar");
var adjustaSVG = d3.select(adjustaBarDiv)
    .append("svg")
    .attr("class",'adjustaSVGWrapper');
var adjustaGWrapper =adjustaSVG.append("g")
        .attr("transform", `translate(${v.margins.left},${v.margins.top})`)
        .attr("class", 'adjustaGWrapper');


// Extract the width and height that was computed by CSS.
      let adjustaResizedWidth = adjustaBarDiv.clientWidth;
      let adjustaResizedHeight = 500; //-50 for buttons!!
      // let adjustaResizedHeight = adjustaBarDiv.clientHeight; //-50 for buttons!!
      let wLessM = adjustaResizedWidth - v.margins.left - v.margins.right;
      let hLessM = adjustaResizedHeight - v.margins.top - v.margins.bottom;

      adjustaSVG.attrs({
        "width": adjustaResizedWidth,
        "height": adjustaResizedHeight,
      })

var xAxisGroup = makeAxisGroup(adjustaGWrapper, 'AdjustaXaxis', `translate(0, ${hLessM})` )
var yAxisGroup = makeAxisGroup(adjustaGWrapper, 'AdjustaYaxis', '')

//make axis labels
let yLabel = makeAxisLabel(adjustaGWrapper, -(hLessM / 2), (-60), "rotate(-90)", '', 'YAxisLabel')
let xLabel = makeAxisLabel(adjustaGWrapper, (wLessM / 2), (adjustaResizedHeight - 35), "", '', 'XAxisLabel')

// Scales Scale
var adjustaXScale = d3.scaleBand().range([0, wLessM]).padding(0.1);
var adjustaYScale = d3.scaleLinear().range([hLessM, 0]);


// axis
var xAxis = d3.axisBottom(adjustaXScale).tickSize(10);
var yAxis = d3.axisLeft(adjustaYScale).tickFormat(d => `${d}%`).ticks(Math.max(hLessM/80, 2));
let dataSourceData;

d3.json("topeue.json", data => {

    dataSourceData = data;
    // Clean data
    data.forEach(function(d) {
        d.white = +d.White;
        d.whiteAndHispanic = +d.WhiteAndHispanic;
        d.AfricanAmericans = +d.AfricanAmericans;
        d.AmericanIndianAndAlaskaNative = +d.AmericanIndianAndAlaskaNative;
        d.Asian = +d.Asian;
        d.Other = +d.Other;
        d.twoOrMore = +d['2+Races'];
        d.HispanicLatino = +d.HispanicLatino;
        d.percentBelow = +d.PercentBelow;
        d.men = +d.BPMen;
        d.women = +d.BPWomen;
    });

    //get town names into array
    let AllTownNames = data.map((d) => { 
        return d.geo
    })

    makeButtonsFromTownNames(AllTownNames)
    // Run the vis for the first time
    updateAdjustaBar(data, 'Central Falls');
});

function updateAdjustaBar(data, townName) {

    let selectedTownObj = data.filter((town) => town.geo === townName)
    let selectedBarData = {
        'African American': +selectedTownObj[0].AfricanAmericans,
        'American Indian & Alaska Native': +selectedTownObj[0].AmericanIndianAndAlaskaNative,
        'Asian': +selectedTownObj[0].Asian,
        'Hispanic of Latino': +selectedTownObj[0].HispanicLatino,
        'Other': +selectedTownObj[0].Other,
        'Two Or More': +selectedTownObj[0].twoOrMore,
        'White': +selectedTownObj[0].White,
        'White And Hispanic' : +selectedTownObj[0].WhiteAndHispanic,
    }

    let raceKeys = Object.keys(selectedBarData)
    let raceVals = Object.values(selectedBarData)
    let mappedRaces = raceVals.map((v, i) => {
        return {
            race: raceKeys[i],
            val : v
        }
    })

    adjustaXScale.domain(raceKeys);

    //gathers the percentages and calc max
    //ADJUSTABLE y-Axis
    // adjustaYScale.domain([0, d3.max(mappedRaces, d => d.val )])
    adjustaYScale.domain([0, 60])
    
    //transition the y axis groups
    //ONLY animates with variable y axis domain
    yAxisGroup.transition().duration(500).call(yAxis);
    xAxisGroup
        .call(xAxis)
        .selectAll(".tick text")
          .call(wrap, adjustaXScale.bandwidth());

    xAxisGroup.selectAll('.tick text')
        .attrs({
            'transform': 'rotate(-45)',
            'text-anchor': 'end',
            'alignment-baseline':'middle',
            'x': -5,
            'y': 15,
            'dy':0,
            'class' :'AdjustaXTickLabel'
        })

    // JOIN new data with old elements.
    var rects = adjustaGWrapper.selectAll(".singleRect")
        .data(mappedRaces, (d) => d.race).attr('fill','darkkhaki');
    // EXIT old elements not present in new data.
    // ENTER new elements
    // let exitData = rects.exit();
    // let enterData = rects.enter();

    // exitData
    rects.exit()
        // .attr("fill", "darkkhaki")
    .transition().duration(700)
        .attr("y", adjustaYScale(0))
        .attr("height", 0)
        .remove();

    // ENTER new elements present in new data...
    // enterData
    rects.enter()
        .append("rect")
        .attrs({
            "fill": "darkkhaki",
            "x": (d, i) => adjustaXScale(d.race), 
            "width": adjustaXScale.bandwidth,
            "y": (d) => adjustaYScale(d.val),
            "height": (d) => hLessM - adjustaYScale(d.val),
            'class': 'singleRect',
            'id': (d) => d.race
        })
        .on("mousemove", d => showToolTip(d) )
        .on("mouseout", d => tooltipDiv.style("display", "none") )
        .transition().duration(700)


        // MERGE AND updateAdjustaBar NEW data with 
        // already-present elements present in new data.
        rects.merge(rects)
        .transition().duration(700)
            .attrs({
                "x": (d, i) => adjustaXScale(d.race), 
                "width": adjustaXScale.bandwidth,
                "y": (d) => adjustaYScale(d.val),
                "height": (d) => hLessM - adjustaYScale(d.val),
                'class': 'singleRect',
                'id': (d) => d.race
            })

    
    yLabel.text('Percent At Or Below Poverty');
    xLabel.text(townName);

}

function setXYTrans(obj, xPos, yPos, trans){
    return obj.attrs({
        'x': xPos,
        'y': yPos,
        'transform': trans
    })
}

function resizeAdjustaBar(){
    // Extract the width and height that was computed by CSS.
      let resizedFnWidth = adjustaBarDiv.clientWidth;
      // let testRszH = adjustaBarDiv.clientHeight - 50;
      let testRszH = 500;

      // - 50 for buttons, conditional for min-height
      // let resizedFnHeight = (testRszH > 424) ? adjustaBarDiv.clientHeight - 50 : 425;
      let resizedFnHeight = testRszH;
      let adjustaResizedWidthLessMargins = resizedFnWidth - v.margins.left - v.margins.right;
      let adjustaResizedHeightLessMargins = resizedFnHeight - v.margins.top - v.margins.bottom;

      let xAxisLabel = d3.select('.XAxisLabel')
      let yAxisLabel = d3.select('.YAxisLabel')
      
      adjustaSVG.attrs({
        "width" : resizedFnWidth,
        "height" : resizedFnHeight
      });

    //updateAdjustaBar scale RANGES
    adjustaXScale.range([0, adjustaResizedWidthLessMargins]);
    adjustaYScale.range([adjustaResizedHeightLessMargins, 0]);


    setXYTrans(xAxisGroup, (adjustaResizedWidthLessMargins / 2), (adjustaResizedHeight * .1), `translate(0, ${adjustaResizedHeightLessMargins})`);
    xAxisGroup
        .call(xAxis)
        .selectAll(".tick text")
        .call(wrap, adjustaXScale.bandwidth());
    
    setXYTrans(xAxisLabel, (adjustaResizedWidthLessMargins / 2), (resizedFnHeight - 35), '');
    setXYTrans(yAxisGroup, (-adjustaResizedHeightLessMargins / 2), (-v.margins.left / 2), '');
    yAxisGroup.call(yAxis);

    setXYTrans(yAxisLabel, (-adjustaResizedHeightLessMargins / 2), (-60),'rotate(-90)');


      //updateAdjustaBar Bars
      d3.selectAll('.singleRect').attrs({
        'x' : d => adjustaXScale(d.race),
        'y' : d => adjustaYScale(d.val),
        'width' : d => adjustaXScale.bandwidth(),
        'height' : d => adjustaResizedHeightLessMargins - adjustaYScale(d.val) 
      });
    

      yAxis.ticks(Math.max(adjustaResizedHeightLessMargins/80, 2))
}

function wrap(text, width) {
  text.each(function() {
    var text = d3.select(this),
        words = text.text().split(/\s+/).reverse(),
        word,
        line = [],
        lineNumber = 0,
        lineHeight = 1.1, // ems
        y = text.attr("y"),
        dy = .5,
        tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em")
    while (word = words.pop()) {
      line.push(word)
      tspan.text(line.join(" "))
      if (tspan.node().getComputedTextLength() > width) {
        line.pop()
        tspan.text(line.join(" "))
        line = [word]
        tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", `${++lineNumber * lineHeight + dy}em`).text(word)
      }
    }
  })
}

d3.select(window).on("resize", serializer( resizeCharts, selectAndUpdatePies, resizePolarArea, resizeAdjustaBar ));