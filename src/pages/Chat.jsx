import React from 'react';
import { Container, Row, Col, Form, InputGroup, FormControl, Button, Navbar, Nav, Dropdown } from 'react-bootstrap';

const ChatDashboard = () => {
  return (
    <>
      <Navbar bg="light">
        <Navbar.Brand>
          <img
            src="your-logo-image-source"
            height="30"
            className="d-inline-block align-top"
            alt="Chat Dashboard logo"
          />
        </Navbar.Brand>
        <Nav className="mr-auto">
          <Form inline>
            <InputGroup>
              <FormControl type="text" placeholder="Search users" />
              <InputGroup.Append>
                <Button variant="outline-secondary">Search</Button>
              </InputGroup.Append>
            </InputGroup>
          </Form>
        </Nav>
        <Dropdown>
          <Dropdown.Toggle variant="success" id="dropdown-basic">
            User Profile
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item href="#/action-1">Settings</Dropdown.Item>
            <Dropdown.Item href="#/action-2">Log out</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </Navbar>
      <Container fluid>
        <Row>
          <Col xs={12} md={4}>
            <div className="users-container">
              <h2>Users</h2>
              <ul>
                <li>User 1</li>
                <li>User 2</li>
                <li>User 3</li>
                <li>User 4</li>
              </ul>
            </div>
          </Col>
          <Col xs={12} md={8}>
            <div className="chat-container">
              <h2>Chat</h2>
              <div className="messages-container">
                <ul>
                  <li>Message 1</li>
                  <li>Message 2</li>
                  <li>Message 3</li>
                  <li>Message 4</li>
                </ul>
              </div>
              <Form>
                <InputGroup>
                  <FormControl type="text" placeholder="Type your message here" />
                  <InputGroup.Append>
                    <Button variant="primary" type="submit">Send</Button>
                  </InputGroup.Append>
                </InputGroup>
              </Form>
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default ChatDashboard;
