import React, { useState } from 'react';

const ConnectedMap = () => {
  
    const hardcodejson =
    {
        "author": [
            {
                "type": "LineString",
                "coordinates": [
                    [
                        114.109497,
                        22.396427
                    ],
                    [
                        114.109497,
                        22.396427
                    ]
                ]
            },
            {
                "type": "LineString",
                "coordinates": [
                    [
                        114.109497,
                        22.396427
                    ],
                    [
                        -3.435973,
                        55.378052
                    ]
                ]
            },
            {
                "type": "LineString",
                "coordinates": [
                    [
                        114.109497,
                        22.396427
                    ],
                    [
                        103.819839,
                        1.352083
                    ]
                ]
            },
            {
                "type": "LineString",
                "coordinates": [
                    [
                        114.109497,
                        22.396427
                    ],
                    [
                        35.86166,
                        35.86166
                    ]
                ]
            },
            {
                "type": "LineString",
                "coordinates": [
                    [
                        114.109497,
                        22.396427
                    ],
                    [
                        -95.712891,
                        37.09024
                    ]
                ]
            },
            {
                "type": "LineString",
                "coordinates": [
                    [
                        114.109497,
                        22.396427
                    ],
                    [
                        35.86166,
                        35.86166
                    ]
                ]
            },
            {
                "type": "LineString",
                "coordinates": [
                    [
                        114.109497,
                        22.396427
                    ],
                    [
                        114.109497,
                        22.396427
                    ]
                ]
            },
            {
                "type": "LineString",
                "coordinates": [
                    [
                        114.109497,
                        22.396427
                    ],
                    [
                        2.213749,
                        46.227638
                    ]
                ]
            }
        ]
    }

    // The svg
    const svg = d3.select("svg"),
        width = +svg.attr("width"),
        height = +svg.attr("height");
    const g = {
        map: svg.select("g#map"),

        bubble: svg.select("g#bubble"),
        links: svg.select("g#links"),
        tags: svg.select("g#tag"),

    };
    // Map and projection
    // const projection = d3.geoMercator()
    //     .scale(85)
    //     .translate([width/2, height/2*1.3])

    var projection = d3
        .geoMercator()
        .scale(width / 2.5 / Math.PI)
        .rotate([0, 0])
        // .center([ 0, 0]) 
        .center([114.109497, 22.396427])
        .translate([width / 2, height / 2]);

    // hk
    const hkLatLong = {
        Lat: 22.396427,
        Long: 114.109497
    }

    console.log("data", hardcodejson.author)

    // Create data: coordinates of start and end
    const link = [
        { type: "LineString", coordinates: [[hkLatLong.Long, hkLatLong.Lat], [-60, -30]] },
        { type: "LineString", coordinates: [[10, -20.123], [-60, -30]] },
        { type: "LineString", coordinates: [[10, -20], [130, -30]] },
        {
            type: "LineString",
            coordinates: [
                [
                    114.109497,
                    22.396427
                ],
                [
                    2.213749,
                    46.227638
                ]
            ]
        }
    ]

    const regions = [{ 'long': 114.109497, 'lat': 22.396427, 'group': 'A', 'size': 2 }, { 'long': -3.435973, 'lat': 55.378052, 'group': 'A', 'size': 1 }, { 'long': 103.819839, 'lat': 1.352083, 'group': 'A', 'size': 1 }, { 'long': 35.86166, 'lat': 35.86166, 'group': 'A', 'size': 2 }, { 'long': -95.712891, 'lat': 37.09024, 'group': 'A', 'size': 1 }, { 'long': 35.86166, 'lat': 35.86166, 'group': 'A', 'size': 1 }, { 'long': 114.109497, 'lat': 22.396427, 'group': 'A', 'size': 1 }, { 'long': 2.213749, 'lat': 46.227638, 'group': 'A', 'size': 1 }]

    const size = d3.scaleLinear()
        .domain([1, 20])  // What's in the data
        .range([4, 50])  // Size in pixel

    // A path generator
    const path = d3.geoPath()
        .projection(projection)

    const Tooltip = g.bubble.select("my_dataviz")
        .append("div")
        .attr("class", "tooltip")
        .style("opacity", 1)
        .style("background-color", "white")
        .style("border", "solid")
        .style("border-width", "2px")
        .style("border-radius", "5px")
        .style("padding", "5px")

    const mouseover = function (event, d) {
        Tooltip.style("opacity", 1)
        console.log("hovered")
    }
    var mousemove = function (event, d) {
        console.log("mousemove")
        Tooltip
        // .html(d.size + "<br>" + "long: " + d.long + "<br>" + "lat: " + d.lat)
            .html("<div>hi</div> " )
            .style("left", (event.x) / 2 + "px")
            .style("top", (event.y) / 2 - 30 + "px")
    }
    var mouseleave = function (event, d) {
        Tooltip.style("opacity", 0)
    }

    // Load world shape
    d3.json("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson").then(function (data) {

        // Draw the map
        g.map.append("g")
            .selectAll("path")
            .data(data.features)
            .join("path")
            .attr("fill", "#b8b8b8")
            .attr("d", path)
            .style("stroke", "#fff")
            .style("stroke-width", 0)

        g.bubble
            .selectAll("myCircles")
            .data(regions)
            .join("circle")
            .attr("cx", d => projection([d.long, d.lat])[0])
            .attr("cy", d => projection([d.long, d.lat])[1])
            .attr("r", d => size(d.size))
            .style("fill", "#87B8EA")
            .attr("stroke", "#87B8EA")
            .attr("stroke-width", 3)
            .attr("fill-opacity", 1)
            .on("mouseover", mouseover)
            .on("mousemove", mousemove)
            .on("mouseleave", mouseleave)


        // Add the path
        g.links.selectAll("myPath")
            .data(hardcodejson.author)
            // .data(link)
            .join("path")
            .attr("d", function (d) { return path(d) })
            .style("fill", "none")
            .style("stroke", "orange")
            .style("stroke-width", 1)
            
    })
  return (
    <div>
      <svg id="my_dataviz" width="440" height="300">
    <g id="map"></g>
    <g id="bubble"></g>
     <g id="links"></g> 
    <g id="tags"></g>
</svg>
    </div>
  );
};

export default ConnectedMap;