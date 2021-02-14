import React,{ useState } from 'react'
import { Button, Form, Modal, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import { faFolderPlus } from '@fortawesome/free-solid-svg-icons';

import { database } from '../../firebase';
import { useAuth } from '../../context/AuthContext';
import { ROOT_FOLDER } from '../hooks/useFolder';
 
export default function AddFolder({ currentFolder }) {

    const [open, setOpen] = useState(false);
    const [name, setName] = useState('');
    const { currentUser } = useAuth();

    function openModal() {
        setOpen(true);
    }
    function closeModal() {
        setOpen(false);
    }

    function handleSubmit(e) {
        e.preventDefault();

        if (currentFolder == null) return

        //for the breadcrumb navigation we need to save the path before each folder
        const path = [...currentFolder.path]
        if ( currentFolder !== ROOT_FOLDER ){
            path.push({ name: currentFolder.name, id: currentFolder.id })
        }

        //create a folder in db
        database.folders.add({
            name: name,
            parentId: currentFolder.id,
            userId: currentUser.uid,
            path: path,
            createdAt: database.getCurrentTimestamp()
        })
        setName('');
        closeModal();

    }

    return (
        <>
        <OverlayTrigger
                placement={'bottom'}
                overlay={
                    <Tooltip>
                        Create New Folder
                    </Tooltip>
                }
            >
            <Button 
                variant='outline-success' 
                onClick={openModal}
                size='sm'
            >
            <FontAwesomeIcon icon={faFolderPlus} size='2x'/>
            </Button>
        </OverlayTrigger>
            <Modal show={open} onHide={closeModal} >
                <Form onSubmit={handleSubmit} >
                    <Modal.Body>
                        <Form.Group>
                            <Form.Label>Folder Name</Form.Label>
                            <Form.Control 
                                type='text'
                                required
                                value={name}
                                onChange={e => setName(e.target.value)}
                             />
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant='secondary' onClick={closeModal} >
                            Close
                        </Button>
                        <Button variant='success' type='submit' >
                            Add Folder
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </>
    )
}
