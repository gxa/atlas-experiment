import React from 'react'
import {QueryObjectsPropTypes} from '../PropTypes.js'
import AutocompleteBox from './AutocompleteBox.jsx'
require("./tags.css")

const CommonPropTypes = {
  geneQuery: QueryObjectsPropTypes.geneQuery,
}

const Main = ({geneQuery, onChangeGeneQuery, geneSuggesterUrlTemplate}) => (
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
      suggesterUrlTemplate={geneSuggesterUrlTemplate}
      valuesToSkipInSuggestions={geneQuery.map(({value})=>value)}
      onGeneChosen={(newGene)=> onChangeGeneQuery(
        [].concat(geneQuery, [{value: newGene}])
      )} />
  </div>
)

Main.propTypes = Object.assign({}, CommonPropTypes, {
  onChangeGeneQuery: React.PropTypes.func.isRequired
})

export default Main
