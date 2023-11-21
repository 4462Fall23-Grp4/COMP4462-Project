import { useMemo, useState } from 'react'
import './App.css'
import { Container, Row, Col, ListGroup, Tab, Nav, Dropdown, FormControl, Badge, Button, CloseButton } from 'react-bootstrap'
import ust_cse_prof_data from './data/ust_cse_prof.json' 
import { debounce } from 'lodash'
import { getRankColor, ranks } from './utils'

const App = () => {
  const [currentTab, setCurrentTab] = useState("perfTab")
  const [searchProf, setSearchProf] = useState("")
  const [currentProf, setCurrentProf] = useState("")
  const [currentFilter, setCurrentFilter] = useState("")

  const ustCseProfFiltered = useMemo(() => {
    return ust_cse_prof_data.filter((prof) => {
      var hasSearchWord = searchProf == "" || prof.name.toLowerCase().includes(searchProf.toLowerCase())
      var isInFilter = currentFilter == "" || prof.rank.split(" and ").find((x) => x == currentFilter)

      return hasSearchWord && isInFilter
    })
  }, [searchProf, currentFilter])

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
                <Nav.Link eventKey="coauthorTab">Co-authorship Network</Nav.Link>
              </Nav.Item>
            </Nav>
            <Tab.Content>
              <Tab.Pane eventKey="perfTab">
                Performance Tab
              </Tab.Pane>
              <Tab.Pane eventKey="interestTab">
                Interest Tab
              </Tab.Pane>
              <Tab.Pane eventKey="coauthorTab">
                Network Tab
              </Tab.Pane>
            </Tab.Content>
          </Tab.Container>
        </Col>
        <Col sm={3} style={{maxHeight: "100vh", width: "350px"}}>
          <Container className="d-flex flex-column" style={{ height: '100vh', padding: "20px 10px 20px 10px" }}>
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
                  <ListGroup.Item key={index} onClick={() => setCurrentProf(prof)} active={currentProf.gs_id == prof.gs_id} action>
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
