import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import { DateFormat } from '@redhat-cloud-services/frontend-components/components/cjs/DateFormat';

import {
  Card,
  CardTitle,
  CardBody,
  TextContent,
  TextListItem,
  TextListItemVariants,
  TextListVariants,
  TextList,
  BreadcrumbItem,
  Breadcrumb,
  Spinner,
  Bullseye,
} from '@patternfly/react-core';

import {
  getSource,
  getServiceOfferingNode,
  getServiceInstanceNode,
  getServiceInventorie,
  getServiceInstanc,
  getServicePlan,
  getServiceOffering,
} from '../api/ansible-tower';

const apiMapper = {
  sources: getSource,
  'service-offering-nodes': getServiceOfferingNode,
  'service-instance-nodes': getServiceInstanceNode,
  'service-inventories': getServiceInventorie,
  'service-instances': getServiceInstanc,
  'service-plans': getServicePlan,
  'service-offerings': getServiceOffering,
};

const renderValue = (value, key) => {
  if (!value) {
    return '--';
  }

  if (key.endsWith('_at')) {
    return <DateFormat date={value} />;
  }

  if (typeof value === 'string') {
    return value;
  }

  return <pre>{JSON.stringify(value, null, 2)}</pre>;
};

const EntityDetail = () => {
  const [data, setData] = useState(null);

  const params = new URL(document.location).searchParams;
  const id = params.get('id');
  const type = params.get('type');

  useEffect(() => {
    apiMapper[type](id).then((data) => {
      setData(data);
    });
  }, []);

  if (!data) {
    return (
      <Card>
        <CardTitle>
          <Breadcrumb>
            <BreadcrumbItem>
              <Link to="/">Topology Inventory</Link>
            </BreadcrumbItem>
            <BreadcrumbItem>...</BreadcrumbItem>
            <BreadcrumbItem>{type}</BreadcrumbItem>
            <BreadcrumbItem to="#" isActive>
              {id}
            </BreadcrumbItem>
          </Breadcrumb>
        </CardTitle>
        <CardBody>
          <Bullseye>
            <Spinner size="lg" />
          </Bullseye>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card>
      <CardTitle>
        <Breadcrumb>
          <BreadcrumbItem>
            <Link to="/">Topology Inventory</Link>
          </BreadcrumbItem>
          {data.source_id && <BreadcrumbItem>{data.source_id}</BreadcrumbItem>}
          <BreadcrumbItem>{type}</BreadcrumbItem>
          <BreadcrumbItem to="#" isActive>
            {id}
          </BreadcrumbItem>
        </Breadcrumb>
      </CardTitle>
      <CardBody>
        <TextContent>
          <TextList component={TextListVariants.dl}>
            {Object.keys(data).map((key) => (
              <React.Fragment key={key}>
                <TextListItem component={TextListItemVariants.dt}>{key}</TextListItem>
                <TextListItem component={TextListItemVariants.dd}>{renderValue(data[key], key)}</TextListItem>
              </React.Fragment>
            ))}
          </TextList>
        </TextContent>
      </CardBody>
    </Card>
  );
};

export default EntityDetail;
