import React from 'react';
import { ToggleGroupItem, ToggleGroup } from '@patternfly/react-core';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';

import { paths } from '../routes';

const StyledLink = styled(Link)`
  color: inherit;
  text-decoration: none;
`;

const ViewSwitcher = (props) => {
  const { pathname } = useLocation();

  return (
    <ToggleGroup {...props}>
      <StyledLink to={paths.treeView}>
        <ToggleGroupItem isSelected={pathname === paths.treeView}>Tree view</ToggleGroupItem>
      </StyledLink>
      <StyledLink to={paths.topologyView}>
        <ToggleGroupItem isSelected={pathname === paths.topologyView}>Topology view</ToggleGroupItem>
      </StyledLink>
    </ToggleGroup>
  );
};

export default ViewSwitcher;
