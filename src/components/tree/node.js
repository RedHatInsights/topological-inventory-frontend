import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Button } from '@patternfly/react-core';

import AngleRightIcon from '@patternfly/react-icons/dist/js/icons/angle-right-icon';
import AngleDownIcon from '@patternfly/react-icons/dist/js/icons/angle-down-icon';

const NodeWrapper = styled(({ level, ...props }) => <div {...props} />)`
  padding-left: ${({ level }) => (level > 0 ? 24 : 0)}px;
`;

const DefaultRenderComponent = ({ title, level }) =>
  React.createElement(`h${level + 1 <= 6 ? level + 1 : 6}`, {}, title);

DefaultRenderComponent.propTypes = {
  title: PropTypes.node.isRequired,
  level: PropTypes.number,
};

const Node = ({ title, level, children, render, ...node }) => {
  const [open, setOpen] = useState(true);

  return (
    <NodeWrapper level={level}>
      <div>
        {children.length > 0 && !open && (
          <Button variant="plain" onClick={() => setOpen(true)}>
            <AngleRightIcon />
          </Button>
        )}
        {children.length > 0 && open && (
          <Button variant="plain" onClick={() => setOpen(false)}>
            <AngleDownIcon />
          </Button>
        )}
        {children.length === 0 && <span style={{ marginLeft: 46 }} />}
        {render({ title, level, ...node })}
      </div>
      {open && children.map((node) => <Node level={level + 1} key={node.id} _ {...node} render={render} />)}
    </NodeWrapper>
  );
};

const nodeShape = {
  title: PropTypes.node.isRequired,
  id: PropTypes.string.isRequired,
};

nodeShape.children = PropTypes.arrayOf(PropTypes.shape(nodeShape));

Node.propTypes = {
  title: PropTypes.node.isRequired,
  children: PropTypes.arrayOf(PropTypes.shape(nodeShape)),
  level: PropTypes.number,
  render: PropTypes.func,
};

Node.defaultProps = {
  children: [],
  level: 0,
  render: DefaultRenderComponent,
};

export default Node;
