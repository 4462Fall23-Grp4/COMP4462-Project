/**
 * Reference: https://github.com/ninjaconcept/d3-force-directed-graph/blob/master/example/3-user-interaction.html
 */

import * as d3 from "d3"
import nodes from '../data/unique_ust_coauthor.json'
import links from '../data/ust_coauthor_link.json'
import { useEffect, useRef, useState } from "react"
import { getRankColor } from "../utils"
import { Col, Row } from "react-bootstrap"

// eslint-disable-next-line react/prop-types
export default function IntraDeptNetworkGraph({selectedProfId, setSelectedProfId}) {
  const svgRef = useRef(null)

  const [isCoauthor, setIsCoauthor] = useState(true)

  useEffect(() => {
    const container = d3.select(svgRef.current)

    const width = 800
    const height = 600
    const radius = 8

    container.selectAll("*").remove();

    const svg = container
      .append("svg")
      .attr("width", width)
      .attr("height", height)
    
    const simulation = d3.forceSimulation()
      .force('link', d3.forceLink().id((link) => link.id))
      .force('charge', d3.forceManyBody().strength(-200))
      .force('center', d3.forceCenter(width / 2, height / 2))

    var dragDrop = d3.drag().on('start', (event, node) => {
      simulation.alphaTarget(0.7).restart()
      node.fx = node.x
      node.fy = node.y
    }).on('drag', (event, node) => {
      node.fx = event.x
      node.fy = event.y
    }).on('end', (event, node) => {
      if (!event.active) {
        simulation.alphaTarget(0)
      }
      node.fx = null
      node.fy = null
    })

    function getNeighbors(node) {
      return links.reduce((neighbors, link) => {
          if (link.target.id === node.id) {
            neighbors.push(link.source.id)
          } else if (link.source.id === node.id) {
            neighbors.push(link.target.id)
          }
          return neighbors
        },
        [node.id]
      )
    }
  
    function isNeighborLink(node, link) {
      return link.target.id === node.id || link.source.id === node.id
    }
    
    function getNodeColor(node, neighbors) {
      if (selectedProfId != "") {
        var temp_node = getNode(selectedProfId)

        if (temp_node == null) {
          setIsCoauthor(false)
          return 'gray'
        } else {
          setIsCoauthor(true)
          neighbors = getNeighbors(temp_node)
        }
      }
  
      if (Array.isArray(neighbors) && neighbors.indexOf(node.id) > -1) {
        return getRankColor(node.group) 
      }
    
      if (!Array.isArray(neighbors)) {
        return getRankColor(node.group)
      }
    
      return 'gray'
    }
    
    function getLinkColor(link) {
      if (selectedProfId != "") {
        var node = getNode(selectedProfId)
      }

      if (node == null) return '#E5E5E5'

      return isNeighborLink(node, link) ? 'black' : '#E5E5E5'
    }

    function getLinkStrokeWidth(link) {
      if (selectedProfId != "") {
        var node = getNode(selectedProfId)
      }

      if (node == null) return 1

      return isNeighborLink(node, link) ? 2 : 1
    }
    
    function getTextSize(node, neighbors) {
      if (selectedProfId != "") {
        var temp_node = getNode(selectedProfId)

        if (temp_node == null) {
          return 10
        } else {
          neighbors = getNeighbors(temp_node)
        }
      }
  
      if (Array.isArray(neighbors) && neighbors.indexOf(node.id) > -1) {
        return 15
      }

      return 10
    }
  
    function getNode(id) {
      if (id == "") return null

      return nodes.find(node => node.id == id)
    }
    
    function selectNode(event, selectedNode) {
      setSelectedProfId(selectedNode.id)

      // var neighbors = getNeighbors(selectedNode)
    
      // nodeElements.attr('fill', (node) => getNodeColor(node, neighbors))
      // textElements.attr('fill', (node) => getTextColor(node, neighbors))
      // linkElements.attr('stroke', (link) => getLinkColor(selectedNode, link))
    }
    
    var linkElements = svg.append("g")
      .attr("class", "links")
      .selectAll("line")
      .data(links)
      .enter().append("line")
        // .attr("stroke-width", 1)
        // .attr("stroke", "rgba(50, 50, 50, 0.2)")
    
    var nodeElements = svg.append("g")
      .attr("class", "nodes")
      .selectAll("circle")
      .data(nodes)
      .enter().append("circle")
        .attr("r", radius)
        .call(dragDrop)
        .on('click', selectNode)
    
    var textElements = svg.append("g")
      .attr("class", "texts")
      .selectAll("text")
      .data(nodes)
      .enter().append("text")
        .text((node) => node.label )
        // .attr("font-size", 10)
        .attr("dx", 15)
        .attr("dy", 4)
    
    simulation.nodes(nodes).on('tick', () => {
      nodeElements
        .attr('cx', (node) => { return node.x = Math.max(radius, Math.min(width - radius - 100, node.x)) } )
        .attr('cy', (node) => { return node.y = Math.max(radius, Math.min(height - radius, node.y)) } )
      textElements
        .attr('x', (node) => node.x )
        .attr('y', (node) => node.y )
      linkElements
        .attr('x1', (link) => link.source.x )
        .attr('y1', (link) => link.source.y )
        .attr('x2', (link) => link.target.x )
        .attr('y2', (link) => link.target.y )
    })
    
    simulation.force("link").links(links)

    // For selected node
    nodeElements.attr('fill', getNodeColor)
    linkElements.attr('stroke', (link) => getLinkColor(link))
    linkElements.attr("stroke-width", (link) => getLinkStrokeWidth(link))
    textElements.attr('font-size', (node) => getTextSize(node))
  }, [selectedProfId])

  return (
    <div>
      <Row>
        <Col>
          <p style={{textAlign: "justify"}}>
            In the academia, it is often that researchers collaborate with one another in publishing a 
            research paper. The force-directed network graph here shows the coauthorship between HKUST
            CSE Department&apos;s regular faculty members. Feel free to click on the node to select the
            member, or drag the nodes to move the nodes. 
          </p>

          <div className="mt-3" style={{color: "red"}}> 
            {
              !isCoauthor && 
              <p>This faculty member has no co-author stated in Google Scholar.</p>
            }
          </div>
        </Col>
        <Col>
          <div className="intra-dept-network-graph" ref={svgRef} ></div>
        </Col>
      </Row>
    </div>
  )
}