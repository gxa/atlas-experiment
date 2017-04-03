import React from 'react'
import Fieldset from './common/Fieldset.jsx'
import {QueryObjectsPropTypes} from './PropTypes.js'

const Specificity = ({specific,onChangeSpecific}) => (
  <Fieldset value={specific}
    onChangeValue={onChangeSpecific}
    options={[
      [true, "Most specific first"],
      [false, "Highest expression first"]
    ]} />
)

Specificity.propTypes = {
  specific: QueryObjectsPropTypes.specific,
  onChangeSpecific : React.PropTypes.func.isRequired
}

export default Specificity
