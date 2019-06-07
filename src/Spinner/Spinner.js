import React, { Component } from 'react';
import { Modal, Col } from 'react-bootstrap';

import progress from './progress.png';
import './Spinner.css';

class Spinner extends Component {

    render() {
        return (
            <Col sm={12}>
                <Modal className="process_modal" show={true}>
                    <Modal.Body className="process_modal_body">
                        <img id="rotate" src={progress} className="img_rotate" width="70px" height="70px" alt="" />
                    </Modal.Body>
                </Modal>
            </Col>
        );
    }
}

export default Spinner;
