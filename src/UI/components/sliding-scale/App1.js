import React from 'react';
import * as Records from '../../records/records';
import * as Constants from '../../utils/constants';
import { connect } from 'react-redux';
import { Modal, Popover, Tooltip, OverlayTrigger, Button, closeButton } from 'react-bootstrap';
import { render } from 'react-dom';
import App from './App';
require('react-bootstrap');


const openClose = dispatch => dispatch({ type: Constants.SLIDING_SCALE_TOGGLE_VISIBILITY });

const modal = {
  display: 'none',
  position: 'fixed',
  zIndex: '1',
  left: '0',
  top: '0',
  width: '100%',
  height: '100%', /* Full height */
  overflow: 'auto', /* Enable scroll if needed */
  backgroundColor: 'rgba(0,0,0,0.4)'
};

const popover = () => (
  <Popover id="modal-popover" title="popover">
    very popover. such engagement
      </Popover>
);

const tooltip = () => (
  <Tooltip id="modal-tooltip">
    wow.
      </Tooltip>
);

const Example = ({slidingScale, dispatch}) => {
  const toggle = openClose.bind(null, dispatch);
  return (
    <div>
      <Modal dialogClassName="custom-modal" show={slidingScale.visible} onHide={toggle} style={modal}>
        <Modal.Header closeButton>
          <Modal.Title>Modal heading</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <App />
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={toggle}>Close</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}


export default connect(state => ({
  dispatch: state.dispatch,
  slidingScale: state.slidingScale
}))(Example);


