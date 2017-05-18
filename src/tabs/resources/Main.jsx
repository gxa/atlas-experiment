import React, {Component} from 'react'
import {connect} from 'react-refetch'
import Icon from './Icon.jsx'
import {uniq} from 'lodash'
import URI from 'urijs'

const ResourcesSection = ({values, pathToFolderWithBundledResources}) => {
  const subsections = uniq(values.map((value)=> (
    value.group
  )))

  return (
    <div className="row column expanded margin-top-large">
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
                <ul style={{listStyle: "none"}} className="margin-left-none margin-bottom-medium">
                  <i>{
                    subsectionName}
                  </i>
                  {
                    values.filter((value) => (
                      subsectionName === value.group
                    ))
                    .map((value, jx, self) => (
                      <li key={jx} className="margin-left-large">
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
              </li>
          ))
        }
      </ul>
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
  resourcesFetch: URI(props.url, props.atlasUrl).toString()
}))(ResourcesTab)
