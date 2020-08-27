import React, {Component} from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import './CSS/CardModal.css';

class CardModal extends Component {
    constructor() {
        super()
        this.state = {
            show: false
        }
    }

    // const [show, setShow] = useState(false);
  
    // handleClose = () => setShow(false);
    // handleShow = () => setShow(true);

    handleClose() {
        this.setState({
            show: false
        })
    }

    handleShow() {
        this.setState({
            show: true
        })
    }

  
    render() {
        return (
        <div>
            <img className="Card" src={this.props.img} onClick={() => this.handleShow()}/>
    
            <Modal
            className="background"
            show={this.state.show}  
            onHide={() => this.handleClose()}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
             > 
            <Modal.Header class="p-3 mb-2 bg-dark">
                <Modal.Title class="p-3 mb-2 bg-dark text-white">Modal heading</Modal.Title>
            </Modal.Header>
            <Modal.Body class="p-3 mb-2 bg-dark text-white">{this.props.price}</Modal.Body>
            <Modal.Footer class="p-3 mb-2 bg-dark text-white">
                <Button variant="secondary" onClick={() => this.handleClose()}>
                Close
                </Button>
                <Button variant="primary" onClick={() => this.handleClose()}>
                Save Changes
                </Button>
            </Modal.Footer>
            </Modal>
        </div>
        );
    }

}

export default CardModal