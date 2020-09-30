import React from 'react';
import { Drawer, DrawerContent, DrawerContentBody } from '@patternfly/react-core';
import PropTypes from 'prop-types';
import PanelContent from './drawer-panel-content';

const DetailDrawer = ({ open, data, close, children, node, name }) => (
  <Drawer isExpanded={open}>
    <DrawerContent panelContent={<PanelContent close={close} data={data} id={node} name={name} />}>
      <DrawerContentBody>{children}</DrawerContentBody>
    </DrawerContent>
  </Drawer>
);

DetailDrawer.propTypes = {
  open: PropTypes.bool,
  data: PropTypes.shape({
    type: PropTypes.string,
    entityType: PropTypes.string,
  }),
  close: PropTypes.func.isRequired,
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.arrayOf(PropTypes.node)]),
  node: PropTypes.string,
  name: PropTypes.string,
};

export default DetailDrawer;
