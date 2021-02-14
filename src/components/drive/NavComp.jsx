import React from 'react'
import { Navbar, Nav, Image } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserCircle } from '@fortawesome/free-solid-svg-icons'

export default function NavComp() {
    return (
        <Navbar bg='light' expand='lg'> 
            <Navbar.Brand as={Link} to='/' id='nav'>
              <Image src='logo50.png' roundedCircle /> Drive
            </Navbar.Brand>
            <Nav className="">
                <Nav.Item>
                    <Nav.Link as={Link} to='/user' >
                        <FontAwesomeIcon icon={ faUserCircle } size='2x' />
                    </Nav.Link>
                </Nav.Item>
            </Nav>
        </Navbar>
    )
}
