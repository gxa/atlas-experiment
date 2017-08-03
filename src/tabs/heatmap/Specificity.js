import React from 'react'
import PropTypes from 'prop-types'
import Checkbox from './Checkbox.js'
import {QueryObjectsPropTypes} from './PropTypes.js'

const Specificity = ({specific, onChangeSpecific}) => (
    <Checkbox value={specific}
              onChangeValue={onChangeSpecific}/>
);

Specificity.propTypes = {
  specific: QueryObjectsPropTypes.specific,
  onChangeSpecific : PropTypes.func.isRequired
};

export default Specificity;
