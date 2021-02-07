import React, { useRef, useState } from 'react'
import { Form, Button, Card, Alert } from 'react-bootstrap'
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Contain from './Contain';

export default function ForgotPassword() {
    
    const emailRef = useRef();
    const { resetPass } = useAuth()
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

   async function handleSubmit(e) {
        e.preventDefault();

        try {
           setMessage('');
           setError('');
           setLoading(true);
            
            await resetPass(emailRef.current.value);

            setMessage('check inbox for further info!')
        } catch {
            setError('Failed to reset password');
        }
        setLoading(false);
    }

    // console.log(currentUser.email);
    return (
        <Contain>
            <Card>
                <Card.Body>
                    <h2 className='text-center mb-4' >Reset Password</h2>
                    {error && <Alert variant='danger' >{error}</Alert>}
                    {message && <Alert variant='success' >{message}</Alert>}
                    <Form onSubmit={handleSubmit}>
                        <Form.Group id='email'>
                            <Form.Label>Email</Form.Label>
                            <Form.Control type='email' ref={emailRef} required />
                        </Form.Group>

                        <Button disabled={loading} className='w-100' type='submit'>
                            Reset Password
                        </Button>
                    </Form>
                    <div className='w-100 text-center mt-3'>
                        <Link to='/login'>Login</Link>
                    </div>
                </Card.Body>
            </Card>
            <div className='w-100 text-center mt-2'>
                New user ? <Link to='/signup'>Signup here</Link> 
            </div>
        </Contain>
    )
}
