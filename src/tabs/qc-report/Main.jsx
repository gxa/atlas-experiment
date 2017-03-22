import React from 'react'
import {withRouter} from 'react-router'
import {Modal, Button, Glyphicon} from 'react-bootstrap/lib'

const chooseReportDropdown = (options,chosen, onChooseReport) => (
  <select value={chosen} onChange={(event) => onChooseReport(event.target.value)}>
    {
      options.map((value)=> (
        <option key = {value} value={value}>
          {value}
        </option>
      ))
    }
  </select>
)

const Report = ({query, router, reports}) => {

  const chosenReport = reports.find((report) => report.name == query.report) || reports[0]

  return (
  <div>
    { reports.length > 1 &&
        chooseReportDropdown(
          reports.map((report)=> report.name),
          chosenReport.name,
          (report) => {
            router.push(Object.assign({},
              router.location, {query: {report}}
            ))
          }
        )
    }
    <iframe
      name={chosenReport.name}
      src={chosenReport.url}
      style={{
        width:"100%",
        height:1000,
        border:0
      }} />
  </div>
)}

Report.propTypes = {
  query: React.PropTypes.shape({
    report: React.PropTypes.string
  }),
  router: React.PropTypes.object.isRequired,
  reports: React.PropTypes.arrayOf(React.PropTypes.shape({
    name: React.PropTypes.string.isRequired,
    url: React.PropTypes.string.isRequired
  })).isRequired
}

export default withRouter(Report)
