import React from 'react'

import URI from 'urijs'

import AutocompleteBox from './AutocompleteBox.jsx'

import {QueryObjectsPropTypes} from '../PropTypes.js'
import './tags.css'

const CommonPropTypes = {
  geneQuery: QueryObjectsPropTypes.geneQuery,
}

const Main = ({geneQuery, onChangeGeneQuery, geneSuggesterUri}) => (
  <div>
    {geneQuery.map(({value} )=> (
          <span key={value} className="tag gxaTag">
            <span>
                {value}
            </span>
              <span style={{color: "grey",marginLeft: "0.2rem", position:"relative", cursor: "pointer"}} aria-hidden="true"
              onClick={()=>{
                onChangeGeneQuery(
                  geneQuery.filter(term => term.value !== value)
                )}}>
                ✖
              </span>
          </span>
        ))
      }
    <AutocompleteBox
      geneSuggesterUri={geneSuggesterUri}
      valuesToSkipInSuggestions={geneQuery.map(({value})=>value)}
      onGeneChosen={(newGene)=> onChangeGeneQuery(
        [].concat(geneQuery, [{value: newGene}])
      )} />
  </div>
)

Main.propTypes = {
  ...CommonPropTypes,
  onChangeGeneQuery: React.PropTypes.func.isRequired,
  geneSuggesterUri: React.PropTypes.instanceOf(URI)
}

export default Main
