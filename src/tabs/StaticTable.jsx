import React from 'react'

const Table = ({data}) => (
    <div className="row expanded">
        <div className="small-12 columns">
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
    </div>
)

Table.propTypes = {
  data: React.PropTypes.arrayOf(React.PropTypes.arrayOf(React.PropTypes.string)).isRequired
}

export default Table;
