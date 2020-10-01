import React from 'react';
import ReactJsonView from 'react-json-view';
import {
  DrawerPanelContent,
  DrawerHead,
  DrawerActions,
  DrawerCloseButton,
  Spinner,
  Bullseye,
  DrawerPanelBody,
} from '@patternfly/react-core';
import { useSelector, useDispatch } from 'react-redux';

import { closeDetailDrawer } from '../../store/actions';

const PanelContent = () => {
  const isLoading = useSelector(({ sourcesReducer }) => sourcesReducer.isDetailLoading);
  const id = useSelector(({ sourcesReducer }) => sourcesReducer.detail?.node);
  const name = useSelector(({ sourcesReducer }) => sourcesReducer.detail?.name);
  const data = useSelector(({ sourcesReducer }) => sourcesReducer.details?.[id]);

  const dispatch = useDispatch();

  return (
    <DrawerPanelContent>
      <DrawerHead>
        {name} -- {id}
        <DrawerActions>
          <DrawerCloseButton onClick={() => dispatch(closeDetailDrawer())} />
        </DrawerActions>
      </DrawerHead>
      <DrawerPanelBody>
        {isLoading ? (
          <Bullseye className="pf-u-p-xl">
            <Spinner />
          </Bullseye>
        ) : (
          <ReactJsonView src={data} />
        )}
      </DrawerPanelBody>
    </DrawerPanelContent>
  );
};

export default PanelContent;
