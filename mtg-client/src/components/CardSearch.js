import React,{Component} from 'react';
import './CSS/CardSearch.css';
import { connect } from 'react-redux'
import { Grid, Row, Col, Form, Button } from 'react-bootstrap';


export class CardSearch extends Component {
  constructor() {

    super()

    this.state = {
      cards: null,
      isUpdated:false,
      searchname: '',
      }
  }

  handleTextBoxChange = (e) => {
    this.setState({
        [e.target.name]: e.target.value
    })
  }

  populateCards = (event) => {
    event.preventDefault();
    event.stopPropagation();
    let name = this.state.searchname
    let url = `https://api.scryfall.com/cards/search?q=${name}&unique=cards&as=grid&order=name`
    fetch(url)
    .then(response => response.json())
    .then(json => {
        console.log("setting the state.")
        console.log(json.data)
      this.setState({cards: json.data})
    })
  }

  addClick(card) {
    let token = localStorage.getItem('jsonwebtoken') 
    fetch('http://localhost:8080/add-card/', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json'
        },
        body: JSON.stringify({card: card, token: token})
      })
    }

  render() {
    let cardItems = null
    if (this.state.cards){
    let cards = this.state.cards
    let filtered = cards.filter(card => card.image_uris);
    cardItems = filtered.map((card) => {
    
      return (
        <li className="Search_List">
        <p></p><img className="Search_Card" src={card.image_uris.png}/><p></p>
        <button onClick={() => this.addClick(card)}>Save to Collection</button>
        </li>
      )
    })
  }

  return (
        <div className="Search_Center_Content">
            <Form onSubmit={this.populateCards} className="Card_Search">
                <Row>
                    <Form.Group>
                        <Form.Label>Card</Form.Label>
                        <Form.Control placeholder="Enter Card Name" name="searchname" onChange={this.handleTextBoxChange} />
                    </Form.Group>
                    <Button variant="primary" type="submit">
                        Search
                    </Button>
                </Row>
            </Form>
        <ul className="UList">

        {cardItems}
        </ul>
      </div>
    )
  }
}