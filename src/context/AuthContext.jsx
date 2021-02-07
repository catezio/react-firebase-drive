import React,{useState, createContext, useContext, useEffect} from 'react';
import { auth } from '../firebase';

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {

    const [currentUser, setCurrentUser] = useState();
    //as firebase sets the token in localstorage for us, initially the currentUser is null, to keep a check on it we use a loading state
    const [loading, setLoading] = useState(true); 

    const signup = (email, pass) => {
        return auth.createUserWithEmailAndPassword(email,pass);
    }

    const login = (email, pass) => {
        return auth.signInWithEmailAndPassword(email, pass);
    }
    
    function logout() {
        return auth.signOut();
    }
    
    function resetPass(email) {
        return auth.sendPasswordResetEmail(email);
    }

    function updateEmail(email) {
        return currentUser.updateEmail(email);
    }

    function updatePass(pass) {
        return currentUser.updatePassword(pass);
    }

    //whenever component is mount/unmount, the auth state indicates user is signed in or signed out
    useEffect(() => {
       const unsubscribe = auth.onAuthStateChanged(user => {     
           setCurrentUser(user);
            setLoading(false);   
        })
        return unsubscribe; 
    },[])

    const value = {
        currentUser,
        signup,
        login,
        logout,
        resetPass,
        updateEmail,
        updatePass
    }

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    )
}
