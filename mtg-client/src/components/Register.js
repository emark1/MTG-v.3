import React, { Component } from 'react';
import axios from 'axios'
import { connect } from 'react-redux'
import { setAuthenticationHeader } from '../utils/authenticate'
import { withRouter } from 'react-router'
import './CSS/Register.css';

class Register extends Component {
    constructor () {
        super() 
        this.state = {
            username: '',
            password: '',
            password2: '',
            email: '',
            error: '',
        }
    }


    handleTextBoxChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    handleRegisterClick = () => {
        if (this.state.password == '' || this.state.password2 == '') {
            console.log("Please enter two identical passwords")
        } else if (this.state.password != this.state.password2) {
            console.log("Passwords do not match")
        } else {
            // axios.post('https://trading-card-organizer.herokuapp.com/login',{
            axios.post('http://localhost:8080/register-user',{
                username: this.state.username,
                password: this.state.password,
                email: this.state.email
            }).then(response => {
                console.log("RESPONSE: " + response)
                let msg = response.data.message
                console.log("Client resopnse received: " + msg)
                this.props.history.push('/')
            }).catch(error =>
                window.alert(error.response.data.message))
        }
    }
    

    render() {
        return(
            <div className="Center"> 
                <input name="username" onChange={this.handleTextBoxChange} placeholder='Username'></input><br></br>
                <input name="password" type="password" onChange={this.handleTextBoxChange} placeholder='Password'></input><br></br>
                <input name="password2" type="password" onChange={this.handleTextBoxChange} placeholder='Repeat Password'></input><br></br>            
                <input name="email" onChange={this.handleTextBoxChange} placeholder='Email'></input><br></br>
                <button onClick={this.handleRegisterClick}>Register</button>
            </div> 
        )
    }
}

export default Register;