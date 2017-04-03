import React from 'react'
import {RegulationType} from './PropTypes.js'
import Fieldset from './common/Fieldset.jsx'

const Regulation = ({regulation,onChangeRegulation}) => (
  <Fieldset value={regulation}
    onChangeValue={onChangeRegulation}
    options={[
      ["UP_DOWN", "Any regulation"],
      ["UP", "Up-regulated only"],
      ["DOWN", "Down-regulated only"]
    ]} />
)

Regulation.propTypes = {
  regulation: RegulationType.isRequired,
  onChangeRegulation : React.PropTypes.func.isRequired
}

export default Regulation
