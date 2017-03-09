import React from 'react'
import ReactTable from 'react-table'
import 'react-table/react-table.css'

/*
- do or do not gray out the non-analysed rows? maybe cursive them or something? maybe do add extra column?
- provide a "style" object instead?
*/

const ExperimentDesign = ({
  data,
  headers
}) => (
  <ReactTable
    columns={
      headers.map((headerGroup,ix)=> ({
        header: headerGroup.name,
        columns: headerGroup.values.map((header, jx) => ({
          header: header,
          id: ix*1000 +jx +1,
          accessor: r => r.values[ix][jx]
        }))
      }))
    }
    data={data}
  />
)

const BaselineExperimentDesign = ({
  showAnalysedOnly,
  data,
  headers
}) => (
  ExperimentDesign({
    data:
      data.filter(({properties, values}) => (
      ! showAnalysedOnly || properties.analysed
    )).map(({properties, values}) => ({
      colour: properties.analysed ? "" : "gray",
      values: values
    })),
    headers})
)

const DifferentialExperimentDesign = ({
  contrastToShow,
  data,
  headers
}) => (
  ExperimentDesign({
    data:
      data.filter(({properties, values}) => (
      true || properties.contrastName === contrastToShow //TODO
    )).map(({properties, values}) => ({
      colour: {"reference": "#FFC266" , "test" : "#82CDCD"}[properties.referenceOrTest] || "",
      values: values
    })),
    headers})
)

const commonPropTypes = {
  data: React.PropTypes.arrayOf(React.PropTypes.shape({
    properties: React.PropTypes.oneOfType([
      React.PropTypes.shape({
          analysed: React.PropTypes.bool.isRequired
        }).isRequired,
      React.PropTypes.shape({
          contrastName: React.PropTypes.string.isRequired,
          referenceOrTest: React.PropTypes.oneOf(["reference", "test", ""])
        }).isRequired
    ]),
    colour: React.PropTypes.string.isRequired,
    values: React.PropTypes.arrayOf(React.PropTypes.arrayOf(React.PropTypes.string.isRequired).isRequired).isRequired
  }).isRequired).isRequired,
  headers: React.PropTypes.arrayOf(React.PropTypes.shape({
    name: React.PropTypes.string.isRequired,
    values: React.PropTypes.arrayOf(React.PropTypes.string.isRequired).isRequired
  }).isRequired).isRequired
}
BaselineExperimentDesign.propTypes = commonPropTypes
DifferentialExperimentDesign.propTypes = commonPropTypes
ExperimentDesign.propTypes = commonPropTypes

const ExperimentDesignTab = ({
  isDifferential,
  data,
  headers
}) => (
  isDifferential
  ? DifferentialExperimentDesign(Object.assign({contrastToShow:""}, {data,headers})) //TODO
  : BaselineExperimentDesign({data,headers})
)

ExperimentDesignTab.propTypes = {
  isDifferential : React.PropTypes.bool.isRequired,
  table: React.PropTypes.shape(commonPropTypes)
}

export default ExperimentDesignTab;
