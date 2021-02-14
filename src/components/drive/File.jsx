import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFile, faTrash } from '@fortawesome/free-solid-svg-icons'
import { ButtonGroup, Dropdown } from 'react-bootstrap'
import { storage, database } from '../../firebase';
import { useAuth } from '../../context/AuthContext';
import Snackbar from 'node-snackbar';
import '../../snackbar/dist/snackbar.min.css';
import '../../snackbar/dist/snackbar.min.js';

export default function File({ file }) {

    const { currentUser } = useAuth();

    function deleteFile() {
        database.files
                .where('name','==', file.name)
                .where('url','==', file.url)
                .where('userId','==', currentUser.uid)
                .get()
                .then(files => {
                    const file = files.docs[0]
                    if(file){
                        file.ref.delete()
                    }
                })
                .then(() => 
                    storage
                    .refFromURL(file.url)
                    .delete()
                    .then(() => {
                        Snackbar.show({text: "file deleted", showAction: false, pos: 'bottom-left', duration: 3000, width: '300px' });
                    }
                ))
    }

    return (
        <Dropdown as={ButtonGroup} >
            <a href={file.url} target='_blank' 
                className='btn btn-outline-dark text-truncate w-100'>
                <FontAwesomeIcon icon={faFile} className='mr-2' />
                {file.name}
            </a>
            <Dropdown.Toggle split variant='outline-dark' id="dropdown-split-basic" />
            <Dropdown.Menu>
                <Dropdown.Item onClick={deleteFile}>
                    <FontAwesomeIcon icon={faTrash} />  Delete File
                </Dropdown.Item>
            </Dropdown.Menu>
        </Dropdown>
        
    )
}
