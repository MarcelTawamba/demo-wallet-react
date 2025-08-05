import React from 'react';
import Box from '@material-ui/core/Box';
import Text from 'components/outputs/Text';
import Input from 'components/inputs';
import { due_delay, send_request_on, send_reminders } from 'config/inputs';
import { useFormContext } from 'react-hook-form';

export default function PaymentMethodsInput(props) {
  // Use form context instead of props
  const methods = useFormContext();
  
  if (!methods) {
    console.error('PaymentMethodsInput must be wrapped in a FormProvider');
    return null;
  }

  return (
    <>
      <Input
        name="send_request_on" // Add name prop
        config={send_request_on}
        InputLabelProps={{ shrink: true }}
        form={methods} // Pass the form methods object instead of register and control
      />
      <Box flexDirection={'row'} display={'flex'} alignItems={'center'}>
        <Input name="due_delay" form={methods} config={due_delay} /> {/* Add name prop */}
        <div style={{ paddingLeft: 8, whiteSpace: 'nowrap', height: 22 }}>
          <Text id="days_after_invoice_sent" />
        </div>
      </Box>
      <Input name="send_reminders" form={methods} config={send_reminders} /> {/* Add name prop */}
    </>
  );
}
