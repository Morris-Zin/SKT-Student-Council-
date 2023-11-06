import { Alert } from '@mui/material';
import PropTypes from 'prop-types';

import React from 'react';

const Message = ({ variant, children, severity }) => (
  <Alert variant={variant} severity={severity}>
    {children}
  </Alert>
);

Message.defaultProps = {
  variant: 'info',
};
Message.propTypes = {
  variant: PropTypes.string,
  children: PropTypes.node,
  severity: PropTypes.string,
};

export default Message;
