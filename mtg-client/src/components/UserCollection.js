import React, {Component} from 'react';
import './CSS/UserCollection.css';
import Mana_B from './Mana Icons/Mana_B.png'
import Mana_G from './Mana Icons/Mana_G.png'
import Mana_W from './Mana Icons/Mana_W.png'
import Mana_R from './Mana Icons/Mana_R.png'
import Mana_U from './Mana Icons/Mana_U.png'
import axios from 'axios'

export class CardList extends Component {
    constructor() {

        super()
    
        this.state = {
          //cards will be an array filled with objects sent from the server
          cards: [],
          filteredCards: [],
          originalCards: [],
          active: false,
          name: '',
          cardid: '',
          imageuripng: '',
          artist: '',
          cmc: '',
          rarity: '',
          power: '',
          price: 0,
          value: null,
          color: '',
          coloridentity: '',

          isUpdated:false
          }
      }



    populateCards() {
    console.log("Generating card collection!")
    let url = 'http://localhost:8080/api/cards'
    let token = localStorage.getItem('jsonwebtoken')
    // fetch(url)
    // .then(response => response.json())
    // .then(json => {
    //     console.log("setting the state.")
    //     this.setState({
    //     //Sets value of the cards array in the state to the json
    //     cards: json,
    //     originalCards: json
    //         })
    //     })
        axios.post(url, {
            token: token
        })
        .then(response => {
            console.log(response)
            this.setState({
                cards: response.data,
                originalCards: response.data
            })
        })
        // .then(response => response.json())
        // .then(json => {
        //     this.setState({
        //         cards: json,
        //         originalCards: json
        //     })
        // })
    }

    generatePrice() {
        console.log("Generating price!")
        let url = 'http://localhost:8080/api/cards/price'
        fetch(url)
        .then(response => response.json())
        .then(json => {
            console.log("setting the state.")
            this.setState({
            //Sets value of the cards array in the state to the json
            value: json
                })
            })
        }
    
    getTotalValue() {
        console.log("Updating value")
        let newValue = 0;
        this.state.cards.forEach(card => {
            //newValue += card.price
            console.log("Name: " + card.name)
            console.log(Number.parseFloat(card.price))
            newValue += Number.parseFloat(card.price);
        })
        console.log("New value: " + newValue)
        // if(newValue != this.state.value) {
        this.setState({value: newValue})
        //}
    }

    setInitialValue() {
        this.setState({value: 0})
    }

    componentDidMount() {
        this.populateCards()
        this.setInitialValue()
        //this.updateValue()
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.cards !== this.state.cards) {
            this.getTotalValue()
        }
    }


    deleteClick(card) {
        fetch('http://localhost:8080/api/cards/delete', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify({idcard:card.id})
        }).then(() => {
            this.populateCards()
        })
        
    }

    filterCards(colorfilter) {
        // this.populateCards().then(function() {
            let cards = this.state.originalCards
            let filteredCards = cards.filter(function(card) {
                if(card.color.includes(colorfilter)) return card
            })
            this.setState({
            cards: filteredCards
            })
        // })
    }

    resetCards() {
        let cards = this.state.originalCards
        this.setState({
            cards: cards
        })
    }

    render() {
        let cards = this.state.cards
        let cardItems = cards.map((card) => {

          return (

            <li className="List">
            <img className="Card" src={card.imageuripng}/><p></p><span className="Text">Price: ${card.price}</span><button onClick={() => this.deleteClick(card)}>Delete Card</button></li>
          )
        })
        return (
            <div>
            <h1 className="Text">Collection Value: ${this.state.value}</h1>
            <li className="ColorList">
                <img onClick={() => this.filterCards("B")} className="ColorImages" src={Mana_B}/>
                <img onClick={() => this.filterCards("W")} className="ColorImages" src={Mana_W}/>
                <img onClick={() => this.filterCards("R")} className="ColorImages" src={Mana_R}/>
                <img onClick={() => this.filterCards("U")} className="ColorImages" src={Mana_U}/>
                <img onClick={() => this.filterCards("G")} className="ColorImages" src={Mana_G}/>
                <button onClick={() => this.resetCards()}>Reset Colors</button>
            </li>
            <ul className="UList">{cardItems}</ul>
            </div>
        )
    }
}