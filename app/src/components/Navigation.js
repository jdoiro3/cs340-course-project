import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import Container from 'react-bootstrap/Container'
import { Link } from "react-router-dom";


export default function Navigation({ entities }) {
    return (
        <Navbar bg="light" expand="lg">
            <Container>
                <Navbar.Brand href="/">Database Admin</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        {entities.map((e, i) => <Nav.Link as={Link} key={i} to={`/${e.name.toLowerCase()}`}>{e.name}</Nav.Link>)}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
  }