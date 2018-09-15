# Rhode Island Income & Poverty Statistics
##[View The Live Site Here!](https://imaginelife.github.io/ristats/)

## D3
here's a few of the D3 features used in this project:
</br>
**Mapping**
- [d3.geo](https://github.com/d3/d3-geo): making geographical paths from a GeoJSON object 
- [d3.geoAlersUsa](https://github.com/d3/d3-geo#geoAlbersUsa): a USA-centric map projection

**Some D3 Methods in use**
###Scales
- [d3.scaleSequential](https://github.com/d3/d3-scale#scaleSequential): a method for creating a sequential scale
- [d3.scaleChromatic](https://github.com/d3/d3-scale-chromatic#d3-scale-chromatic): this makes great pre-configured color schemes! VERY COOL
- [d3.scaleLinear](https://github.com/d3/d3-scale#scaleLinear): a method for creating a continuous scale of values (like 1-2-3-4-5)
- [d3.scaleBand](https://github.com/d3/d3-scale#band-scales): I'm using this to build the 'xScale' of a bar chart

###Data Fetching
- [d3.json & d3.csv](https://github.com/d3/d3-request/blob/master/README.md#d3-request): Request modules, reading in data from json & csv files
- [d3.select & selecAll](https://github.com/d3/d3-selection#d3-selection): selecting the dom

###More
- [d3.inerpolate](https://github.com/d3/d3-interpolate#d3-interpolate): module that blends between two values (in this case, colors). Here I use this for dealing with color variation & some pie transitioning
- [d3.axis](https://github.com/d3/d3-axis#d3-axis): helps draw x & y axis
- [d3.event](https://github.com/d3/d3-selection#event): I'm using this to grab x&y values for mouse-over tooltip generation
- [d3.transition](https://github.com/d3/d3-transition#transition): D3 has a wonderfully 'simple' transition api. I'm using this to animate some bars and a pie
- [d3.enter](https://github.com/d3/d3-selection#selection_enter) & [d3.exit](https://github.com/d3/d3-selection#selection_exit): I'm using these in combination with d3.transition (noted above) for managing dom elements during transitions

