import React from 'react'
import PropTypes from 'prop-types'

const MenuItem = ({value, onChangeValue, optionValue, label}) => (
  <div>
    <input
      style={{margin:"0px"}}
      type="radio"
      name={`menu-item-${optionValue}`}
      value={optionValue}
      checked={optionValue==value}
      id={`menu-item-${optionValue}`}
      onChange={optionValue==value ? ()=>{} : (()=>{onChangeValue(optionValue)})}
      />
    <label htmlFor={`menu-item-${optionValue}`}>
      {label}
    </label>
  </div>
)

MenuItem.propTypes = {
  value: PropTypes.any.isRequired,
  onChangeValue: PropTypes.func.isRequired,
  optionValue: PropTypes.any.isRequired,
  label: PropTypes.string.isRequired
}


const Fieldset = (props) => (
  <fieldset className="fieldset" style={{padding:"0.25rem"}}>
    {
      props.options.map((option) => (
        <MenuItem key={option[1]} optionValue={option[0]} label={option[1]} {...props} />
      ))
    }
  </fieldset>
)

Fieldset.propTypes = {
  value: PropTypes.any.isRequired,
  onChangeValue: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.any.isRequired).isRequired).isRequired //[[name,value]]
}

export default Fieldset
