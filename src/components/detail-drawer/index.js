import React from 'react';
import { Drawer, DrawerContent, DrawerContentBody } from '@patternfly/react-core';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

import PanelContent from './drawer-panel-content';

const DetailDrawer = ({ children }) => {
  const open = useSelector(({ sourcesReducer }) => sourcesReducer.detailOpen);

  return (
    <Drawer isExpanded={open}>
      <DrawerContent panelContent={<PanelContent />}>
        <DrawerContentBody>{children}</DrawerContentBody>
      </DrawerContent>
    </Drawer>
  );
};

DetailDrawer.propTypes = {
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.arrayOf(PropTypes.node)]),
};

export default DetailDrawer;
