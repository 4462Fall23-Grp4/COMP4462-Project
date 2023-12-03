import { useCallback, useMemo, useState } from 'react'
import './App.css'
import { Container, Row, Col, ListGroup, Tab, Nav, Dropdown, FormControl, Badge, CloseButton, Card, Button } from 'react-bootstrap'
import ust_cse_prof_data from './data/ust_cse_prof.json' 
import { debounce } from 'lodash'
import { getRankColor, ranks } from './utils'
import IntraDeptNetworkGraph from './components/IntraDeptNetworkGraph'
import CitationLineGraph from './components/CitationLineGraph'
import PublicationLineGraph from './components/PublicationLineGraph'
import blankAvatar from "./assets/blankAvatar.png"
import IndexScatterPlot from './components/IndexScatterPlot'
import ChoroplethMap from './components/ChoroplethMap'
import ResearchInterest from './components/ResearchInterest'

const App = () => {
  const [currentTab, setCurrentTab] = useState("perfTab")
  const [searchProf, setSearchProf] = useState("")
  const [currentProfId, setCurrentProfId] = useState("")
  const [currentFilter, setCurrentFilter] = useState("")

  const setCurrentProfIdCallback = useCallback((id) => {setCurrentProfId(id)}, [])

  const currentProf = useMemo(() => 
    ust_cse_prof_data.find(prof => prof.gs_id == currentProfId)
  , [currentProfId])

  const ustCseProfFiltered = useMemo(() => {
    return ust_cse_prof_data.filter((prof) => {
      var hasSearchWord = searchProf == "" || prof.name.toLowerCase().includes(searchProf.toLowerCase())
      var isInFilter = currentFilter == "" || prof.rank.split(" and ").find((x) => x == currentFilter)

      return hasSearchWord && isInFilter
    })
  }, [searchProf, currentFilter])

  const citationLineGraph = useMemo(() => <CitationLineGraph profData={currentProf}/>, [currentProf])
  const pubLineGraph = useMemo(() => <PublicationLineGraph profData={currentProf} />, [currentProf])
  const intraDeptNetworkGraph = useMemo(() => 
    <IntraDeptNetworkGraph selectedProfId={currentProfId} setSelectedProfId={setCurrentProfIdCallback} />
  , [currentProfId])

  const Choropleth = useMemo(() => 
    <ChoroplethMap selectedProfId={currentProfId} setSelectedProfId={setCurrentProfIdCallback} />
  , [])

  const researchInterest = useMemo(() => 
    <ResearchInterest selectedProfId={currentProfId} setSelectedProfId={setCurrentProfIdCallback} />
  , [currentProfId])

  const indexScatterPlot = useMemo(() => 
    <IndexScatterPlot selectedProfId={currentProfId} setSelectedProfId={setCurrentProfIdCallback} />
  , [currentProfId])


  const handleTabSelect = (selectedTab) => {
    setCurrentTab(selectedTab)
  }

  const handleSearchProfInput = (event) => {
    setSearchProf(event.target.value)
  }

  const handleFilterSelect = (filter) => {
    setCurrentFilter(filter)
  }

  return (
    <Container fluid>
      <Row>
        <Col style={{padding: "20px 0px 20px 20px"}}>
          <h2>HKUST CSE Department Google Scholar Visualization</h2>
          <p>
            This visualization aims to act as a visual aid to evaluate HKUST CSE Department&apos;s regular faculty 
            members&apos; performance, research interest and co-authorship network in overall and individual view.
            Select a faculty member for more indivdual details. Click &ldquo;Deselect&ldquo; to view overall visualisation.
          </p>
          <Tab.Container activeKey={currentTab} onSelect={handleTabSelect}>
            <Nav variant="tabs" className="mb-3">
              <Nav.Item>
                <Nav.Link eventKey="perfTab">Performance</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="interestTab">Research Interests</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="interCoauthorTab">Internal co-authorship Network</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="exterCoauthorTab">External co-authorship Network</Nav.Link>
              </Nav.Item>
            </Nav>
            <Tab.Content>
              <Tab.Pane eventKey="perfTab">
                <p>
                  The i10-index and h-index are important indicators of the productivity and the citation impact of 
                  publication of an author. On the left side, the two indicators are used to plot a scatterplot. 
                  You may choose the overall view or the 5-year view. You can hover each point for details, or click
                  to select a faculty member.
                  <br/><br/>
                  The number of citations and publications also provide significant insight into analysing research 
                  impact and rank of all professors in the CSE department at HKUST.  On the right side, line charts 
                  for total citation per year and total publication per year are displayed. You can select a specific 
                  author on the author panel to view the charts for his/her respective citation per year and 
                  publication per year.
                </p>
                <Row>
                  <Col>
                    <div style={{width: "500px"}}>
                      {indexScatterPlot}
                    </div>
                  </Col>
                  <Col>
                    <div className="d-flex flex-column align-items-end">
                      {citationLineGraph}
                      {pubLineGraph}
                      <p>
                        Note: The values for 2023 are still counting.
                      </p>
                    </div>
                  </Col>
                </Row>
              </Tab.Pane>
              <Tab.Pane eventKey="interestTab">
                {researchInterest}
              </Tab.Pane>
              <Tab.Pane eventKey="interCoauthorTab">
                <div>
                  {intraDeptNetworkGraph}
                </div>
              </Tab.Pane>
              <Tab.Pane eventKey="exterCoauthorTab">
                {Choropleth}
              </Tab.Pane>
            </Tab.Content>
          </Tab.Container>
        </Col>
        <Col sm={3} style={{maxHeight: "100vh", width: "350px"}}>
          <Container className="d-flex flex-column" style={{ height: '100vh', padding: "20px 10px 20px 10px" }}>
            { currentProf &&
              <Card className="mb-3 p-0">
                <Card.Header>
                  <div className="d-flex justify-content-between align-items-center">
                    Selected Faculty Member
                    <Button variant="outline-secondary" onClick={() => setCurrentProfId("")}>Deselect</Button>
                  </div>
                </Card.Header>
                <Card.Body>
                  <Row>
                    <Col xs={2} style={{width: "120px"}}>
                      <img src={currentProf.url_picture ? currentProf.url_picture : blankAvatar} className="avatar" />
                    </Col>
                    <Col>
                      <span style={{fontWeight: "bold"}}>Name:</span> {currentProf.name} <br/>
                      <span style={{fontWeight: "bold"}}>Tel:</span> {currentProf.tel} <br/>
                      <span style={{fontWeight: "bold"}}>Email:</span> {currentProf.email} <br/>
                      <span style={{fontWeight: "bold"}}>Google Scholar ID:</span> {currentProf.gs_id} <br/>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            }
            <div className="mb-3 d-flex" >
              <FormControl type="text" placeholder="Search Name" onChange={debounce(handleSearchProfInput, 200)} />
              <Dropdown style={{marginLeft: "16px"}}>
                <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                  Filter
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  {ranks.map((rank, index) => (
                    <Dropdown.Item key={`rank${index}`} onClick={() => handleFilterSelect(rank)}>
                      <svg width="20" height="10"><circle cx="5" cy="5" r="5" fill={getRankColor(rank)}/></svg>
                      {rank}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
            </div> 
            { currentFilter != "" && 
              <div className="d-flex mb-3">
                <div className='align-self-center' style={{marginRight: "16px", fontSize: "16px"}}>Filter: </div>
                <Badge bg="light" className="p-2">
                  <span style={{fontSize: "14px", color: "GrayText"}}>{currentFilter}</span>
                  <CloseButton onClick={() => setCurrentFilter("")} />
                </Badge>
              </div>
            }
            <div className="flex-grow-1" style={{ overflowY: 'scroll' }}>
              <ListGroup>
                {ustCseProfFiltered.map((prof, index) => (
                  <ListGroup.Item key={index} onClick={() => {
                    setCurrentProfId(prof.gs_id)
                  }} active={currentProfId == prof.gs_id} action>
                    <svg width="20" height="20">
                      <circle cx="7" cy="10" r="7" fill="white"/>
                      <circle cx="7" cy="10" r="5" fill={getRankColor(prof.rank)}/>
                    </svg>
                    {prof.name}
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </div>
          </Container>
        </Col>
      </Row>
    </Container>
  );
};

export default App;
