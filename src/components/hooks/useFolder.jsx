import { useReducer, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { database } from '../../firebase';

const ACTIONS = {
    SELECT_FOLDER: 'select-folder',
    UPDATE_FOLDER: 'update-folder',
    SET_CHILD_FOLDERS: 'set-child-folders',
    SET_CHILD_FILES: 'set-child-files'
}

//mimics the firebase db to serve as a fake 'root' directory by default
export const ROOT_FOLDER = { name: 'Root', id: null, path: [] }

function reducer(state, { type, payload }) {
    switch (type) {
        case ACTIONS.SELECT_FOLDER:
            return {
                folderId: payload.folderId,
                folder: payload.folder,
                childFiles: [],
                childFolders: []
            }
        case ACTIONS.UPDATE_FOLDER:
            return {
                ...state,
                folder: payload.folder          //updates the folder state while keeping the rest intact
            }
        case ACTIONS.SET_CHILD_FOLDERS:
            return {
                ...state,
                childFolders: payload.childFolders
            }
        case ACTIONS.SET_CHILD_FILES:
            return {
                ...state,
                childFiles: payload.childFiles
            }
        default:
            return state
    }
}

//custom react hook to get the current folder 
export function useFolder(folderId = null, folder = null) {  
    //using null instead of undefined bcuz firebase doesnt work well with undefined
    const [state, dispatch] = useReducer(reducer, {
        folderId,
        folder,
        childFolders: [],
        childFiles: []
    })

    const { currentUser } = useAuth();

    //re-renders data whenever a new folder is selected to make the folder state go back to initial

    useEffect(() => {
        dispatch({ type: ACTIONS.SELECT_FOLDER, payload: { folderId, folder } })
    }, [folderId, folder])

    //re-renders data whenever folderId changes (i.e shows subfolders or children files inside it)
    //changing to a new folder or file, or accessing URL directly
    useEffect(() => {
        //basically when at the 'root' folder or homepage we exit out of the hook immediately
        if (folderId === null) {
            return dispatch({
                type: ACTIONS.UPDATE_FOLDER,
                payload: { folder: ROOT_FOLDER }
            })
        }

        database.folders.doc(folderId).get().then(doc => {
            dispatch({
                type: ACTIONS.UPDATE_FOLDER,
                payload: { folder: database.formatDoc(doc) }
            })
        }).catch((e) => {
            console.log(e); //logging the error with insufficient permissions
            //if we dont get the current folder , revert and update it to the 'root' folder instead
            dispatch({
                type: ACTIONS.UPDATE_FOLDER,
                payload: { folder: ROOT_FOLDER }
            })
        })
    }, [folderId])


    //to populate child folders....
    useEffect(() => {
        //returning this snapshot as it returns a function for cleanup(just like cleanup in useEffect)
      return database.folders
        .where('parentId', '==', folderId)
        .where('userId', '==', currentUser.uid)
        .orderBy('createdAt')
        //onSnapshot runs/re-runs everytime like a callback whenever there are changes which match the above queries 
        //and show the ones which match the criteria
        .onSnapshot(snapshot => {
            dispatch({ 
                type: ACTIONS.SET_CHILD_FOLDERS,
                payload: { childFolders: snapshot.docs.map(database.formatDoc) }
            })
        })
    }, [folderId, currentUser])

    //to populate files
    useEffect(() => {
        return database.files
        .where('folderId', '==', folderId)
        .where('userId', '==', currentUser.uid)
        .orderBy('createdAt')
        .onSnapshot(snapshot => {
            dispatch({ 
                type: ACTIONS.SET_CHILD_FILES,
                payload: { childFiles: snapshot.docs.map(database.formatDoc) }
            })
        })
    }, [folderId, currentUser])

    return state;
}