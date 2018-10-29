function makeD3ElementsFromParentDiv(parendDivID){
  const svgObj = d3.select(parendDivID)
  const adjustaPieGWrapper = svgObj.append('g')
    .attr('class','adjustaPieGWrapper')
    .style('max-height','300px');

  const adjustaBarDivWrapper = document.getElementById("adjustaBar");
  // Extract the width and height that was computed by CSS.
  let wrapperWidth = adjustaBarDivWrapper.clientWidth;
  let wrapperHeight = 450; //-50 for buttons!!

  return {svgObj, adjustaPieGWrapper, wrapperWidth, wrapperHeight};
}

function selectD3ElementsFromParentClass(parendDivID){
  const svgObj = d3.select(parendDivID)
  const adjustaPieGWrapper = d3.select('.adjustaPieGWrapper')

  const adjustaBarDivWrapper = document.getElementById("adjustaBar");
  // Extract the width and height that was computed by CSS.
  let wrapperWidth = adjustaBarDivWrapper.clientWidth;
  let wrapperHeight = 450; //-50 for buttons!!

  return {svgObj, adjustaPieGWrapper, wrapperWidth, wrapperHeight};
}

function setSVGDims(obj, w, h){
  obj.attrs({
    "width" : w,
    "height" : h
  });
}

function makeD3PieFuncs(wedgeVal, w){

  //.sort keeps the pie from showin 'blank' space
  // when re-organizing slices
  const d3PieFunc = d3.pie().sort(null).value(wedgeVal);
  const arcFunc = d3.arc()
    .innerRadius(0)
    .outerRadius( (w) * .7);

  return { d3PieFunc, arcFunc };
}

function mergeWithFirstEqualZero(first, second){

  var secondSet = d3.set();

  second.forEach(function(d) { 
    return secondSet.add(d.keyname)
  });

  var onlyFirst = first
    .filter(function(d){ return !secondSet.has(d.keyname) })
    .map(function(d) { return {keyname: d.keyname, popval: 0}; });

  var sortedMerge = d3.merge([ second, onlyFirst ])
    .sort(function(a, b) {
        return d3.ascending(a.keyname, b.keyname);
      });

  return sortedMerge;
}

function getPortionOfData(selectorVal) {
  let thisTownData = myData.filter(town => town.geo === selectorVal)
  let menVal = thisTownData[0]['BPMen'];
  let womenVal = thisTownData[0]['BPWomen']
  let totalVal = menVal + womenVal;
  console.log(`Men: ${parseInt(menVal / totalVal * 100)}, Wm: ${parseInt(womenVal / totalVal * 100)}`)

  let justMenAndWomen = [
    {
      keyname: 'Men',
      popval: menVal,
      percent: parseInt(menVal / totalVal * 100)
    },
    {
      keyname: 'Women',
      popval: womenVal,
      percent: parseInt(womenVal / totalVal * 100)
    }
  ];

  //SORT the selection by value
  var sortedData = justMenAndWomen.sort(function(a, b) {
      return d3.ascending(a.popval, b.popval);
    });

  return sortedData;
}

function getSlicePaths(parent, className, pieFn, data, k){
  return parent.select(className)
  .selectAll("path")
  .data(pieFn(data), k);
}

function clickBtnFn(){
  let clickedData = getPortionOfData(this.value);
  resizeAdjusaPie(clickedData)
}

function makeTextString(d){
  // console.log('makeTxt d')
  // console.log(d)
  return `${d.data.percent}% ${d.data.keyname}`
}

// Store the displayed angles in _current.
// Then, interpolate from _current to the new angles.
// During the transition, _current is updated in-place by d3.interpolate.
function arcTween(a) {
  var i = d3.interpolate(this._current, a);
  this._current = i(0);
  return function(t) {
    return arc(i(t));
  };
}

