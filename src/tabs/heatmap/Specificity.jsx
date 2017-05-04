import React from 'react'
import Checkbox from './Checkbox.jsx'
import {QueryObjectsPropTypes} from './PropTypes.js'

const Specificity = ({specific, onChangeSpecific}) => (
    <Checkbox value={specific}
              onChangeValue={onChangeSpecific}/>
);

Specificity.propTypes = {
  specific: QueryObjectsPropTypes.specific,
  onChangeSpecific : React.PropTypes.func.isRequired
};

export default Specificity;
