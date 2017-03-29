import React from 'react'
import Url from 'url'
import Path from 'path'
import ResourcePropTypes from './ResourcePropTypes.js'

const htmlEntity = (type) => {
  const maybeEntity = [
    ["link", "&#128279; "]
  ].find((e)=>(
    type.indexOf(e[0])>-1
  ))

  return (
    !!maybeEntity &&  <span dangerouslySetInnerHTML={{__html: maybeEntity[1]}} />
  )
}

const icon = (type, pathToFolderWithBundledResources) => {
  const maybeImg = [
    ["icon-gsea-reactome", require("./assets/gsea_reactome-icon.png")],
    ["icon-gsea-interpro", require("./assets/gsea_interpro-icon.png")],
    ["icon-gsea-go", require("./assets/gsea_go-icon.png")],
    ["icon-ma", require("./assets/ma-plot-icon.png")],
    ["icon-ae", require("./assets/ae-logo-64.png")],
    ["icon-experiment-design", require("./assets/experiment_design_icon.png")],
    ["icon-tsv", require("./assets/download_blue_small.png")],
    ["icon-Rdata", require("./assets/r-button.png")]
  ].find((e) => (
    type == e[0]
  ))

  return (
    !! maybeImg && <img style={{marginRight: "0.25rem"}}src={
      Url.resolve(
          pathToFolderWithBundledResources,
          maybeImg[1]
      )} />
  )
}


const Icon = ({type, pathToFolderWithBundledResources}) => {
  return (
    htmlEntity(type)
    || icon(type, pathToFolderWithBundledResources)
    || <span style={{marginLeft: "0.5rem",marginRight: "0.5rem"}}> &middot; </span>
  )

}
Icon.propTypes = {
  type: ResourcePropTypes.type,
  pathToFolderWithBundledResources: React.PropTypes.string.isRequired
}

export default Icon
