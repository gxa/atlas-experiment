import React from 'react'
import PropTypes from 'prop-types'

import {RegulationType} from './PropTypes.js'
import Fieldset from './common/Fieldset.js'

const Regulation = ({regulation,onChangeRegulation}) => (
  <Fieldset value={regulation}
    onChangeValue={onChangeRegulation}
    options={[
      [`UP_DOWN`, `Up- or downregulated`],
      [`UP`, `Upregulated only`],
      [`DOWN`, `Downregulated only`]
    ]} />
)

Regulation.propTypes = {
  regulation: RegulationType.isRequired,
  onChangeRegulation : PropTypes.func.isRequired
}

export default Regulation
