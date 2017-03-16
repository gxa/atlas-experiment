import React from 'react'

const Table = ({data}) => (
  <table>
    <tbody>
      {
        data.map(row => (
          <tr>
            {
              row.map( (el,ix) => (
                <td key={ix}>
                  <div dangerouslySetInnerHTML={{__html: el}} />
                </td>
              ))
            }
          </tr>
        ))
      }
    </tbody>
  </table>
)

Table.propTypes = {
  data: React.PropTypes.arrayOf(React.PropTypes.arrayOf(React.PropTypes.string)).isRequired
}

export default Table;
