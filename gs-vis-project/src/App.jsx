import { useState } from 'react'
import './App.css'
import { Container, Row, Col, ListGroup, Tab, Nav, Button } from 'react-bootstrap'
import ust_cse_prof_data from './data/ust_cse_prof.json' 

const App = () => {
  const [currentTab, setCurrentTab] = useState("perfTab");

  const handleTabSelect = (selectedTab) => {
    setCurrentTab(selectedTab);
  };

  return (
    <Container fluid>
      <Row>
        <Col style={{padding: "20px 0px 20px 20px"}}>
          <h2>HKUST CSE Department Google Scholar Visualization</h2>
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
        <Col sm={3} style={{maxHeight: "100vh", width: "300px"}}>
          <Container className="d-flex flex-column" style={{ height: '100vh', padding: "20px 10px 20px 10px" }}>
            <div className="mb-3">
              <Button>Test</Button>
            </div>
            <div className="flex-grow-1" style={{ overflowY: 'scroll' }}>
              <ListGroup>
                {ust_cse_prof_data.map((item, index) => (
                  <ListGroup.Item key={index}>{item.name}</ListGroup.Item>
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
