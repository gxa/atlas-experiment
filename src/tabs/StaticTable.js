import React from 'react'
import PropTypes from 'prop-types'

const Table = ({data}) => (
  <div className="row column expanded">
    <table>
      <tbody>
        {
          data.map((row, ix) => (
            <tr key={ix}>
              {
                row.map( (el,jx) => (
                  <td key={jx}>
                    <div dangerouslySetInnerHTML={{__html: el}} />
                  </td>
                ))
              }
            </tr>
          ))
        }
      </tbody>
    </table>
  </div>
)

Table.propTypes = {
  data: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string)).isRequired
}

export default Table
