import React from 'react';
import { ToggleGroupItem, ToggleGroup, Flex, FlexItem, Button, Checkbox } from '@patternfly/react-core';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';

import { paths } from '../routes';
import { openDetailButton, keepClosed } from '../store/actions';

const StyledLink = styled(Link)`
  color: inherit;
  text-decoration: none;
`;

const ViewSwitcher = (props) => {
  const { pathname } = useLocation();
  const dispatch = useDispatch();

  const shouldClose = useSelector(({ sourcesReducer: { keepClosed } }) => keepClosed);

  return (
    <Flex {...props} justifyContent={{ default: 'justifyContentSpaceBetween' }}>
      <FlexItem>
        <ToggleGroup>
          <StyledLink to={paths.treeView}>
            <ToggleGroupItem isSelected={pathname === paths.treeView}>Tree view</ToggleGroupItem>
          </StyledLink>
          <StyledLink to={paths.topologyView}>
            <ToggleGroupItem isSelected={pathname === paths.topologyView}>Topology view</ToggleGroupItem>
          </StyledLink>
        </ToggleGroup>
      </FlexItem>
      <FlexItem>
        <Flex>
          <FlexItem>
            <Button variant="link" isInline onClick={() => dispatch(openDetailButton())}>
              Open detail
            </Button>
          </FlexItem>
          <FlexItem>
            <Checkbox
              checked={shouldClose}
              isChecked={shouldClose}
              label="Keep closed"
              id="keep-closed"
              name="keep-closed"
              onClick={() => dispatch(keepClosed())}
            />
          </FlexItem>
        </Flex>
      </FlexItem>
    </Flex>
  );
};

export default ViewSwitcher;
