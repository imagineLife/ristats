# Rhode Island Income & Poverty Statistics

## D3
here's a few of the D3 features used in this project:
</br>
**Mapping**
- [d3.geo](https://github.com/d3/d3-geo): making geographical paths from a GeoJSON object 
- [d3.geoAlersUsa](https://github.com/d3/d3-geo#geoAlbersUsa): a USA-centric map projection

**With Bar & Pie Visualisations**
- [d3.scaleSequential](https://github.com/d3/d3-scale#scaleSequential): a method for creating a sequential scale
- [d3.scaleChromatic](https://github.com/d3/d3-scale-chromatic#d3-scale-chromatic): this makes great pre-configured color schemes! VERY COOL
- [d3.inerpolate](https://github.com/d3/d3-interpolate#d3-interpolate): module that blends between two values (in this case, colors). Here I used D3's 'interpolateReds' & 'interpolateBlues', which range from white-ish to black-ish ranges of the given name
- [d3.axis](https://github.com/d3/d3-axis#d3-axis): helps draw x & y axis
- [d3.scaleLinear](https://github.com/d3/d3-scale#scaleLinear): a method for creating a continuous scale of values (like 1-2-3-4-5)

**Other**
- [d3.json & d3.csv](https://github.com/d3/d3-request/blob/master/README.md#d3-request): Request modules, reading in data from json & csv files
- [d3.select & selecAll](https://github.com/d3/d3-selection#d3-selection): selecting the dom

