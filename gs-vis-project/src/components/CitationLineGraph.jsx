/* eslint-disable react/prop-types */
import embed from "vega-embed";
import { useRef, useEffect, useMemo } from "react";
import ust_cse_prof_data from '../data/ust_cse_prof.json' 

export default function CitationLineGraph({profData}) {
  const containerRef = useRef()

  const totalCites = useMemo(() => {
    const totalCitesByYear = ust_cse_prof_data.map(x => Object.entries(x.cites_per_year).map(([year, cites]) => ({ year: parseInt(year), cites })))
      .flat()
      .reduce((acc, x) => {
        const { year, cites } = x

        if (acc[year]) {
          acc[year] += cites
        } else {
          acc[year] = cites
        }
        return acc;
      }, {})

      return Object.entries(totalCitesByYear).map(([year, cites]) => ({ year: parseInt(year), cites }))
  },[])

  useEffect(() => {
    var chartData;

    if (!profData) {
      chartData = totalCites
    } else {
      chartData = Object.entries(profData["cites_per_year"]).map(([year, cites]) => ({ year: parseInt(year), cites }))
    }


    const maxCites = Math.max(...chartData.map(x => x.cites))
    const upperBound = maxCites + 100 - (maxCites % 100)

    const spec = {
      $schema: "https://vega.github.io/schema/vega-lite/v5.json",
      title: `${profData ? profData.name + "'s" : "Total"} Paper Citations from 1950 to 2023`,
      width: 500,
      height: 200,
      mark: "line",
      data: {
        values: chartData,
      },
      layer: [
        {
          mark: "line",
          encoding: {
            x: {
              field: "year",
              type: "quantitative",
              scale: { domain: [1950, 2023] },
            },
            y: {
              field: "cites",
              type: "quantitative",
              scale: { domain: [0, upperBound] },
            },
          },
        },
        {
          mark: { type: "point", filled: true, size: 50 },
          encoding: {
            x: {
              field: "year",
              type: "quantitative",
              scale: { domain: [1950, 2023] },
            },
            y: {
              field: "cites",
              type: "quantitative",
              scale: { domain: [0, upperBound] },
            },
            tooltip: [
              { field: "year" },
              { field: "cites" }
            ]
          },
        },
      ],
      config: {
        axis: {
          grid: false,
        },
      },
      view: {
        stroke: null,
      },
    };

    embed(containerRef.current, spec, {
      mode: "vega-lite",
      actions: false,
      data: { values: chartData },
    }).catch(console.error);
  });

  return <div ref={containerRef}></div>;
}
