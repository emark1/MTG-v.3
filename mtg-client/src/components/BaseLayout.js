import React, {Component} from 'react';
import {Link, NavLink} from 'react-router-dom'
import './CSS/BaseLayout.css';
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { Grid, Row, Col, Form, Button, Navbar, Nav, FormControl } from 'react-bootstrap';

class Menu extends Component {

    handleLogoutClick = () => {
        localStorage.removeItem('jsonwebtoken')
        this.props.logout()
        this.props.history.push('/')
    }

    render() {
        return (
            // <ul className="menu">
            //     <li className="Text"><NavLink to="/">Home</NavLink></li>
            //     <li className="Text"><Link to="/view-all-cards">View Your Collection</Link></li>
            //     <li className="Text"><Link to="/card-search">Search For Cards</Link></li>
            //     {this.props.isAuthenticated ? <li><button onClick={this.handleLogoutClick}>Logout</button></li>: null }
            // </ul>
            <Navbar bg="dark" variant="dark">
            <Navbar.Brand to="/">Navbar</Navbar.Brand>
            <Nav className="mr-auto">
                <Nav.Link to="/view-all-cards">Collection</Nav.Link>
                <Nav.Link href="/view-all-cards">Card Database</Nav.Link>
            </Nav>
            {this.props.isAuthenticated ? <Button variant="outline-info" onClick={this.handleLogoutClick}>Logout</Button> : null }
        </Navbar>
        )
    }
}

export class Footer extends Component {
    render() {
        return (
            // <div className="footer"><span className="Text">Copyright Eric DeVelder</span></div>
            <div>

            </div>
        )
    }
}

export class BaseLayout extends Component {
    render() {
        return (
            <div>
                <Menu isAuthenticated={this.props.isAuthenticated} logout={this.props.onLogout} history={this.props.history} />
                    {this.props.children}
                <Footer />
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        isAuthenticated: state.isAuthenticated
    }
}
const mapDispatchToProps = (dispatch) => {
  return {
    onLogout: () => dispatch({type: 'LOGOUT'})
  }
}
export default connect(mapStateToProps,mapDispatchToProps)(withRouter(BaseLayout))