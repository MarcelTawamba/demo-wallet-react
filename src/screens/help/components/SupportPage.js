import React from 'react';

import { Box } from '@material-ui/core';
import Icon from 'components/outputs/NewIcon';
import Output from 'components/outputs/Output';

export default function SupportPage(props) {
  const { context } = props;
  const { company } = context;
  const email = company?.support_email ?? company?.contact_email;

  return (
    <Box
      flexDirection="row"
      display="flex"
      p={2}
      alignItems="center"
      width="100%">
      <Icon name="email" size={20} circled={false} />
      <Output
        align="center"
        value={email}
        placeholderId="support_page_placeholder"
        fullLink={email ? 'mailto:' + email : null}
      />
    </Box>
  );
}
