/* eslint-disable react/prop-types */
import embed from "vega-embed";
import { useRef, useEffect, useMemo } from "react";
import ust_cse_prof_data from '../data/ust_cse_prof.json' 

export default function PublicationLineGraph({profData}) {
  const containerRef = useRef()

  const totalPubs = useMemo(() => {
    const totalPubsByYear = ust_cse_prof_data.map(x => Object.entries(x.pub_per_year[0]).map(([year, publications]) => ({ year: parseInt(year), publications })))
      .flat()
      .reduce((acc, x) => {
        const { year, publications } = x

        if (acc[year]) {
          acc[year] += publications
        } else {
          acc[year] = publications
        }
        return acc;
      }, {})

      return Object.entries(totalPubsByYear).map(([year, publications]) => ({ year: parseInt(year), publications }))
              .filter(x => x.year >= 1950 && x.year <= 2023) // filter outliers
  },[])

  useEffect(() => {
    var chartData;

    if (!profData) {
      chartData = totalPubs
    } else {
      chartData = Object.entries(profData["pub_per_year"][0]).map(([year, publications]) => ({ year: parseInt(year), publications }))
                    .filter(x => x.year >= 1950 && x.year <= 2023) // filter outliers
    }


    const maxPubs = Math.max(...chartData.map(x => x.publications))
    const upperBound = maxPubs + 10 - (maxPubs % 10)

    const spec = {
      $schema: "https://vega.github.io/schema/vega-lite/v5.json",
      title: `${profData ? profData.name + "'s" : "Total"} Paper Publications from 1950 to 2023`,
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
              field: "publications",
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
              field: "publications",
              type: "quantitative",
              scale: { domain: [0, upperBound] },
            },
            tooltip: [
              { field: "year" },
              { field: "publications" }
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
