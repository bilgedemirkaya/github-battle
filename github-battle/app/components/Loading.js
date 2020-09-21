import React from 'react'
import Proptypes from 'prop-types'

const styles = {
    content: {
      fontSize: '35px',
      marginTop: '20px',
      textAlign: 'center',
    }
  }

export default class Loading extends React.Component{
    constructor(props){
        super(props)

        this.state = {
            content: props.text
        }
    }
    componentDidMount(){
        const {text,speed} = this.props
        this.interval = window.setInterval(() => {
            this.state.content === text + '...' ? 
            this.setState({content: text}) :
            this.setState(({content}) => ({content: content + '.'}))
        
        },speed)
    }
    componentWillUnmount(){
        window.clearInterval(this.interval)
    }
    render(){
        return(
            <p style={styles.content}>
                {this.state.content}
            </p>
        )
    }
}

Loading.proptypes = {
text:Proptypes.string.isRequired,
speed:Proptypes.number.isRequired
}

Loading.defaultProps = {
    text:'Loading',
    speed:300,
}