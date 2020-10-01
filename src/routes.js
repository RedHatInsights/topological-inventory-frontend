import React, { Suspense, lazy } from 'react';
import { Route, Switch } from 'react-router-dom';
import styled from 'styled-components';

import { Grid, GridItem } from '@patternfly/react-core';

import CardLoader from './components/loaders/card-loader';
import DetailDrawer from './components/detail-drawer';

const TopologyView = lazy(() => import('./pages/topology-view'));
const TreeView = lazy(() => import('./pages/tree-view'));
const Crossroads = lazy(() => import('./pages/crossroads'));

export const paths = {
  index: '/',
  treeView: '/tree-view',
  topologyView: '/topology-viewer',
};

const StyledGrid = styled(Grid)`
  min-height: 100%;
`;

const Routes = () => (
  <StyledGrid hasGutter>
    <GridItem>
      <Suspense fallback={<CardLoader />}>
        <DetailDrawer>
          <Switch>
            <Route exact path={paths.treeView} component={TreeView} />
            <Route exact path={paths.topologyView} component={TopologyView} />
            <Route path={Routes.index} component={Crossroads} />
            <Route path="*" component={Crossroads} />
          </Switch>
        </DetailDrawer>
      </Suspense>
    </GridItem>
  </StyledGrid>
);

export default Routes;
