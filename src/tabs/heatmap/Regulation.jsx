import React from 'react'
import {RegulationType} from './PropTypes.js'
import {DropdownButton,MenuItem} from 'react-bootstrap/lib'


const menuText = {
  "UP_DOWN" : "Any regulation",
  "UP" : "Up-regulated only",
  "DOWN" : "Down-regulated only"
}

const menuItem = (regulation, key) => (
  <MenuItem eventKey={key} active={key === regulation}>
    {menuText[key]}
  </MenuItem>
)


const Regulation = ({regulation, onChangeRegulation}) => (
  <DropdownButton
    title={menuText[regulation]}
    id={"regulation-dropdown"}
    onSelect={onChangeRegulation}>
    {menuItem(regulation, "UP_DOWN")}
    {menuItem(regulation, "UP")}
    {menuItem(regulation, "DOWN")}
  </DropdownButton>
)

Regulation.propTypes = {
  regulation: RegulationType.isRequired,
  onChangeRegulation : React.PropTypes.func.isRequired
}

export default Regulation
