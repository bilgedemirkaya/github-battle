import React from 'react'
import ReactDOM from 'react-dom'

import './index.css'
import Popular from './components/Popular'
import Battle from './components/Battle'


// Aspects of components: states, lifecycle,UI

/* 1) Components are each able to manage their own states and then you build your entire application 
by composing those components tohether */

/* 2) Lifecycle whether that's fetching some data from API or 
  doing some event when the component is added to DOM itself */ 

  /* 3) In order to descripe what the UI of the component is going to look like we use render.
  */ 

// body for our first component
class App extends React.Component{
    render() {
        return  <div className='container'>
        <Battle />
        <Popular />
   </div>
    }

}
ReactDOM.render(
    // react element 
    <App />,
    // where to render it
    document.getElementById('app')
)