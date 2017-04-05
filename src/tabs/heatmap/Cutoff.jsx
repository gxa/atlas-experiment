import React from 'react'
import {CutoffType} from './PropTypes.js'
import NumericInput from 'react-numeric-input'

const settingsFor = (cutoffName) => (
  Object.assign(
    cutoffName === 'foldChange'
    ? {}
    : {min: 0}
    ,
    cutoffName === 'pValue'
    ? {step: 0.01}
    : {step: 1.0}
    ,
    cutoffName === 'pValue'
    ? {precision: 2}
    : {precision: 1},
    cutoffName === 'pValue'
    ? {max: 1}
    : {}
  )
)



const keyValuePair = (key, value) => {
  const result = {}
  result[key] = value
  return result
}

const cutoffDisplayName = (cutoffName) => {
  switch(cutoffName){
    case "value":
      return (
        "Expression value"
      )
    case "pValue":
      return (
        "Adjusted p-value"
      )
    case "foldChange":
      return (
        <span>
          Log<sub>2</sub>-fold change
        </span>
      )
    default:
      return (
        cutoffName
      )
  }
}

const Cutoff = ({cutoff, onChangeCutoff}) => (
  <div>
    {Object.keys(cutoff).map((cutoffName) => (
      <div key={cutoffName}>
        <div>
          {cutoffDisplayName(cutoffName)}
        </div>
        <NumericInput
          className="form-control"
        value={cutoff[cutoffName]}
          {...settingsFor(cutoffName)}
          onChange={(valueAsNumber) => (
            valueAsNumber!==null && onChangeCutoff(Object.assign({},
              cutoff,
              keyValuePair(cutoffName, valueAsNumber)
            ))
          )}
        />
      </div>
    ))
    }
  </div>
)

Cutoff.propTypes = {
  cutoff: CutoffType.isRequired,
  onChangeCutoff : React.PropTypes.func.isRequired
}

export default Cutoff
