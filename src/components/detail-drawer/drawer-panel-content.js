import React from 'react';
import PropTypes from 'prop-types';
import ReactJsonView from 'react-json-view';
import {
  DrawerPanelContent,
  DrawerHead,
  DrawerActions,
  DrawerCloseButton,
  Spinner,
  Bullseye,
} from '@patternfly/react-core';
import { useSelector } from 'react-redux';

const PanelContent = ({ close, id, data, name }) => {
  const isLoading = useSelector(({ sourcesReducer }) => sourcesReducer.isDetailLoading);

  return (
    <DrawerPanelContent>
      <DrawerHead>
        {name} -- {id}
        {isLoading ? (
          <Bullseye className="pf-u-p-xl">
            <Spinner />
          </Bullseye>
        ) : (
          <ReactJsonView src={data} />
        )}
        <DrawerActions>
          <DrawerCloseButton onClick={close} />
        </DrawerActions>
      </DrawerHead>
    </DrawerPanelContent>
  );
};

PanelContent.propTypes = {
  close: PropTypes.func.isRequired,
  id: PropTypes.string,
  data: PropTypes.object,
  name: PropTypes.string,
};

export default PanelContent;
