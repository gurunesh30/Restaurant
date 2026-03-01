import {useEffect } from 'react';
import './App.css'
import { Container, Button, Row, Col } from 'react-bootstrap';
import gsap from 'gsap';

function App() {
  useEffect(() => {
    gsap.to(".logo", { rotation: 360, duration: 2, ease: "bounce.out" });
  }, []);
  
  return (
    <Container className="mt-5">
      <Row className="text-center">
        <Col>
          <h1 className="display-4 text-warning">Welcome to Our Restaurant</h1>
          <p className="lead">Authentic Indian Flavors at Your Doorstep.</p>
          <Button variant="success" size="lg">View Menu</Button>
        </Col>
      </Row>
      <img src="./logo.svg" className="logo" />
    </Container>
  )
}

export default App
