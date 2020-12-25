import React from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom';
import 'semantic-ui-css/semantic.min.css';
import { Container } from 'semantic-ui-react'
import './App.css';

import Home from './Pages/Home';
import Login from './Pages/Login';
import Register from './Pages/Register';
import MenuBar from './Components/MenuBar';
import { AuthProvider } from './context/auth';
import AuthRoute from './util/AuthRoute';

function App() {
  return (
    <AuthProvider>
    <Router>
    <Container>
      <MenuBar />
      <Route exact path= '/' component={Home} />
      <AuthRoute exact path= '/login' component={Login} />
      <AuthRoute exact path= '/register' component={Register} />
    </Container>
      
    </Router>
    </AuthProvider>
  );
}

export default App;
