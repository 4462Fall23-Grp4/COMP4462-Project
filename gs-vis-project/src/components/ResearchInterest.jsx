import * as d3 from "d3"
import chordData from '../data/author_interest.json'
import profID from '../data/ust_prof_id.json'
import { useEffect, useRef, } from "react"
import { Col, Row } from "react-bootstrap"

export default function ResearchInterest({ selectedProfId, setSelectedProfId }) {
    const svgRef = useRef(null)
    useEffect(() => {
        const customChordLayout = function () {
            var ε = 1e-6, ε2 = ε * ε, π = Math.PI, τ = 2 * π, τε = τ - ε, halfπ = π / 2, d3_radians = π / 180, d3_degrees = 180 / π;
            var chord = {}, chords, groups, matrix, n, padding = 0, sortGroups, sortSubgroups, sortChords;
            function relayout() {
                var subgroups = {}, groupSums = [], groupIndex = d3.range(n), subgroupIndex = [], k, x, x0, i, j;
                chords = [];
                groups = [];
                k = 0, i = -1;
                while (++i < n) {
                    x = 0, j = -1;
                    while (++j < n) {
                        x += matrix[i][j];
                    }
                    groupSums.push(x);
                    subgroupIndex.push(d3.range(n).reverse());
                    k += x;
                }
                if (sortGroups) {
                    groupIndex.sort(function (a, b) {
                        return sortGroups(groupSums[a], groupSums[b]);
                    });
                }
                if (sortSubgroups) {
                    subgroupIndex.forEach(function (d, i) {
                        d.sort(function (a, b) {
                            return sortSubgroups(matrix[i][a], matrix[i][b]);
                        });
                    });
                }
                k = (τ - padding * n) / k;
                x = 0, i = -1;
                while (++i < n) {
                    x0 = x, j = -1;
                    while (++j < n) {
                        var di = groupIndex[i], dj = subgroupIndex[di][j], v = matrix[di][dj], a0 = x, a1 = x += v * k;
                        subgroups[di + "-" + dj] = {
                            index: di,
                            subindex: dj,
                            startAngle: a0,
                            endAngle: a1,
                            value: v
                        };
                    }
                    groups[di] = {
                        index: di,
                        startAngle: x0,
                        endAngle: x,
                        value: (x - x0) / k
                    };
                    x += padding;
                }
                i = -1;
                while (++i < n) {
                    j = i - 1;
                    while (++j < n) {
                        var source = subgroups[i + "-" + j], target = subgroups[j + "-" + i];
                        if (source.value || target.value) {
                            chords.push(source.value < target.value ? {
                                source: target,
                                target: source
                            } : {
                                source: source,
                                target: target
                            });
                        }
                    }
                }
                if (sortChords) resort();
            }
            function resort() {
                chords.sort(function (a, b) {
                    return sortChords((a.source.value + a.target.value) / 2, (b.source.value + b.target.value) / 2);
                });
            }
            chord.matrix = function (x) {
                if (!arguments.length) return matrix;
                n = (matrix = x) && matrix.length;
                chords = groups = null;
                return chord;
            };
            chord.padding = function (x) {
                if (!arguments.length) return padding;
                padding = x;
                chords = groups = null;
                return chord;
            };
            chord.sortGroups = function (x) {
                if (!arguments.length) return sortGroups;
                sortGroups = x;
                chords = groups = null;
                return chord;
            };
            chord.sortSubgroups = function (x) {
                if (!arguments.length) return sortSubgroups;
                sortSubgroups = x;
                chords = null;
                return chord;
            };
            chord.sortChords = function (x) {
                if (!arguments.length) return sortChords;
                sortChords = x;
                if (chords) resort();
                return chord;
            };
            chord.chords = function () {
                if (!chords) relayout();
                return chords;
            };
            chord.groups = function () {
                if (!groups) relayout();
                return groups;
            };
            return chord;
        };
        const stretchedChord = function () {
            var source = d3_source,
                target = d3_target,
                radius = d3_svg_chordRadius,
                startAngle = d3_svg_arcStartAngle,
                endAngle = d3_svg_arcEndAngle,
                pullOutSize = 0;

            var π = Math.PI,
                halfπ = π / 2;

            function subgroup(self, f, d, i) {
                var subgroup = f.call(self, d, i),
                    r = radius.call(self, subgroup, i),
                    a0 = startAngle.call(self, subgroup, i) - halfπ,
                    a1 = endAngle.call(self, subgroup, i) - halfπ;
                return {
                    r: r,
                    a0: [a0],
                    a1: [a1],
                    p0: [r * Math.cos(a0), r * Math.sin(a0)],
                    p1: [r * Math.cos(a1), r * Math.sin(a1)]
                };
            }

            function arc(r, p, a) {
                var sign = (p[0] >= 0 ? 1 : -1);
                return "A" + r + "," + r + " 0 " + +(a > π) + ",1 " + (p[0] + sign * pullOutSize) + "," + p[1];
            }


            function curve(p1) {
                var sign = (p1[0] >= 0 ? 1 : -1);
                return "Q 0,0 " + (p1[0] + sign * pullOutSize) + "," + p1[1];
            }

            /*
            M = moveto
            M x,y
            Q = quadratic Bézier curve
            Q control-point-x,control-point-y end-point-x, end-point-y
            A = elliptical Arc
            A rx, ry x-axis-rotation large-arc-flag, sweep-flag  end-point-x, end-point-y
            Z = closepath
          
            M251.5579641956022,87.98204731514328
            A266.5,266.5 0 0,1 244.49937503334525,106.02973926358392
            Q 0,0 -177.8355222451483,198.48621369706098
            A266.5,266.5 0 0,1 -191.78901944612068,185.0384338992728
            Q 0,0 251.5579641956022,87.98204731514328
            Z
            */
            function chord(d, i) {
                var s = subgroup(this, source, d, i),
                    t = subgroup(this, target, d, i);

                return "M" + (s.p0[0] + pullOutSize) + "," + s.p0[1] +
                    arc(s.r, s.p1, s.a1 - s.a0) +
                    curve(t.p0) +
                    arc(t.r, t.p1, t.a1 - t.a0) +
                    curve(s.p0) +
                    "Z";
            }//chord

            chord.radius = function (v) {
                if (!arguments.length) return radius;
                radius = d3_functor(v);
                return chord;
            };
            chord.pullOutSize = function (v) {
                if (!arguments.length) return pullOutSize;
                pullOutSize = v;
                return chord;
            };
            chord.source = function (v) {
                if (!arguments.length) return source;
                source = d3_functor(v);
                return chord;
            };
            chord.target = function (v) {
                if (!arguments.length) return target;
                target = d3_functor(v);
                return chord;
            };
            chord.startAngle = function (v) {
                if (!arguments.length) return startAngle;
                startAngle = d3_functor(v);
                return chord;
            };
            chord.endAngle = function (v) {
                if (!arguments.length) return endAngle;
                endAngle = d3_functor(v);
                return chord;
            };


            function d3_svg_chordRadius(d) {
                return d.radius;
            }

            function d3_source(d) {
                return d.source;
            }

            function d3_target(d) {
                return d.target;
            }

            function d3_svg_arcStartAngle(d) {
                return d.startAngle;
            }

            function d3_svg_arcEndAngle(d) {
                return d.endAngle;
            }

            function d3_functor(v) {
                return typeof v === "function" ? v : function () {
                    return v;
                };
            }

            return chord;

        }//stretchedChord

        const container = d3.select(svgRef.current)

        container.selectAll("*").remove();

        const screenWidth = 800,
            mobileScreen = (screenWidth > 500 ? false : true);

        const margin = { left: 40, top: 10, right: 0, bottom: 10 },
            width = Math.min(screenWidth, 1000) - margin.left - margin.right,
            height = (mobileScreen ? 300 : Math.min(screenWidth, 800) * 7 / 8) - margin.top - margin.bottom;


        const svg = container
            .append("svg")
            .attr("width", (width + margin.left + margin.right))
            .attr("height", (height + margin.top + margin.bottom))

        var wrapper = svg.append("g").attr("class", "chordWrapper")
            .attr("transform", "translate(" + (width / 2 + margin.left) + "," + (height / 2 + margin.top) + ")");

        var outerRadius = Math.min(width, height) / 2 - (mobileScreen ? 80 : 100) + 0,
            innerRadius = outerRadius * 0.95,
            opacityDefault = 0.9, //default opacity of chords
            opacityLow = 0.02; //hover opacity of those chords not hovered over

        //How many pixels should the two halves be pulled apart
        var pullOutSize = (mobileScreen ? 20 : 0)

        //////////////////////////////////////////////////////
        //////////////////// Titles on top ///////////////////
        //////////////////////////////////////////////////////

        var titleWrapper = svg.append("g").attr("class", "chordTitleWrapper"),
            titleOffset = mobileScreen ? 15 : 40,
            titleSeparate = mobileScreen ? 30 : 0;

        //Title	top left
        titleWrapper.append("text")
            .attr("class", "title left")
            .style("font-size", mobileScreen ? "12px" : "16px")
            .attr("x", (width / 2 + margin.left - outerRadius - titleSeparate))
            .attr("y", titleOffset)
            .text("Interest");
        titleWrapper.append("line")
            .attr("class", "titleLine left")
            .attr("x1", (width / 2 + margin.left - outerRadius - titleSeparate) * 0.6)
            .attr("x2", (width / 2 + margin.left - outerRadius - titleSeparate) * 1.4)
            .attr("y1", titleOffset + 8)
            .attr("y2", titleOffset + 8);
        //Title top right
        titleWrapper.append("text")
            .attr("class", "title right")
            .style("font-size", mobileScreen ? "12px" : "16px")
            .attr("x", (width / 2 + margin.left + outerRadius + titleSeparate))
            .attr("y", titleOffset)
            .text("Professor");

        titleWrapper.append("line")
            .attr("class", "titleLine right")
            .attr("x1", (width / 2 + margin.left - outerRadius - titleSeparate) * 0.6 + 2 * (outerRadius + titleSeparate))
            .attr("x2", (width / 2 + margin.left - outerRadius - titleSeparate) * 1.4 + 2 * (outerRadius + titleSeparate))
            .attr("y1", titleOffset + 8)
            .attr("y2", titleOffset + 8);

        ////////////////////////////////////////////////////////////
        /////////////////// Animated gradient //////////////////////
        ////////////////////////////////////////////////////////////

        var defs = wrapper.append("defs");
        var linearGradient = defs.append("linearGradient")
            .attr("id", "animatedGradient")
            .attr("x1", "0%")
            .attr("y1", "0%")
            .attr("x2", "100%")
            .attr("y2", "0")
            .attr("spreadMethod", "reflect");

        linearGradient.append("animate")
            .attr("attributeName", "x1")
            .attr("values", "0%;100%")
            // .attr("from","0%")
            // .attr("to","100%")
            .attr("dur", "7s")
            .attr("repeatCount", "indefinite");

        linearGradient.append("animate")
            .attr("attributeName", "x2")
            .attr("values", "100%;200%")
            // .attr("from","100%")
            // .attr("to","200%")
            .attr("dur", "7s")
            .attr("repeatCount", "indefinite");

        linearGradient.append("stop")
            .attr("offset", "5%")
            .attr("stop-color", "#E8E8E8");
        linearGradient.append("stop")
            .attr("offset", "45%")
            .attr("stop-color", "#A3A3A3");
        linearGradient.append("stop")
            .attr("offset", "55%")
            .attr("stop-color", "#A3A3A3");
        linearGradient.append("stop")
            .attr("offset", "95%")
            .attr("stop-color", "#E8E8E8");

        var Names = chordData["Names"]
        var respondents = 68, //Total number of respondents (i.e. the number that makes up the total group)
            emptyPerc = 0.5, //What % of the circle should become empty
            emptyStroke = Math.round(respondents * emptyPerc);

        var matrix = chordData["matrix"]
        //Calculate how far the Chord Diagram needs to be rotated clockwise to make the dummy
        //invisible chord center vertically`
        var offset = (2 * Math.PI) * (emptyStroke / (respondents + emptyStroke)) / 4;

        //Custom sort function of the chords to keep them in the original order
        var chord = customChordLayout() //d3.layout.chord()
            .padding(.02)
            .sortChords(d3.descending) //which chord should be shown on top when chords cross. Now the biggest chord is at the bottom
            .matrix(matrix);

        var arc = d3.arc()
            .innerRadius(innerRadius)
            .outerRadius(outerRadius)
            .startAngle(startAngle) //startAngle and endAngle now include the offset in degrees
            .endAngle(endAngle);

        var path = stretchedChord() //Call the stretched chord function 
            .radius(innerRadius)
            .startAngle(startAngle)
            .endAngle(endAngle)
            .pullOutSize(pullOutSize);

        ////////////////////////////////////////////////////////////
        //////////////////// Draw outer Arcs ///////////////////////
        ////////////////////////////////////////////////////////////

        var g = wrapper.selectAll("g.group")
            .data(chord.groups)
            .enter().append("g")
            .attr("class", "group")
            .on("click", clickGroup)
        // .on("mouseover", fade(opacityLow))
        // .on("mouseout", fade(opacityDefault));

        g.append("path")
            .style("stroke", function (d, i) {
                if (Names[i] === "") {
                    return "none"
                } else {
                    return getColor(Names[i])
                }
                // return (Names[i] === "" ? "none" : "#00A1DE"); 
            })
            .style("fill", function (d, i) {
                if (Names[i] === "") {
                    return "none"
                } else {
                    return getColor(Names[i])
                }
                // return (Names[i] === "" ? "none" : "#00A1DE"); 
            })
            .style("pointer-events", function (d, i) { return (Names[i] === "" ? "none" : "auto"); })
            .attr("d", arc)
            .attr("transform", function (d, i) { //Pull the two slices apart
                d.pullOutSize = pullOutSize * (d.startAngle + 0.001 > Math.PI ? -1 : 1);
                return "translate(" + d.pullOutSize + ',' + 0 + ")";
            });

        ////////////////////////////////////////////////////////////
        ////////////////////// Append Names ////////////////////////
        ////////////////////////////////////////////////////////////

        //The text also needs to be displaced in the horizontal directions
        //And also rotated with the offset in the clockwise direction
        g.append("text")
            .each(function (d) { d.angle = ((d.startAngle + d.endAngle) / 2) + offset; })
            .attr("dy", ".35em")
            .attr("class", "titles")
            .style("font-size", mobileScreen ? "8px" : "10px")
            .attr("text-anchor", function (d) { return d.angle > Math.PI ? "end" : null; })
            .attr("transform", function (d, i) {
                var c = arc.centroid(d);
                return "translate(" + (c[0] + d.pullOutSize) + "," + c[1] + ")"
                    + "rotate(" + (d.angle * 180 / Math.PI - 90) + ")"
                    + "translate(" + 20 + ",0)"
                    + (d.angle > Math.PI ? "rotate(180)" : "")
            })
            .text(function (d, i) { return Names[i]; })
            .call(wrapChord, 200);

        ////////////////////////////////////////////////////////////
        //////////////////// Draw inner chords /////////////////////
        ////////////////////////////////////////////////////////////

        wrapper.selectAll("path.chord")
            .data(chord.chords)
            .enter().append("path")
            .attr("class", "chord")
            .style("stroke", "none")
            // .style("fill", "url(#animatedGradient)") //An SVG Gradient to give the impression of a flow from left to right
            .style("fill", function (d, i) {
                if (selectedProfId === "") {
                    return getColor(Names[d.target.index]);
                } else {

                    var chosen = profID.findIndex(findI);
                    return getColor(Names[d.target.index]);
                    // if (d.source.index == chosen){
                    //     return getColor(Names[d.target.index]);
                    // }else{
                    //     return "#E5E5E5"
                    // }
                }
            }) //An SVG Gradient to give the impression of a flow from left to right
            .style("opacity", function (d) {
                if (Names[d.source.index] === "") {
                    return 0
                } else {
                    if (selectedProfId === "") {
                        return opacityDefault
                    } else {
                        var chosen = profID.findIndex(findI);
                        if (d.source.index == chosen) {
                            return opacityDefault
                        }
                        return opacityLow
                    }
                }
            }) //Make the dummy strokes have a zero opacity (invisible)
            .style("pointer-events", function (d, i) { return (Names[d.source.index] === "" ? "none" : "auto"); }) //Remove pointer events from dummy strokes
            .attr("d", path)
            // .on("mouseover", fadeOnChord)
            // .on("mouseout", fade(opacityDefault))
            .on("click", clickPath)
            .transition()




        ////////////////////////////////////////////////////////////
        ////////////////// Extra Functions /////////////////////////
        ////////////////////////////////////////////////////////////
        function findI(element) { return element['scholar_id'] == selectedProfId }

        //Include the offset in de start and end angle to rotate the Chord diagram clockwise
        function startAngle(d) { return d.startAngle + offset; }
        function endAngle(d) { return d.endAngle + offset; }

        // Returns an event handler for fading a given chord group
        function fade(opacity) {
            return function (d, i) {
                wrapper.selectAll("path.chord")
                    .filter(function (d) {
                        return d.source.index !== i.index && d.target.index !== i.index && Names[d.source.index] !== "";
                    })
                    .transition()
                    .style("opacity", opacity);
            };
        }//fade

        // Fade function when hovering over chord
        function fadeOnChord(d, i) {
            var chosen = i;
            wrapper.selectAll("path.chord")
                .transition()
                .style("opacity", function (d) {
                    return d.source.index === chosen.source.index && d.target.index === chosen.target.index ? opacityDefault : opacityLow;
                });
        }//fadeOnChord

        /*Taken from http://bl.ocks.org/mbostock/7555321
        //Wraps SVG text*/
        function wrapChord(text, width) {
            text.each(function () {
                var text = d3.select(this),
                    words = text.text().split(/\s+/).reverse(),
                    word,
                    line = [],
                    lineNumber = 0,
                    lineHeight = 1.1, // ems
                    y = 0,
                    x = 0,
                    dy = parseFloat(text.attr("dy")),
                    tspan = text.text(null).append("tspan").attr("x", x).attr("y", y).attr("dy", dy + "em");

                while (word = words.pop()) {
                    line.push(word);
                    tspan.text(line.join(" "));
                    if (tspan.node().getComputedTextLength() > width) {
                        line.pop();
                        tspan.text(line.join(" "));
                        line = [word];
                        tspan = text.append("tspan").attr("x", x).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
                    }
                }
            });
        }//wrapChord

        function getColor(interest) {
            switch (interest) {
                case 'Artificial Intelligence':
                    return "#5778a4";
                case 'Cybersecurity':
                    return "#e7ca60";
                case 'Data, Knowledge & Info Mgmt':
                    return "#85b6b2";
                case 'Human-Computer Interaction':
                    return "#f1a2a9";
                case 'Networking and Computer Systems':
                    return "#6a9f58";
                case 'Software Engg and Prog Lang':
                    return "#e49444";
                case 'Theoretical Computer Science':
                    return "#a87c9f";
                case 'Vision and Graphics':
                    return "#d1615d";
                case '':
                    return "none"
            };
            return "#999"
        }

        function clickPath(d, i) {
            setSelectedProfId(profID[i.source.index]['scholar_id'])
        }

        function clickGroup(d, i) {
            setSelectedProfId(profID[i.index]['scholar_id'])
        }

    }, [selectedProfId])

    return (
        <div>
            <Row>
                <Col>
                    <p style={{ textAlign: "justify" }}>
                    Understanding professors&apos; research interests helps you choose relevant courses, 
                    seize research opportunities, and gain valuable knowledge and insights. 
                    It enables you to align your interests with specialized professors, 
                    pursue research collaborations, and deepen your understanding of the field.
                    </p>
                    <p> 
                    Feel free to click on the path or professors&apos; names to view their interests.
                    </p>

                    <div className="mt-3" style={{ color: "red" }}>

                    </div>
                </Col>
                <Col style={{ padding: "0px" }}>
                    <div className="research-interest" ref={svgRef} ></div>
                </Col>
            </Row>
        </div>

    )
}