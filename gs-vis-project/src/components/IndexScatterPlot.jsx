import * as Plot from "@observablehq/plot";
import { useEffect, useRef, useMemo, useState } from "react";
import ust_cse_prof_data from "../data/ust_cse_prof.json";
import { parseRank } from "../utils";
import { ButtonGroup, ToggleButton } from "react-bootstrap";

export default function IndexScatterPlot({ selectedProfId, setSelectedProfId }) {
  const containerRef = useRef();

  const [currentMode, setCurrentMode] = useState("1");

  const modes = [
    { name: "All years", value: "1" },
    { name: "5 years", value: "2" },
  ];

  const data = useMemo(() => {
    return ust_cse_prof_data.map((x) => {
      const { finalRank, head } = parseRank(x.rank);

      return {
        name: x.name,
        gs_id: x.gs_id,
        hindex: currentMode == "1" ? x.hindex : x.hindex5y,
        i10index: currentMode == "1" ? x.i10index : x.i10index5y,
        rank: finalRank,
        head,
      };
    });
  }, [currentMode]);

  const getMarkColor = (rank) => {
    switch (rank) {
      case "Chair Professor":
        return "#0057e7"
      case "Professor":
        return "#d62d20"
      case "Associate Professor":
        return "#ffa700"
      case "Assistant Professor":
        return "#008744"
    }
    return "black"
  }

  useEffect(() => {
    const plot = Plot.plot({
      height: 500,
      width: 700,
      color: {
        type: "categorical",
        domain: [
          "Chair Professor",
          "Professor",
          "Associate Professor",
          "Assistant Professor",
        ],
        range: ["#0057e7", "#d62d20", "#ffa700", "#008744"],
        legend: true,
      },
      symbol: {
        type: "categorical",
        domain: ["Head", "Associate Head", "Non-head"],
        range: ["triangle2", "times", "circle"],
        legend: true,
      },
      x: { domain: [0, 90] },
      y: { domain: [0, 740], grid: true },
      marks: [
        Plot.dot(data, {
          x: "hindex",
          y: "i10index",
          // stroke: "rank",
          stroke: (d) => {
            if (!selectedProfId) {
              return getMarkColor(d.rank)
            } else {
              if (d.gs_id === selectedProfId)
                return getMarkColor(d.rank)
              else
                return "grey"
            }
          },
          fill: (d) =>{
            if (!selectedProfId) {
              return "none"
            } else {
              if (d.gs_id === selectedProfId)
                return getMarkColor(d.rank)
              else
                return "none"
            }
          },
          symbol: "head",
          // filter: (d) =>{
          //   console.log(d)
          // }
        }),
        Plot.tip(
          data,
          Plot.pointer({
            x: "hindex",
            y: "i10index",
            title: (d) =>
              `${d.name} \n\n i-index: ${d.i10index} \n h-index: ${d.hindex}`,
            fontSize: 14,
          })
        ),
      ],
    });

    containerRef.current.append(plot);
    return () => plot.remove();
  }, [data, selectedProfId]);

  return (
    <div>
      <div className="d-flex flex-row justify-content-between">
        <h3>i10-index vs h-index in </h3>
        <ButtonGroup>
          {modes.map((mode, idx) => (
            <ToggleButton
              key={idx}
              id={`radio-${idx}`}
              type="radio"
              variant="outline-primary"
              name="radio"
              value={mode.value}
              checked={currentMode === mode.value}
              onChange={(e) => setCurrentMode(e.currentTarget.value)}
            >
              {mode.name}
            </ToggleButton>
          ))}
        </ButtonGroup>
      </div>
      <div ref={containerRef}></div>
    </div>
  );
}
