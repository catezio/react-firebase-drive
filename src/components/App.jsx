import React from 'react';
import Signup from './auth/Signup';
import Login from './auth/Login';
import Profile from './auth/Profile';
import ForgotPassword from './auth/ForgotPassword';
import UpdateProfile from './auth/UpdateProfile';
import { AuthProvider } from '../context/AuthContext';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import PrivateRoute from './auth/PrivateRoute';
import Dashboard from './drive/Dashboard';

function App() {
  return (
        <Router>
          <AuthProvider>
            <Switch>
              {/* Drive */}
              <PrivateRoute exact path='/' component={Dashboard} />
              <PrivateRoute exact path='/folder/:folderId' component={Dashboard} />

              {/* Profile */}
              <PrivateRoute path='/user' component={Profile} />
              <PrivateRoute path='/update-profile' component={UpdateProfile} />

              {/* Auth  */}
              <Route path='/signup' component={Signup} />
              <Route path='/login' component={Login} />
              <Route path='/forgot-password' component={ForgotPassword} />
            </Switch> 
          </AuthProvider>
        </Router>
  );
}

export default App;
