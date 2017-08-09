import React from 'react'
import ReactTable from 'react-table'
import 'react-table/react-table.css'
import './react-table-custom.css'
import {uniq, curry} from 'lodash'
import toPlural from 'pluralize'
import TablePropTypes from './ExperimentDesignTablePropTypes.js'

//http://stackoverflow.com/questions/196972/convert-string-to-title-case-with-javascript
const toTitleCase = (str) => str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});

const aggregateText = (name, vals) => {
  const xs = uniq(vals)
  return (
    xs.length === 1 || (xs.length < 5 && xs.join(", ").length < 30)
    ? xs.join(", ")
    : toPlural(name.toLowerCase() , xs.length, true)
  )
}

const ExperimentDesign = ({
  data,
  headers,
  options={}
}) => (
  <ReactTable
    columns={
      headers.map((headerGroup,ix)=> (
        {
          header: headerGroup.name,
          columns:
            headerGroup.values.map((header, jx) => ({
              aggregate: curry(aggregateText, 2)(header),
              header: header,
              id: ix*1000 +jx +1,
              accessor: r => r.values[ix][jx],
            }))
        }
      ))
    }
    className="-striped"
    style={{
      fontSize: "small",
      padding: "7px 0px",
      height: "100%",

    }}
    data={data}
    {...options}
  />
)

const BaselineExperimentDesign = ({
  data,
  headers
}) => (
  ExperimentDesign({
    data:
      data
      .map(({properties, values}) => ({
        values: [[properties.analysed? "Yes" : "No"]].concat(values)
      })),
    headers:
      [{name:"", values: ["Analysed"]}].concat(headers)
    })
)

const DifferentialExperimentDesign = ({
  data,
  headers
}) => (
  ExperimentDesign({
    data:
      data.map(({properties, values}) => ({
      values: [[properties.contrastName || "N/A", toTitleCase(properties.referenceOrTest || "")]].concat(values)
    })),
    headers: [{name: "", values: ["Contrast", "Reference/Test"]}].concat(headers),
    options: {
      pivotBy: [1]
    }
  })
)


BaselineExperimentDesign.propTypes = TablePropTypes
DifferentialExperimentDesign.propTypes = TablePropTypes
ExperimentDesign.propTypes = TablePropTypes

export {BaselineExperimentDesign, DifferentialExperimentDesign}
