import React from 'react'
import {FaUserFriends , FaFighterJet, FaTrophy,FaTimesCircle} from 'react-icons/fa'
import Proptypes from 'prop-types'
import Results from '../components/Results.js'

function Instructions(){
    return(
        <div className='instructor-container'>
        <h1 className='center-text header-lg'>
            Instructions
        </h1>
        <ol className='container-sm grid center-text battle-instructions'>
        <li>
          <h3 className='header-sm'>Enter two Github users</h3>
          <FaUserFriends className='bg-light' color='rgb(255, 191, 116)' size={140} />
        </li>
        <li>
          <h3 className='header-sm'>Battle</h3>
          <FaFighterJet className='bg-light' color='#727272' size={140} />
        </li>
        <li>
          <h3 className='header-sm'>See the winners</h3>
          <FaTrophy className='bg-light' color='rgb(255, 215, 0)' size={140} />
        </li>
        </ol>
        </div>
    )
}
class PlayerInput extends React.Component{
   constructor(props){
       super(props)
       this.state={
           username:''
       }
       this.handleSubmit = this.handleSubmit.bind(this)
       this.handleChange = this.handleChange.bind(this)

   }
   handleSubmit(event){
       event.preventDefault() // prevent from submitting 

       this.props.submitForm(this.state.username) // look at the state of username( whatever user typed in) 
       //call onSubmit function that passed as props.
   }
   handleChange(event){
       this.setState({
           username:event.target.value // whatever the user types set it as state of this component
       })
   }

    render() { 
        return(
    <form className='column player' onSubmit={this.handleSubmit}> 
       <label htmlFor='username' className='player-label'>
          {this.props.label}
        </label>
        <div className='row player-inputs'>
          <input
            type='text'
            id='username'
            className='input-light'
            placeholder='github username'
            autoComplete='off'
            value={this.state.username}
            onChange={this.handleChange}
          />
          <button
            className='btn dark-btn'
            type='submit'
            disabled={!this.state.username}
          >
            Submit
          </button>
        </div>
            </form>
        )

    }
}
PlayerInput.proptypes ={
    label: Proptypes.string.isRequired,
    onSubmit: Proptypes.func.isRequired

}

function PlayerPreview({username,label,onReset}){

    return(
        <div className='column player'>
        <h3 className='player-label'>{label}</h3>
        <div className='row bg-light'>
          <div className='player-info'>
            <img
              className='avatar-small'
              src={`https://github.com/${username}.png?size=200`}
              alt={`Avatar for ${username}`}
            />
            <a
              href={`https://github.com/${username}`}
              className='link'>
                {username}
            </a>
          </div>
          <button className='btn-clear flex-center' onClick={onReset /*clear the playerview*/}>
            <FaTimesCircle color='rgb(194, 57, 42)' size={26} />
          </button>
        </div>
      </div>
    )
}
PlayerPreview.proptypes ={
    label:Proptypes.string.isRequired,
    onReset:Proptypes.func.isRequired,
    username:Proptypes.string.isRequired
}
export default class Battle extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            playerOne : null,
            playerTwo : null,
            battle: false
        }
        this.handleSubmit = this.handleSubmit.bind(this)
        this.onReset = this.onReset.bind(this)
    }
    handleSubmit(id,player){
        this.setState({
            [id]: player
        })
    }
    onReset(id){
        this.setState({
            [id]: null
        })
    }
    render() {
        const {playerOne,playerTwo,battle} = this.state
        if (battle === true) {
            return(
                <React.Fragment>
                    <Results 
                    playerOne = {playerOne}
                    playerTwo = {playerTwo}
                    />
                </React.Fragment>
            )
        }

        return(
            <React.Fragment>
                <Instructions />
                <div className='players-container'>
                <h1 className='center-text header-lg'>Players</h1>
                 <div className='row space-around'>
                 {playerOne === null ? 
                 (<PlayerInput
                 submitForm = {(player) => this.handleSubmit('playerOne', player)} 
                 // when get the username and send it to handleSubmit function which will set the state of battle component.
                 label='Player One'/>      
                 ) : <PlayerPreview
                     username = {this.state.playerOne} 
                     label = 'Player One'
                     onReset = {() => this.onReset('playerOne')}
                 />} 
                {playerTwo === null ? (<PlayerInput
                 submitForm = {(player) => this.handleSubmit('playerTwo', player)} 
                 label='Player Two'
                 />):<PlayerPreview
                     username = {this.state.playerTwo} 
                     label = 'Player Two'
                     onReset = {() => this.onReset('playerTwo')}
                 />}
                 </div>
                 {playerOne && playerTwo && 
                 <button className='btn dark-btn btn-space'
                 onClick={()=>this.setState({battle:true})}> 
                 Battle 
                 </button> }
                 </div>
            </React.Fragment>
        )
    }

}