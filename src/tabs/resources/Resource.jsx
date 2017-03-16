import React from 'react'
import ResourceType from './ResourcePropTypes.js'

const Large = ({className,description,type,url}) => (
  <div className={className}>
    <a href={url}>
    <img src={"http://lorempixel.com/150/150/cats/"+type} style={{display:"block"}}/>
    <div>
      {description}
    </div>
    </a>
  </div>
)

const Small = ({className,description,type,url}) => (
  <div className={className}>
    <a href={url}>
    <img src={"http://lorempixel.com/30/30/cats/"+type} style={{display:"block"}}/>
    <div>
      {description}
    </div>
    </a>
  </div>
)

Large.propTypes = ResourceType
Small.propTypes = ResourceType


export {Large, Small}
