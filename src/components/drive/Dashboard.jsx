import React from 'react'
import { Container } from 'react-bootstrap';
import { useParams, useLocation } from 'react-router-dom';
import { useFolder } from '../hooks/useFolder';
import AddFolder from './AddFolder';
import Folder from './Folder';
import NavComp from './NavComp';
import File from './File';
import FolderBreadcrumbs from './FolderBreadcrumbs';
import AddFileButton from './AddFileButton';

export default function Dashboard() {

    const { folderId } = useParams();
    //we added the state for slow networks making the breadcrumb persist since it wont make unnecessary db calls
    const { state = {} } = useLocation();  
    const { folder, childFolders, childFiles } = useFolder(folderId, state.folder);
    // console.log(childFolders);
    return (
        <>
        <NavComp />
        <Container fluid >
        <div className='d-flex align-items-center'>
            <FolderBreadcrumbs currentFolder={folder} />
                <AddFileButton currentFolder={folder} />
            <AddFolder currentFolder={folder} />
        </div>
            {childFolders.length > 0 && (
                <div className='d-flex flex-wrap'>
                    {childFolders.map(childFolder => (
                        <div key={childFolder.id} style={{ maxWidth: '250px' }}
                            className='p-2'>
                            <Folder folder={childFolder} />
                        </div>
                    ))}
                </div>
            )}
            {childFolders.length > 0 && childFiles.length > 0 && <hr />}
            {childFiles.length > 0 && (
                <div className='d-flex flex-wrap'>
                    {childFiles.map(childFile => (
                        <div key={childFile.id} style={{ maxWidth: '250px' }}
                            className='p-2'>
                            <File file={childFile} />
                        </div>
                    ))}
                </div>
            )}
        </Container>
        </>
    )
}
