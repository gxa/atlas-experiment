import React from 'react'
import PropTypes from 'prop-types'
import URI from 'urijs'
import ResourcePropTypes from './ResourcePropTypes.js'

const htmlEntity = (type) => {
  const maybeEntity = [
    ["link", "&#128279; "]
  ].find(e => type.includes(e[0]))

  return (
    !!maybeEntity &&  <span dangerouslySetInnerHTML={{__html: maybeEntity[1]}} />
  )
}

const icon = (type, pathToResources) => {
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
    type === e[0]
  ))

  return (
    !! maybeImg && <img style={{marginRight: "0.25rem"}}
                        src={URI(maybeImg[1], pathToResources)} />
  )
}

const Icon = ({type, pathToResources}) => {
  return (
    htmlEntity(type)
    || icon(type, pathToResources)
    || <span style={{marginLeft: "0.5rem",marginRight: "0.5rem"}}> &middot; </span>
  )

}

Icon.propTypes = {
  type: ResourcePropTypes.type,
  pathToResources: PropTypes.string.isRequired
}

export default Icon
