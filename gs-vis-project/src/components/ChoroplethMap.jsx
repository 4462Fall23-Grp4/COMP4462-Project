/**
 * Reference: https://github.com/ninjaconcept/d3-force-directed-graph/blob/master/example/3-user-interaction.html
 */
import * as d3 from 'd3'
// import { geoRobinson } from 'd3'
// import * as d3 from "d3"
import nodes from '../data/unique_ust_coauthor.json'
import links from '../data/ust_coauthor_link.json'
import { useEffect, useRef, useState } from "react"
import { getRankColor } from "../utils"
import { Col, Row } from "react-bootstrap"
import * as topojson from "topojson-client";
import * as legendd3 from "d3-color-legend"
import legendpng from '../assets/legendChoropleth.png';

// eslint-disable-next-line react/prop-types
export default function ChoroplethMap({ selectedProfId, setSelectedProfId }) {
    const svgRef = useRef(null)
    useEffect(() => {
        const width = 450,
            height = 300;
        const svg = d3.select("#viz_container")
            .append("svg")
            .attr("width", "780")
            .attr("height", "100%")
            .attr("viewBox", "0 0  450 300")
            .attr("preserveAspectRatio", "xMinYMin");

        // set map scale, location on screen and its projection
        const projection = d3.geoMercator()
        .scale(width / 2.5 / Math.PI)
        .rotate([0, 0])
        .center([ 0, 0]) 
        // .center([114.109497, 22.396427])
        .translate([width/2, height/2*1.3]);


        // path generator
        const path = d3.geoPath()
            .projection(projection);

        // set color scale
        const color = d3.scaleThreshold()
            .domain([10, 50, 100, 150])
            .range(["#DCE9FF", "#8EBEFF", "#589BE5", "#0072BC"])
            .unknown("#E6E6E6");

        //declare polygon and polyline
        const poly = svg.append("g");
        const line = svg.append("g");

        // declare URL
        const dataURL = "https://raw.githubusercontent.com/GDS-ODSSS/unhcr-dataviz-platform/master/data/geospatial/choropleth_map.csv";
        const polygonsURL = "https://raw.githubusercontent.com/GDS-ODSSS/unhcr-dataviz-platform/master/data/geospatial/world_polygons_simplified.json";
        const polylinesURL = "https://raw.githubusercontent.com/GDS-ODSSS/unhcr-dataviz-platform/master/data/geospatial/world_lines_simplified.json";

        // load data
        const promises = [
            d3.json(polygonsURL),
            d3.csv(dataURL)
        ];

        Promise.all(promises).then(ready)
        function ready([topology, population]) {

            // prepare pop data to join shapefile
            const data = {};
            population.forEach(function (d) {
                data[d.iso3] = +d.refugees
            });

            console.log(data)

            const tempdata = { 'GBR': 26, 'SGP': 29, 'CHN': 460, 'USA': 334, 'FRA': 5, 'CAN': 32, 'DEU': 12, 'TUR': 2, 'CHE': 8, 'TWN': 8, 'KOR': 16, 'AUS': 29, 'JPN': 5, 'FIN': 4, 'NLD': 5, 'BEL': 3, 'ISR': 5, 'ARE': 1, 'NZL': 2, 'NOR': 4, 'AUT': 6, 'DNK': 6, 'IRN': 5, 'ITA': 8, 'POL': 2, 'CYP': 1, 'GRC': 12, 'EGY': 1, 'IRL': 1, 'IND': 3, 'BRA': 2 }


            const mouseover = function (d) {
                d3.selectAll(".countries")
                    .transition()
                    .duration(100)
                    .style("opacity", .3)
                d3.select(this)
                    .transition()
                    .duration(100)
                    .style("opacity", 1)
            };
            const mouseleave = function (d) {
                d3.selectAll(".countries")
                    .transition()
                    .duration(100)
                    .style("opacity", 1)
                d3.select(this)
                    .transition()
                    .duration(100)
                    .style("opacity", 1)
            };

            // load and draw polygons
            poly
                .selectAll("path")
                .data(topojson.feature(topology, topology.objects.world_polygons_simplified).features)
                .join("path")
                .attr("fill", function (d) { return color(d.refugees = tempdata[d.properties.color_code]) })
                .attr("d", path)
                .attr("class", function (d) { return "countries" })
                .on("mouseover", mouseover)
                .on("mouseleave", mouseleave)
                .append("title")
                .text(function (d) {
                    return `${d.properties.gis_name} \nNo. of Coauthors: ${d3.format(",")(d.refugees)}`
                }
                )
        };

        //load and draw lines
        d3.json(polylinesURL).then(function (topology) {
            line
                .selectAll("path")
                .data(topojson.feature(topology, topology.objects.world_lines_simplified).features)
                .enter()
                .append("path")
                .attr("d", path)
                .style("fill", "none")
                .attr("class", function (d) { return d.properties.type; })
        });

        //zoom function
        const zoom = true
        if (zoom) {
            var zoomFunction = d3.zoom()
                .scaleExtent([1, 8])
                .on('zoom', function (event) {
                    poly.selectAll('path')
                        .attr('transform', event.transform);
                    line.selectAll('path')
                        .attr('transform', event.transform);
                });
            svg.call(zoomFunction);
        };

        // set legend
        svg.append("g")
            .attr("class", "legendThreshold")
            .attr("transform", "translate(5,255)");

        // const legend = d3.legendColor()
        //     .labelFormat(d3.format(",.0f"))
        //     .labels(d3.legendHelpers.thresholdLabels)
        //     .labelOffset(3)
        //     .shapePadding(0)
        //     .scale(color);

        // svg.select(".legendThreshold")
        //     .call(legend);

        // set note
        
    }, [])
    return (
        <div>
            <Row>
                <Col>
                    <p style={{ textAlign: "justify"}}>
                       
                        HKUST CSE researchers often collaborate with other researchers outside of the department and 
                        the instituition. Here is a choropleth map that shows the number of coauthorship with external
                         instuition in different countries and regions. Feel free to zoom in, and hover on the regions 
                        to view the respective collaboration.


                    </p>

                    
                </Col>
                <Col>
                <div  >
                        <div className="" id="viz_container" ref={svgRef} ></div>
                        {/* <div id="viz_container"></div> */}
                        <img style={{height: "100px"}} src={legendpng}></img>
                            
                        
                    </div>
                </Col>
                
            </Row>
        </div>
    )
}