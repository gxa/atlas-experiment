import React from 'react'
import {UnitType} from './PropTypes.js'
import Fieldset from './common/Fieldset.jsx'

const Unit = ({unit, available, onChangeUnit}) => (
  available.length === 1
  ? <div>{available[0]}</div>
  : <Fieldset value={unit}
      onChangeValue={onChangeUnit}
      options={available.map((n)=> [n,n])} />
)

Unit.propTypes = {
  unit: UnitType.isRequired,
  available: React.PropTypes.arrayOf(UnitType.isRequired).isRequired,
  onChangeUnit : React.PropTypes.func.isRequired
}

export default Unit
