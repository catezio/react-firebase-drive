import React from 'react';
import { Button, ButtonGroup, Dropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFolder, faTrash } from '@fortawesome/free-solid-svg-icons';
import { database, storage } from '../../firebase';
import { useAuth } from '../../context/AuthContext';
import Snackbar from 'node-snackbar';
import '../../snackbar/dist/snackbar.min.css';
import '../../snackbar/dist/snackbar.min.js';

export default function Folder({ folder }) {

    const { currentUser } = useAuth();

    const Query = () => database.folders
                            .where('userId', '==', currentUser.uid)
                            .where('path', 'array-contains', {id: folder.id, name: folder.name})
                            .get()
                            .then(childFolder => {
                                const childFolders = childFolder.docs;
                                childFolders
                                .forEach((f) => {
                                    database.files
                                    .where('userId', '==', currentUser.uid)
                                    .where('folderId', '==', f.id)
                                    .get()
                                    .then(childFile => {
                                        const childFiles = childFile.docs;
                                        childFiles
                                            .forEach((file) => 
                                            storage
                                            .refFromURL(file.data().url)
                                            .delete()
                                            .then(() => {file.ref.delete()}));
                                    })
                                    .finally(() => f.ref.delete())    
                                })
                            })
                            

    function deleteFolder() {

            database.folders
                .where('userId', '==', currentUser.uid)
                .where('__name__', '==', folder.id)
                .get()
                .then(folder => {
                    const parent = folder.docs[0];
                    parent.ref.delete();
                })
                .then(() => Query())
                .catch((err) => console.log(err))
                .finally(() => Snackbar.show({text: "folder deleted", showAction: false, pos: 'bottom-left', duration: 3000, width: '300px' }))
        
    } 

    return (
        <Dropdown as={ButtonGroup} >
            <Button to={{
                pathname: `/folder/${folder.id}`,
                state: { folder: folder }
                }} 
                    variant='outline-dark' 
                    className='text-truncate w-100' 
                    as={Link} >
                <FontAwesomeIcon icon={faFolder} className='mr-2' />
                {folder.name}
            </Button>
            <Dropdown.Toggle split variant='outline-dark' id="dropdown-split-basic" />
                <Dropdown.Menu>
                    <Dropdown.Item onClick={deleteFolder}>
                        <FontAwesomeIcon icon={faTrash} />  Delete Folder
                    </Dropdown.Item>
                </Dropdown.Menu>
        </Dropdown>
        
    )
}
