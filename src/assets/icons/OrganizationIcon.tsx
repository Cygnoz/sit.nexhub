import React, { useEffect } from 'react';
import { useOrganization } from '../../context/OrganizationContext';
import organizationIcon from '../Images/Ellipse 1.png';

type Props = {
  width?: string;
  height?: string;
};

const OrganizationIcon: React.FC<Props> = ({ width = '6', height = '6' }) => {
  const { organization: orgData, fetchOrganization } = useOrganization();
  
  useEffect(() => {
    // Fetch organization data on initial render if it's not already loaded
    if (!orgData) {
      fetchOrganization();
    }
  }, [orgData, fetchOrganization]);

  return (
    <div>
      {orgData?.organizationLogo ? (
        <img
          src={orgData.organizationLogo}
          className={`w-${width} h-${height} rounded-full object-cover`}
          alt="Organization Logo"
          style={{ cursor: 'pointer' }}
        />
      ) : (
        <img
          src={organizationIcon}
          className={`w-${width} h-${height} rounded-full object-cover`}
          alt="Default Organization Logo"
          style={{ cursor: 'pointer' }}
        />
      )}
    </div>
  );
};

export default OrganizationIcon;
