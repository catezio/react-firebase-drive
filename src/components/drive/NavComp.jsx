import React from 'react'
import { Navbar, Nav } from 'react-bootstrap'
import { Link } from 'react-router-dom'

export default function NavComp() {
    return (
        <Navbar bg='light' expand='lg' > 
            <Navbar.Brand as={Link} to='/' >
                Drive
            </Navbar.Brand>
            <Nav>
                <Nav.Link as={Link} to='/user'>
                    Profile
                </Nav.Link>
            </Nav>
        </Navbar>
    )
}
