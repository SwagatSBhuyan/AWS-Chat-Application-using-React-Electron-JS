import React from 'react';
import { Router, Route } from "react-router-dom";

import './App.css';

import Amplify from "aws-amplify";
import { AmplifyAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react';
import { AmazonAIPredictionsProvider } from '@aws-amplify/predictions';

import awsExports from "./aws-exports";

import HomePage from './components/HomePage';
import { createBrowserHistory as createHistory } from 'history'
import Navbar from 'react-bootstrap/Navbar';
// import Nav from 'react-bootstrap/Nav';
import './App.css';


Amplify.configure(awsExports);
Amplify.addPluggable(new AmazonAIPredictionsProvider());

const history = createHistory();

function App() {

    return (

        <div className="App">

            <AmplifyAuthenticator>
                <Router history={history}>
                    <Navbar>
                        <AmplifySignOut />
                    </Navbar>
                    <Route path="/" exact component={HomePage} />
                </Router>
            </AmplifyAuthenticator>

        </div>

    );
}

export default App;