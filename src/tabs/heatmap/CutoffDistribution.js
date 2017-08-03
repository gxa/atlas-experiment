import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-refetch'
import ReactHighcharts from 'react-highcharts'

import {CutoffType, UnitType} from './PropTypes.js'

const cumulativeDistributionPoints= ({bins, counts}) => {
  return bins
    .map((bin, ix) => ({x: bin, y: counts.slice(ix).reduce((v, acc) => v + acc, 0)}))
    .filter(v => v.x > 0 && v.y > 0); // Remove first bin for the logarithmic chart, otherwise Highcarts complains
}

const CutoffDistribution = ({unit, cutoff, onChangeCutoff, histogram}) => (
  <div>
  {`Current value: ${cutoff.value}${unit ? ` ${unit}`: ""}` }
  <ReactHighcharts
    config={{
      title: ``,
      xAxis: {
        title: {
          text: `Cutoff value`
        },
        type: `logarithmic`
      },
      yAxis: {
        title: {
          text: `# genes`
        },
      },
      type: `line`,
      series:[{
        cursor: `pointer`,
        name: `Genes expressed in this experiment at value higher than cutoff`,
        data: cumulativeDistributionPoints(histogram),
      }],
      tooltip: {
        useHTML: true,
        formatter: function() {
          return `<div>Cutoff: <b> ${this.x}</b> (${this.y} genes past this cutoff)</div>`
        }
      },
      credits: {
        enabled: false
      },
    }} />
  </div>
)

CutoffDistribution.propTypes = {
  cutoff: CutoffType,
  //onChangeCutoff: PropTypes.func.isRequired,
  unit: UnitType.isRequired,
  histogram: PropTypes.shape({
    bins: PropTypes.arrayOf(PropTypes.number.isRequired).isRequired,
    counts: PropTypes.arrayOf(PropTypes.number.isRequired).isRequired
  })
}

class CutoffDistributionLoader extends Component {
  render() {
    const { genesDistributedByCutoffFetch , loadingGifUrl, cutoff, onChangeCutoff, unit} = this.props

    if (genesDistributedByCutoffFetch.pending) {
      return <img src={loadingGifUrl}/>
    } else if (genesDistributedByCutoffFetch.rejected) {
      return (
        <div>
        Error: {genesDistributedByCutoffFetch.reason}
        </div>
      )
    } else if (genesDistributedByCutoffFetch.fulfilled) {
      return (
        <CutoffDistribution
        histogram={genesDistributedByCutoffFetch.value}
        {...{cutoff, onChangeCutoff,unit}} />
      )
    }
  }
}

export default connect(props => ({
  genesDistributedByCutoffFetch: props.genesDistributedByCutoffUrl
}))(CutoffDistributionLoader)
