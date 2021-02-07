import React from 'react'
import { Navbar, Nav, Image } from 'react-bootstrap'
import { Link } from 'react-router-dom'

export default function NavComp() {
    return (
        <Navbar bg='light' expand='lg' > 
            <Navbar.Brand as={Link} to='/' >
              <Image src='logo50.png' roundedCircle /> Drive
            </Navbar.Brand>
            <Nav style={{ position: 'relative' }}>
                <Nav.Link as={Link} to='/user'>
                    Profile
                </Nav.Link>
            </Nav>
        </Navbar>
    )
}
