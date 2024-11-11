import React from 'react';
import { useOrganization } from '../../context/OrganizationContext';
import organizationIcon from '../Images/Ellipse 1.png';

type Props = {
  width?: string;
  height?: string;
  organization?:any;
};

const OrganizationIcon: React.FC<Props> = ({ width = '6', height = '6' }) => {
  const { organization } = useOrganization();

  return (
    <div>
      {organization?.organizationLogo ? (
        <img
          src={organization.organizationLogo || organizationIcon}
          className={`w-${width} h-${height} rounded-full object-cover`}
          alt="Organization Logo"
          style={{ cursor: 'pointer' }}
        />
      ) : (
        <img
          src={organizationIcon}
          className={`${width} ${height} rounded-full object-cover`}
          alt="Default Organization Logo"
          style={{ cursor: 'pointer' }}
        />
      )}
    </div>
  );
};

export default OrganizationIcon;
