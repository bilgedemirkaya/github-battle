import React from 'react'
import {ThemeConsumer} from '../contexts/theme'
import {Link} from 'react-router-dom'
import {NavLink} from 'react-router-dom'
import {BrowserRouter as Router,Route,Switch} from 'react-router-dom'  

const activeStyle = {
    color: 'rgb(187, 46, 31)'
  }
export default function Nav () { 
    return (
        <ThemeConsumer>
            {({theme,toggleTheme}) => (
                <nav className='row space-between'>
                <ul>
                    <li>
                    <NavLink
                to='/'
                exact
                activeStyle={activeStyle}
                className='nav-link'>
                  Popular
              </NavLink>
                    </li>
                    <NavLink
                to='/battle'
                exact
                activeStyle={activeStyle}
                className='nav-link'>
                  Battle
              </NavLink>
                </ul>
                    <button 
                    style={{fontSize:30}}
                    className = 'btn-clear'
                    onClick={toggleTheme}>
                    {theme === 'light' ?  '🔦' : '💡'}
                    </button>
                </nav>

            )}
        </ThemeConsumer>
    )
}