import React from 'react'
import {RegulationType} from './PropTypes.js'

const menuText = {
  "UP_DOWN" : "Any regulation",
  "UP" : "Up-regulated only",
  "DOWN" : "Down-regulated only"
}

const menuItem = ({regulation, onChangeRegulation}, key) => (
  <div>
    <input
      style={{margin:"0px"}}
      type="radio"
      name={`regulation ${key}`}
      value={key}
      checked={key==regulation}
      id={`regulation ${key}`}
      onChange={key==regulation || (()=>{onChangeRegulation(key)})}
      />
    <label htmlFor={`regulation ${key}`}>
      {menuText[key]}
    </label>
  </div>
)


const Regulation = (props) => (
  <fieldset className="fieldset" style={{padding:"0.25rem"}}>
    {menuItem(props, "UP_DOWN")}
    {menuItem(props, "UP")}
    {menuItem(props, "DOWN")}
  </fieldset>
)

Regulation.propTypes = {
  regulation: RegulationType.isRequired,
  onChangeRegulation : React.PropTypes.func.isRequired
}

export default Regulation
