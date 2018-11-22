import React from 'react'
import PropTypes from 'prop-types'
import sanitizeHtml from 'sanitize-html'
import URI from 'urijs'

import AutocompleteBox from './AutocompleteBox.js'

import {QueryObjectsPropTypes} from '../PropTypes.js'
import './tags.css'

const noTags = {
  allowedTags:[],
  allowedAttributes:[]
}

const Main = ({geneQuery, onChangeGeneQuery, geneSuggesterUri}) => (
  <div style={{overflowWrap: `break-word`}}>
    {geneQuery.map( ({value, category}) =>
      <span key={value + `` + category} className="gxaTag">
        <span title={
          category
            ? `${value} (${category})`
            : value
        }>
          {value}
        </span>
        <span style={{marginLeft: `0.2rem`, position:`relative`, cursor: `pointer`}} aria-hidden="true"
          onClick={()=>{onChangeGeneQuery(geneQuery.filter(term => term.value !== value))}}>✖</span>
      </span>
    )}

    <AutocompleteBox
      geneSuggesterUri={geneSuggesterUri}
      valuesToSkipInSuggestions={geneQuery.map( ({value}) => value )}
      onGeneChosen={
        newGene =>
          onChangeGeneQuery([...geneQuery, {value: sanitizeHtml(newGene.value, noTags), category: newGene.category}])
      }
    />
  </div>
)

Main.propTypes = {
  geneQuery: QueryObjectsPropTypes.geneQuery,
  onChangeGeneQuery: PropTypes.func.isRequired,
  geneSuggesterUri: PropTypes.instanceOf(URI)
}

export default Main
