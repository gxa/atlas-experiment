import React from 'react'
import PropTypes from 'prop-types'

import {UnitType} from './PropTypes.js'
import Fieldset from './common/Fieldset.js'

const Unit = ({unit, available, onChangeUnit}) => (
  available.length === 1
    ? <div>{available[0]}</div>
    : <Fieldset value={unit}
      onChangeValue={onChangeUnit}
      options={available.map((n)=> [n,n])} />
)

Unit.propTypes = {
  unit: UnitType.isRequired,
  available: PropTypes.arrayOf(UnitType.isRequired).isRequired,
  onChangeUnit : PropTypes.func.isRequired
}

export default Unit
