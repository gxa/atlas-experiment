import React, {Component} from 'react'
import {connect} from 'react-refetch'
import ResourceType from './ResourcePropTypes.js'
import Icon from './Icon.jsx'
import {uniq} from 'lodash'
import URI from 'urijs'

const ResourcesSection = ({values, pathToFolderWithBundledResources}) => {
  const subsections = uniq(values.map((value)=> (
    value.group
  )))

  return (
    <div className="row" style={{fontSize:"larger"}}>
      <div className="small-12 columns">
        <ul style={{listStyle: "none"}}>
          {
            subsections.filter(el=>el).length <2
            ? values.map((value, ix, self) => (
                <li key={ix}>
                  <a href={value.url}>
                  <p>
                    <Icon type={value.type} {...{pathToFolderWithBundledResources}}  />
                    {value.description}
                  </p>
                  </a>
                </li>
              ))
            : subsections.map((subsectionName, ix) => (
                <li key={ix}>
                <ul style={{listStyle: "none", marginLeft:"0rem"}}>
                  <i>{
                    subsectionName}
                  </i>
                  {
                    values.filter((value) => (
                      subsectionName === value.group
                    ))
                    .map((value, jx, self) => (
                      <li key={jx} style={{marginLeft:"1.25rem"}}>
                        <a href={value.url}>
                        <div>
                          <Icon type={value.type} {...{pathToFolderWithBundledResources}} />
                          {value.description}
                        </div>
                        </a>
                      </li>
                    ))
                  }
                </ul>
                <br/>
                </li>
            ))
          }
        </ul>
      </div>
    </div>
  )
}

class ResourcesTab extends Component {
  render() {
    const { resourcesFetch , atlasUrl, pathToFolderWithBundledResources} = this.props

    if (resourcesFetch.pending) {
      return <img src={URI(`resources/images/loading.gif`, atlasUrl)} />
    } else if (resourcesFetch.rejected) {
      return (
        <div>
        Error: {resourcesFetch.reason}
        </div>
      )
    } else if (resourcesFetch.fulfilled) {
      return (
        <ResourcesSection values={resourcesFetch.value}
        {...{pathToFolderWithBundledResources}} />
      )
    }
  }
}

export default connect(props => ({
  resourcesFetch: props.url
}))(ResourcesTab)
