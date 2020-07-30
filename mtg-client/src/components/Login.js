import React, { Component } from 'react';
import axios from 'axios'
import { connect } from 'react-redux'
import { setAuthenticationHeader } from '../utils/authenticate'
import { withRouter } from 'react-router'
import {Link, NavLink} from 'react-router-dom'

class Login extends Component {
    constructor () {
        super() 
        this.onLogout = this.handleLoginClick.bind(this);
        this.state = {
            username: '',
            password: '',
        }
    }


    handleTextBoxChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    handleLoginClick = () => {
        // axios.post('https://trading-card-organizer.herokuapp.com/login',{
        axios.post('http://localhost:8080/login',{
            username: this.state.username,
            password: this.state.password
        }).then(response => {
            let token = response.data.token
            localStorage.setItem('jsonwebtoken',token)
            this.props.onAuthenticated(token)
            setAuthenticationHeader(token)
            this.props.history.push('/view-all-cards')
        }).catch(error => console.log(error))
    }
    

    render() {
        return(
            <div> 
                <input name="username" onChange={this.handleTextBoxChange} placeholder='Username'></input>
                <input name="password" type="password" onChange={this.handleTextBoxChange} placeholder='Password'></input>
                <button onClick={this.handleLoginClick}>Login</button>
                <div className="Text"><Link to="/register-user">New User? Register Here</Link></div>
            </div> 
        )
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
      onAuthenticated: (token) => dispatch({type: 'ON_AUTHENTICATED', token: token})
    }
  }

export default connect(null,mapDispatchToProps)(withRouter(Login))
