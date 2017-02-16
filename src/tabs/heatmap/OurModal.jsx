import React from 'react'

const Modal = require(`react-bootstrap/lib/Modal`);
const Button = require(`react-bootstrap/lib/Button`);
const Glyphicon = require(`react-bootstrap/lib/Glyphicon`);

const OurModal = React.createClass({
  propTypes: {
    onClickApply: React.PropTypes.func.isRequired,
    onClickClose: React.PropTypes.func.isRequired
  },

  getInitialState() {
    return {
      showModal: false
    }
  },
  _close() {
    this.props.onClickClose()
    this.setState({ showModal: false});
  },

  _apply() {
    this.props.onClickApply()
    this.setState({ showModal: false })
  },

  _open() {
    this.setState({ showModal: true })
  },

  render(){
    return (
      <div>
          <Button bsSize="small" onClick={this._open}
                  style={{textTransform: `unset`, letterSpacing: `unset`, height: `unset`}}>
              <Glyphicon glyph="equalizer"/>
              <span style={{verticalAlign: `middle`}}> Filters</span>
          </Button>

          <Modal show={this.state.showModal} onHide={this._close} bsSize="large">
              <Modal.Header closeButton>
                  <Modal.Title>Filters</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                {
                  this.props.children
                }
              </Modal.Body>
              <Modal.Footer>
                  <Button bsStyle="primary" onClick={this._apply}
                          style={{textTransform: `unset`, letterSpacing: `unset`, height: `unset`}}>Apply</Button>
                  <Button onClick={this._close}
                          style={{textTransform: `unset`, letterSpacing: `unset`, height: `unset`}}>Close</Button>
              </Modal.Footer>
          </Modal>
      </div>
    )
  }
})

export default OurModal
