import React from 'react'

import URI from 'urijs'

import AutocompleteBox from './AutocompleteBox.jsx'

import {QueryObjectsPropTypes} from '../PropTypes.js'
import './tags.css'

const Main = ({geneQuery, onChangeGeneQuery, geneSuggesterUri}) => (
  <div>
    {geneQuery.map( ({value, category}) =>
      <span key={value + "" + category} className="tag gxaTag">
        <span title={
          category
            ? `${value} (${category})`
            : value
        }>
          {value}
        </span>
        <span style={{marginLeft: "0.2rem", position:"relative", cursor: "pointer"}} aria-hidden="true"
              onClick={()=>{onChangeGeneQuery(geneQuery.filter(term => term.value !== value))}}>✖</span>
      </span>
    )}

    <AutocompleteBox
      geneSuggesterUri={geneSuggesterUri}
      valuesToSkipInSuggestions={geneQuery.map( ({value}) => value )}
      onGeneChosen={newGene => onChangeGeneQuery([].concat(geneQuery, [newGene]))}
    />
  </div>
)

Main.propTypes = {
  geneQuery: QueryObjectsPropTypes.geneQuery,
  onChangeGeneQuery: React.PropTypes.func.isRequired,
  geneSuggesterUri: React.PropTypes.instanceOf(URI)
}

export default Main
