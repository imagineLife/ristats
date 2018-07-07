function makepieAreaElementsFromParentDiv(parendDivID){
	const thisChartDiv = document.getElementById(parendDivID); 	      
	const polarSVGObj = d3.select(thisChartDiv).append("svg").attr('class', 'polarAreaSVG');
	const polarPieG = polarSVGObj.append('g')
		.attr('class','PolarAreaGWrapper')
		.style('max-height','900px');

	return {thisChartDiv, polarSVGObj, polarPieG};
}

function getPolarAreaDims(parentDiv, marginObj){

	// Extract the DIV width and height that was computed by CSS.
	let cssDivWidth = parentDiv.clientWidth;
	let cssDivHeight = parentDiv.clientHeight;

	//get css-computed dimensions
	const thisDivWidthLessMargins =cssDivWidth - marginObj.left - marginObj.right;
	const thisDivHeightLessMargins = cssDivHeight - marginObj.top - marginObj.bottom;
	
	return { cssDivWidth, cssDivHeight, thisDivWidthLessMargins, thisDivHeightLessMargins };
}

function makePolarAreaFuncs(wedgeVal, w){
	let d3PieFunc = d3.pie().value(wedgeVal);
	let d3ArcFn = d3.arc()
		.innerRadius(0).outerRadius((d) => {
			return radiusScale(d.data[radiusColumn]);
		})

	return { d3PieFunc, d3ArcFn };
}

function setPolarAreaSVGDims(obj, w, h){
	obj.attrs({
		"width" : w,
		"height" : h
	});
}

//calcluate largest radiusScale based on parent dimensions & written largest val
function getLargestRadius(w,h, largestVal){
	let smallerHorW = (w < h) ? w : h;
	let largestRadiusCalculation = Math.floor( ( smallerHorW / 2) );
	if(largestRadiusCalculation < 175) largestRadiusCalculation = 165;

	return (largestRadiusCalculation < largestVal)? largestRadiusCalculation : largestVal; 
}

let dataObject = [
  {
    "race": "White & Hispanic",
    "howMany": 92245
  },
  {
    "race": "African Americans",
    "howMany": 16474
  },
  {
    "race": "American Indian or Alaskan Native",
    "howMany": 1998
  },
  {
    "race": "Asian",
    "howMany": 4334
  },
  {
    "race": "Other Ethnicity",
    "howMany": 18152
  },
  {
    "race": "Two-Plus Races",
    "howMany": 6939
  },
  {
    "race": "Hispanic & Latino",
    "howMany": 44864
  },
  {
    "race": "White",
    "howMany": 70504
  }
];

let thisChartObj = {
	parentDiv: 'polarArea',
	jsonData: dataObject
}

const thisColorVal = d => d.race;
const thisMargin = { 
	left: 20, 
	right: 20,
	top: 40,
	bottom: 40
};
const radiusColumn = 'howMany';
var radiusScale = d3.scaleSqrt();

function buildPolarAreaChart(obj){

	let colorScale = d3.scaleOrdinal().range(d3.schemeCategory10);
	
	let jsonData = obj.jsonData;

	const {thisChartDiv, polarSVGObj, polarPieG} = makepieAreaElementsFromParentDiv(obj.parentDiv);

	let { cssDivWidth, cssDivHeight, thisDivWidthLessMargins, thisDivHeightLessMargins } = getPolarAreaDims(thisChartDiv, thisMargin);

	//pie & arc functions
	const { d3PieFunc, d3ArcFn } = makePolarAreaFuncs(radiusColumn, thisDivWidthLessMargins)

	let largestRadius = getLargestRadius(thisDivWidthLessMargins, thisDivHeightLessMargins, 700);

	polarPieG.attrs({
			"transform": `translate(${Math.floor(thisDivWidthLessMargins / 1.75)},${Math.floor(thisDivHeightLessMargins / 2)})`,
			'class':'PolarAreaGWrapper'
		})
		.style('max-height','900px');

	//set svg height & width from div computed dimensions
	setPolarAreaSVGDims(polarSVGObj, cssDivWidth, thisDivHeightLessMargins);

	colorScale.domain(jsonData.map(thisColorVal));
	
	radiusScale
		.domain([0, d3.max(jsonData, (d) => { return d[radiusColumn]; })])
		.range([0,largestRadius]);
	
	d3PieFunc.value(1);
	const arcs = d3PieFunc(jsonData);
	
	// d3ArcFn.innerRadius(0).outerRadius((d) => { 
	// 	return radiusScale(d.data[radiusColumn]);
	// });

	var slices = polarPieG.selectAll("path")
		.remove()
		.exit()
		.data(arcs);

	slices.enter()
		.append("path")
		.attrs({
			"d": d3ArcFn,
			"fill": (d) => colorScale(thisColorVal(d.data))
		})
}

//2. Build fn
function resizePolarArea(){


	let { cssDivWidth, cssDivHeight, thisDivWidthLessMargins, thisDivHeightLessMargins } = getPolarAreaDims(document.getElementById('polarArea'), thisMargin)

	//calcluate largest radiusScale
	let largestRadius = getLargestRadius(thisDivWidthLessMargins, thisDivHeightLessMargins, 400);

	radiusScale.range([0,  largestRadius])
	
	let polarSVGObj = d3.select('.polarAreaSVG'), 
		polarPieG = d3.select('.PolarAreaGWrapper');

	//set svg dimension based on resizing attrs
	setPolarAreaSVGDims(polarSVGObj, cssDivWidth, thisDivHeightLessMargins);
	const { d3PieFunc, d3ArcFn } = makePolarAreaFuncs(radiusColumn, thisDivWidthLessMargins)

    polarPieG.attr('transform', `translate(${Math.floor(thisDivWidthLessMargins/ 1.75)}, ${Math.floor(thisDivHeightLessMargins/2) })`);
    polarPieG.selectAll('path').attr('d', d3ArcFn)

}

setTimeout(() => buildPolarAreaChart(thisChartObj), 100);
d3.select(window).on('resize',resizePolarArea);
