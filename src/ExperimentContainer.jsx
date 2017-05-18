import React from 'react'
import {BrowserRouter, Route, Switch, Redirect, NavLink, IndexRedirect, withRouter } from 'react-router-dom'

import queryStringUtils from 'qs'
import URI from 'urijs'

import Heatmap from './tabs/heatmap/Main.jsx'
import ExperimentDesign from './tabs/experiment-design/Main.jsx'
import Resources from './tabs/resources/Main.jsx'
import StaticTable from './tabs/StaticTable.jsx'
import QCReport from './tabs/qc-report/Main.jsx'

const TabPropType = React.PropTypes.shape({
  type: React.PropTypes.string.isRequired,
  name: React.PropTypes.string.isRequired,
  props: React.PropTypes.object.isRequired
});

//coupled to ExperimentController.java
const componentsPerTab = {
  'multipart' : ``,
  'heatmap' : Heatmap,
  'experiment-design' : ExperimentDesign,
  'resources' : Resources,
  'static-table' : StaticTable,
  'qc-report' : QCReport
}

const createPageSection = ({type, props}) => {

  const Tab = componentsPerTab[type]
  return (
      <Tab {...props} />
  )
}

const createPage = ({type, commonProps, tabProps}) => (
  type === `multipart`
  ? (
    <div>
      {tabProps.sections.map(({type, name, props}) => (
        <div key={name}>
          <h4>
            {name}
          </h4>
          {
            createPageSection({type, props: Object.assign({}, commonProps, props)})
          }
        </div>
      ))}
    </div>
  )
  : createPageSection({type, props: Object.assign({}, commonProps, tabProps)})
)

const queryFromRouteDetails = ({location:{search}}) => queryStringUtils.parse(search.replace(/^\?/, ``))

const makeTab = ({type,commonProps, tabProps}) => (
  (routeDetails) => createPage({type, commonProps: Object.assign({}, commonProps, {query: queryFromRouteDetails(routeDetails)}), tabProps})
)

const makeTopRibbon = (tabNames) => (
  withRouter(
    ({location}) =>
      <ul className="tabs">
        {tabNames.map(tabName => (
          <li title={tabName} key={tabName} className="tabs-title">
            <NavLink
              to={{pathname:`/${tabName}`, search: location.search, hash: location.hash}}
              activeStyle={{color: `#0a0a0a`, background: `#e6e6e6`}}>
              {tabName}
            </NavLink>
          </li>
        ))}
      </ul>
  )
)

class RedirectToTabWithLocation extends React.Component {
  render () {
    return (
      <Redirect to={{
        pathname: `/${this.props.tabName}`,
        search: this.props.location.search,
        hash: this.props.location.hash}} />
    )
  }
}
const RedirectToTab = withRouter(RedirectToTabWithLocation)


const ExperimentContainerRouter = ({
  atlasUrl,
  pathToFolderWithBundledResources,
  experimentAccession,
  experimentType,
  accessKey,
  species,
  tabs
}) => {
  const commonProps = Object.assign(
    {
      atlasUrl,
      pathToFolderWithBundledResources,
      experimentAccession,
      experimentType,
      accessKey,
      species
    },
    {
      isDifferential: experimentType.toLowerCase().includes(`differential`),
      isRnaSeq: experimentType.toLowerCase().replace(`_`, ``).includes(`rnaseq`)
    }
  )

  return (
    <BrowserRouter basename={URI(`experiments/${experimentAccession}`, URI(atlasUrl).path()).toString()}>
      <div class="row expanded margin-top-large">
        <div class="small-12 columns">
          <Route path={`/`} component={makeTopRibbon(tabs.map((tab)=>tab.name))} />
          <Switch>
          {
            tabs
            .map((tab)=>
              <Route
                key={tab.name}
                path={`/${tab.name}`}
                component={makeTab({type:tab.type, commonProps: commonProps, tabProps: tab.props})}
                />
            )
          }
          <RedirectToTab tabName={tabs[0].name} />
          </Switch>
        </div>
      </div>
    </BrowserRouter>
  )
}

ExperimentContainerRouter.propTypes = {
  atlasUrl: React.PropTypes.string.isRequired,
  pathToFolderWithBundledResources: React.PropTypes.string.isRequired,
  experimentAccession: React.PropTypes.string.isRequired,
  experimentType: React.PropTypes.string.isRequired,
  accessKey: React.PropTypes.string,
  species: React.PropTypes.string.isRequired,
  tabs: React.PropTypes.arrayOf(TabPropType).isRequired
}

export default ExperimentContainerRouter;
