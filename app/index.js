import React, { Component } from 'react'
import ReactDOM from 'react-dom'

import './index.css'
import Popular from './components/Popular'
import Battle from './components/Battle'
import {ThemeProvider} from './contexts/theme'
import Nav from './components/Nav'
import {BrowserRouter as Router, Route,Switch} from 'react-router-dom'
import Results from './components/Results'

// Aspects of components: states, lifecycle,UI

/* 1) Components are each able to manage their own states and then you build your entire application 
by composing those components tohether */

/* 2) Lifecycle whether that's fetching some data from API or 
  doing some event when the component is added to DOM itself */ 

  /* 3) In order to descripe what the UI of the component is going to look like we use render.
  */ 

// body for our first component
class App extends React.Component{
    constructor(props){
        super(props)
        this.state ={
            theme: 'light',
            toggleTheme : () => {
                this.setState(({theme}) => ({
                    theme:theme === 'light' ? 'dark' : 'light',
                }))
            
            }
        }
    }
    render() {
        return  (
        <Router>
        <ThemeProvider value={this.state}>
        <div className={this.state.theme}>
            <div className='container'>
                <Nav />
                <Switch>
                <Route exact path='/' component={Popular} />
                <Route exact path='/battle' component={Battle} />
                <Route path='/battle/results' component={Results} />
                <Route render={() => <h1>404 Not Found</h1>} />
                </Switch>
            </div>
        </div>
      </ThemeProvider>
      </Router>
      )
    }
}
ReactDOM.render(
    // react element 
    <App />,
    // where to render it
    document.getElementById('app')
)