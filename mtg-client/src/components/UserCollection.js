import React, {Component} from 'react';
import './CSS/UserCollection.css';
import Mana_B from './Mana Icons/Mana_B.png';
import Mana_G from './Mana Icons/Mana_G.png';
import Mana_W from './Mana Icons/Mana_W.png';
import Mana_R from './Mana Icons/Mana_R.png';
import Mana_U from './Mana Icons/Mana_U.png';
import axios from 'axios';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import CardModal from './CardModal'

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
            newValue += Number.parseFloat(card.price);
        })
        newValue = newValue.toFixed(2)
        this.setState({value: newValue})
    }

    setInitialValue() {
        this.setState({value: 0})
    }

    componentDidMount() {
        this.populateCards()
        this.setInitialValue()
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
        let cards = this.state.originalCards
        let filteredCards = cards.filter(function(card) {
            if(card.color.includes(colorfilter)) return card
        })
        this.setState({
        cards: filteredCards
        })
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
            <li>
                <CardModal
                    img={card.imageuripng}
                    price={card.price}
                    name={card.name}
                    cardid={card.cardid}
                    artist={card.artist}
                    cmc={card.cmc}
                    rarity={card.rarity}
                    power={card.power}
                    value={card.value}
                    color={card.color}
                    coloridentity={card.coloridentity}
                />
            </li>

            // {/* <li className="List">
            // <img className="Card" src={card.imageuripng} />
            // <p></p>
            // <span className="Text">Price: ${card.price}</span><button onClick={() => this.deleteClick(card)}>Delete Card</button></li> */}
        )
    })

    return (
        <div>
            <CardModal name="Eric" />
            <h1 className="Text">Collection Value: ${this.state.value}</h1>
            <div className="ColorList">
                <img onClick={() => this.filterCards("B")} className="ColorImages" src={Mana_B}/>
                <img onClick={() => this.filterCards("W")} className="ColorImages" src={Mana_W}/>
                <img onClick={() => this.filterCards("R")} className="ColorImages" src={Mana_R}/>
                <img onClick={() => this.filterCards("U")} className="ColorImages" src={Mana_U}/>
                <img onClick={() => this.filterCards("G")} className="ColorImages" src={Mana_G}/>
                <div>
                    <button onClick={() => this.resetCards()}>Reset Colors</button>
                </div>
            </div>
            <ul className="UList">
                {cardItems}
            </ul>
            {/* <MyVerticallyCenteredModal
                show={modalShow}
                onHide={() => setModalShow(false)}
            /> */}
        </div>
    )
    }
}