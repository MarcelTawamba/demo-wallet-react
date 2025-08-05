import React from 'react';
import Typography from 'components/outputs/Text';
import { View } from 'components/layout/View';
import CopyIcon from '@material-ui/icons/FileCopyOutlined';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import { useToast } from 'components/contexts/ToastContext';
import IconButton from 'components/inputs/IconButton';
import { Button } from 'components/inputs/Button';
import ReactJson from 'react-json-view';

const Output = props => {
  let {
    label,
    labelBold,
    labelColor,
    value,
    values,
    valueBold,
    valueColor,
    value2,
    copy,
    link,
    variant = 'body1',
    horizontal,
    align = 'left',
    type,
    placeholder,
    bold,
    newTab,
  } = props;
  let valueComponent = null;
  const { showToast } = useToast();
  const localLink = link && typeof link === 'string';

  const renderCopy =
    copy && document.queryCommandSupported('copy') ? (
      <React.Fragment>
        <IconButton
          tooltip="copy"
          onClick={() => copyToClipboard(showToast, value)}>
          <CopyIcon />
        </IconButton>
      </React.Fragment>
    ) : null;
  const renderLink =
    link && newTab ? (
      <React.Fragment>
        <Button
          variant="link"
          tooltip={'Open in new tab'}
          href={link}
          rel="noopener noreferrer"
          target="_blank">
          <OpenInNewIcon />
        </Button>
      </React.Fragment>
    ) : null;

  if (bold) {
    value = <b>{value}</b>;
    label = <b>{label}</b>;
  }

  if (labelBold) {
    label = <b>{label}</b>;
  }

  if (valueBold) {
    value = <b>{value}</b>;
  }

  if (type === 'date' && value) {
    value = new Date(value).toDateString();
  }
  if (type === 'json') {
    valueComponent = (
      <ReactJson
        src={value ?? {}}
        theme="bright:inverted"
        // enableClipboard={false}
        collapsed={2}
        displayDataTypes={false}
        displayObjectSize={false}
        name={false}
        iconStyle="triangle"
      />
    );
  }

  if (horizontal) {
    return (
      <View flex fD={'row'} w={'100%'} jC={'flex-start'} aI={'flex-start'}>
        {label && (
          <Typography
            width={'auto'}
            align={'left'}
            variant={variant}
            myColor={labelColor ? 'primary' : 'font'}
            style={{
              opacity: 0.7,
              breakWord: 'keep-all',
              whiteSpace: 'nowrap',
            }}>
            {label}
          </Typography>
        )}
        {valueComponent ? (
          valueComponent
        ) : value ? (
          <View fD={'column'} w={'100%'}>
            {link ? (
              <Button
                variant="link"
                newTab={newTab}
                href={(localLink ? link : '') + value}
                rel="noopener noreferrer"
                target="_blank"
                color={'primary'}>
                {value}
              </Button>
            ) : (
              <Typography
                align={'right'}
                variant={variant}
                myColor={valueColor ? 'primary' : 'font'}>
                {value}
              </Typography>
            )}
            {value2 && (
              <Typography align={'right'} variant="subtitle2">
                {value2}
              </Typography>
            )}
          </View>
        ) : (
          <Typography align={'right'} variant={variant}>
            {placeholder}
          </Typography>
        )}
        {renderCopy}
        {/* {renderLink} */}
      </View>
    );
  }

  return (
    <View
      flex
      fD={'row'}
      w={'100%'}
      jC={align === 'right' ? 'flex-end' : 'flex-start'}
      aI={'center'}>
      <View
        w={'100%'}
        style={{
          wordBreak: 'break-word',
        }}>
        {label && (
          <Typography
            style={{
              // wordBreak: 'none',
              opacity: 0.7,
            }}
            myColor={labelColor ? 'primary' : 'font'}
            align={align}
            variant="caption">
            {label}
          </Typography>
        )}
        {valueComponent ? (
          valueComponent
        ) : link ? (
          <a
            target={newTab ? '_blank' : '_self'}
            style={{ width: '100%' }}
            rel="noopener noreferrer"
            href={(localLink ? link : '') + value}>
            <Typography variant={variant} myColor={'primary'} align={align}>
              {value}
            </Typography>
          </a>
        ) : value || values ? (
          values ? (
            values.map((value, index) => (
              <Typography key={value} align={align} variant="body1">
                {index === 1 && valueBold ? <b>{value}</b> : value}
              </Typography>
            ))
          ) : (
            <Typography align={align} variant="body1">
              {value}
              {value2 && <Typography variant="subtitle2">{value2}</Typography>}
            </Typography>
          )
        ) : placeholder ? (
          <Typography
            align={align}
            variant="body1"
            style={{ color: 'rgba(0, 0, 0, 0.32)' }}>
            {placeholder}
          </Typography>
        ) : (
          <View h={24} />
        )}
      </View>
      {renderCopy}
      {/* {renderLink} */}
    </View>
  );
};

export default Output;

const copyToClipboard = (showToast, text) => {
  var el = document.createElement('textarea');
  // Set value (string to be copied)
  el.value = text;
  // Set non-editable to avoid focus and move outside of view
  el.setAttribute('readonly', '');
  el.style = { position: 'absolute', left: '-9999px' };
  document.body.appendChild(el);
  // Select text inside element
  el.select();
  // Copy text to clipboard
  document.execCommand('copy');
  // Remove temporary element
  document.body.removeChild(el);
  showToast({ text: 'Copied to clipboard: ' + text });
};
