import React from 'react'

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
  value: React.PropTypes.any.isRequired,
  onChangeValue: React.PropTypes.func.isRequired,
  optionValue: React.PropTypes.any.isRequired,
  label: React.PropTypes.string.isRequired
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
  value: React.PropTypes.any.isRequired,
  onChangeValue: React.PropTypes.func.isRequired,
  options: React.PropTypes.arrayOf(React.PropTypes.arrayOf(React.PropTypes.string.isRequired).isRequired).isRequired //[[name,value]]
}

export default Fieldset
