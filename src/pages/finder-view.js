import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';

import { Button, Card, CardBody, CardTitle, Flex, FlexItem, Label } from '@patternfly/react-core';

import { structureNode } from '../api/topology-viewer-api';

import CardLoader from '../components/loaders/card-loader';
import { loadSourcesAction, loadSourceTypes, loadItemDetail, clickOnNode } from '../store/actions';

import ViewSwitcher from '../components/view-switcher';
import styled from 'styled-components';

const Finder = (props) => {
  const [{ openNode, selectedId }, setOpen] = useState({});

  return (
    <React.Fragment>
      <FlexItem
        spacer={{ default: 'spacerNone' }}
        style={{
          height: '100%',
          width: 300,
          overflow: 'auto',
          border: '1px solid var(--pf-global--BorderColor--100)',
          resize: 'horizontal',
        }}
      >
        {props.data.map((node) => (
          <Button
            style={{ width: '100%', textAlign: 'left', ...(selectedId === node.id && { fontWeight: 800 }) }}
            key={node.key || node.id}
            isActive={selectedId === node.id}
            id={node.id}
            variant="link"
            isDisabled={Boolean(!node.isSelectable && !node.children?.length)}
            onClick={() => {
              if (node.children?.length) {
                setOpen({ openNode: node, selectedId: node.id });
              } else {
                setOpen({ selectedId: node.id });
              }

              node.isSelectable && props.onSelect(node);
            }}
          >
            {node.name} {Array.isArray(node.children) && <Label variant="outline">{node.children.length}</Label>}
          </Button>
        ))}
      </FlexItem>
      {openNode && <Finder {...props} key={openNode.id} data={openNode.children} />}
    </React.Fragment>
  );
};

Finder.propTypes = {
  data: PropTypes.array,
  onSelect: PropTypes.func,
  selected: PropTypes.string,
};

const createTreeData = (item, infoNode = structureNode, sourceTypes = [], expandedNodes = []) => {
  if (Array.isArray(item)) {
    return item.map((source) => createTreeData(source, infoNode, sourceTypes, expandedNodes));
  }

  const children = [];

  infoNode.children?.forEach((child) => {
    if (item[child.name]?.length > 0) {
      const nodeName = `${item.id}-${child.name}`;

      children.push({
        name: child.label,
        id: nodeName,
        children: item[child.name]?.map((subItem) => createTreeData(subItem, child, sourceTypes, expandedNodes)),
        defaultExpanded: expandedNodes.includes(nodeName),
        isFolder: true,
      });
    }
  });

  let name = (infoNode.attributes && item[infoNode.attributes[0]]) || item.name || item.id;

  if (infoNode.transformLabel) {
    name = infoNode.transformLabel(item, sourceTypes);
  }

  const nodeName = `${infoNode.name}-${item.id}`;

  return {
    originalId: item.id,
    id: nodeName,
    key: item.id,
    name,
    ...(children.length > 0 ? { children } : {}),
    isSelectable: true,
    defaultExpanded: expandedNodes.includes(nodeName),
    category: infoNode.name,
  };
};

const StyledFlex = styled(Flex)`
  height: 500px;
  flex-wrap: inherit;
`;

const FinderView = () => {
  const [treeData, setTreeData] = useState();

  const dispatch = useDispatch();

  const isLoaded = useSelector(({ sourcesReducer: { isLoaded } }) => isLoaded);
  const sources = useSelector(({ sourcesReducer }) => sourcesReducer.sources, shallowEqual);
  const sourceTypes = useSelector(({ sourcesReducer }) => sourcesReducer.sourceTypes, shallowEqual);
  const openedNodes = useSelector(
    ({ sourcesReducer }) => sourcesReducer.openedNodes,
    () => true
  );
  const openedNode = useSelector(({ sourcesReducer }) => sourcesReducer.selectedNode);

  useEffect(() => {
    if (!isLoaded) {
      dispatch(loadSourceTypes());
      dispatch(loadSourcesAction());
    }
  }, []);

  useEffect(() => {
    if (isLoaded) {
      setTreeData(createTreeData(sources, structureNode, sourceTypes, openedNodes));
    }
  }, [isLoaded]);

  if (!isLoaded || !treeData) {
    return <CardLoader />;
  }

  return (
    <Card>
      <CardTitle>
        <ViewSwitcher />
      </CardTitle>
      <CardBody>
        <StyledFlex>
          <Finder
            selected={openedNode}
            data={treeData}
            onSelect={(item) => {
              dispatch(clickOnNode(item.id));

              if (item.isSelectable) {
                dispatch(loadItemDetail(item.id, item.name, item.category, item.originalId));
              }
            }}
          />
        </StyledFlex>
      </CardBody>
    </Card>
  );
};

export default FinderView;