function resizeAdjusaPie(data) {

    // //4. SELECT d3 elements
    let {svgObj, adjustaPieGWrapper, wrapperWidth, wrapperHeight} = selectD3ElementsFromParentClass('.adjustaSVGWrapper');

    adjustaPieGWrapper
      .attr("transform", `translate(${(wrapperWidth - 150)},${50})`)

    data = (!data) ? getPortionOfData('Central Falls') : data;

    var duration = 1000;

  //pie slice & label group wrappers
  const groupDataJoin = adjustaPieGWrapper.selectAll('g')
    .data(pie(data), (d) => d.data.keyname)
    .attr('class', 'groupDataJoin');

  const groupEnterDataJoin = groupDataJoin.enter().append('g');
    groupEnterDataJoin.merge(groupDataJoin)

  groupDataJoin.exit().remove();


    // join
    var singleSliceDataJoin = groupDataJoin.select("path")

    // enter
    groupEnterDataJoin.append("path")
      .attrs({
        "class": "singleSlice",
        "fill": (d, i) => colorScale(i)
      })
      .merge(singleSliceDataJoin)
      .transition().duration(duration)
      .attrTween("d", arcTween)

};

function placeLabels(data,ind){
  if(ind === 1) return -150
  if(ind === 0) return 50
}



//1. Data array
var myData = [
  {
    "geo": "Central Falls",
    "White": 33.6,
    "WhiteAndHispanic": 33.6,
    "AfricanAmericans": 25.3,
    "AmericanIndianAndAlaskaNative": 17,
    "Asian": 10.2,
    "Other": 39.1,
    "2+Races": 32.3,
    "HispanicLatino": 36.3,
    "PercentBelow": 32.7,
    "BPMen": 3008,
    "BPWomen": 3188
  },
  {
    "geo": "Pawtucket",
    "White": 18.2,
    "WhiteAndHispanic": 18.2,
    "AfricanAmericans": 21.7,
    "AmericanIndianAndAlaskaNative": 5.8,
    "Asian": 15.4,
    "Other": 28.4,
    "2+Races": 20,
    "HispanicLatino": 32.4,
    "PercentBelow": 19.9,
    "BPMen": 6741,
    "BPWomen": 7366
  },
  {
    "geo": "Providence",
    "White": 25.4,
    "WhiteAndHispanic": 25.4,
    "AfricanAmericans": 28.9,
    "AmericanIndianAndAlaskaNative": 50.6,
    "Asian": 24.1,
    "Other": 32.6,
    "2+Races": 34.6,
    "HispanicLatino": 35.2,
    "PercentBelow": 28.2,
    "BPMen": 20682,
    "BPWomen": 25996
  },
  {
    "geo": "Woonsocket",
    "White": 24.1,
    "WhiteAndHispanic": 24.1,
    "AfricanAmericans": 40.3,
    "AmericanIndianAndAlaskaNative": 11.7,
    "Asian": 6.6,
    "Other": 57.7,
    "2+Races": 36.4,
    "HispanicLatino": 48.2,
    "PercentBelow": 25.1,
    "BPMen": 4841,
    "BPWomen": 5349
  },
  {
    "geo": "West Warwick",
    "White": 16.6,
    "WhiteAndHispanic": 16.6,
    "AfricanAmericans": 11.1,
    "AmericanIndianAndAlaskaNative": 0,
    "Asian": 11.5,
    "Other": 13.3,
    "2+Races": 20.1,
    "HispanicLatino": 30.6,
    "PercentBelow": 16.4,
    "BPMen": 2154,
    "BPWomen": 2536
  }
]

//4. SELECT d3 elements
let {svgObj, adjustaPieGWrapper, wrapperWidth, wrapperHeight} = makeD3ElementsFromParentDiv('.adjustaSVGWrapper');

//2. array of keys used in colorScale domain
//CAN/SHOULD be re-done
var keys = ["Men", "Women"];

//3. set arbirtary h/w/radius vals
var width = 100,
  height = 100,
  radius = Math.min(width, height) / 2;

//6. make pie fn
var pie = d3.pie()
  .sort(null)
  .value(function(d) {
    return d.popval;
  });

//7. make arc fn 
var arc = d3.arc()
  .outerRadius(radius * 1.0)
  .innerRadius(25);

//8. make pie-slice-name value
var pieSliceKeyName = d => d.data.keyname;

//9. make colorScale
var colorScale = d3.scaleOrdinal(d3.schemePastel2).domain(keys);

//10. UPDATE the chart with the 'firstHalf' of the data
//this is now in the resize serializer
setTimeout(() => resizeAdjusaPie(), 1100 );

// //11. make onClick for radio buttons
// d3.selectAll("input[name='dataset']").on("change", clickBtnFn);

d3.select(window).on("resize", serializer( resizeCharts, selectAndUpdatePies, resizePolarArea, resizeAdjustaBar, resizeAdjusaPie ));