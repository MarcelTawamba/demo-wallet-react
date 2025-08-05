import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from 'components/outputs/Text';
import { View } from 'components/layout/View';
import CopyIcon from '@material-ui/icons/FileCopyOutlined';
// import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import { useToast } from 'components/contexts/ToastContext';
import IconButton from 'components/inputs/IconButton';
import { Button } from 'components/inputs/Button';
import ReactJson from 'react-json-view';
import en from 'config/locales/en';
import { standardizeString, getCurrencyCode } from 'util/general';
import Markdown from './Markdown';
import Spinner from 'components/outputs/Spinner';
import { useTranslation } from 'react-i18next';

export default function Output(props) {
  const { t } = useTranslation(['common']);
  let {
    id,
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
    fullLink,
    variant = 'body1',
    horizontal,
    align = 'left',
    type,
    placeholderId,
    placeholder,
    bold,
    newTab,
    variantProps,
    className,
    locales,
    standardize,
    loading,
    sectionVariant,
  } = props;

  let valueComponent = null;

  const classes = useStyles();

  const { showToast } = useToast();

  if (standardize && typeof value === 'string') {
    value = standardizeString(value);
  }
  if (variant === 'currency' && typeof value === 'object') {
    value = getCurrencyCode(value);
    // (value?.description ? ' - ' + value?.description : '');
  }

  // label = locales?.en?.[label] ?? en?.[label] ?? label;
  label = t(id || label);

  if (link === value) {
    newTab = true;
  }

  const localLink = link && typeof link === 'string';
  const actualLink =
    link === value
      ? link
      : fullLink
      ? fullLink
      : link
      ? (localLink ? window.location.origin + link : '') + value
      : '';
  const myValueColor =
    typeof valueColor === 'string'
      ? valueColor
      : valueColor
      ? 'primary'
      : 'font';

  const renderCopy =
    copy && document.queryCommandSupported('copy') ? (
      <React.Fragment>
        <IconButton
          tooltip="copy"
          onClick={() =>
            copyToClipboard(showToast, typeof copy === 'string' ? copy : value)
          }>
          <CopyIcon {...variantProps} />
        </IconButton>
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
  if (variant === 'markdown') {
    valueComponent = <Markdown>{value}</Markdown>;
  }

  if (type === 'date' && value) {
    value = new Date(value).toDateString();
  }
  if (type === 'json') {
    valueComponent = (
      <ReactJson
        src={value ?? {}}
        theme="bright:inverted"
        enableClipboard={false}
        collapsed={2}
        displayDataTypes={false}
        displayObjectSize={false}
        name={false}
        iconStyle="triangle"
        {...variantProps}
      />
    );
  }

  if (horizontal) {
    return (
      <View
        flex
        fD={'row'}
        w={'100%'}
        jC={'flex-start'}
        aI={'center'}
        className={`${className} ${classes.container}`}>
        {label && (
          <Typography
            width={sectionVariant ? 'auto' : 240}
            align={'left'}
            variant={'body1'}
            opacity={0.67}
            myColor={
              typeof labelColor === 'string'
                ? labelColor
                : labelColor
                ? 'primary'
                : 'font'
            }
            className={classes.label}>
            {label}
          </Typography>
        )}
        {loading ? (
          <Spinner align="right" size={20} />
        ) : valueComponent ? (
          valueComponent
        ) : value || value === 0 ? (
          <View fD={'column'} w={'100%'}>
            {actualLink ? (
              <Button
                variant="link"
                newTab={newTab}
                href={actualLink}
                rel="noopener noreferrer"
                target="_blank"
                color={'primary'}>
                {value}
              </Button>
            ) : (
              <Typography
                align={align}
                variant={variant}
                // width="100%"
                myColor={myValueColor}>
                {value}
              </Typography>
            )}
            {value2 && (
              <Typography
                align={sectionVariant ? 'right' : 'left'}
                variant="subtitle2">
                {value2}
              </Typography>
            )}
          </View>
        ) : (
          (placeholder || placeholderId) && (
            <Typography
              id={placeholderId}
              align={sectionVariant ? 'right' : 'left'}
              variant={variant}>
              {placeholder}
            </Typography>
          )
        )}
        {renderCopy}
      </View>
    );
  }

  return (
    <View
      className={className}
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
        {label && (value || placeholder || placeholderId) && (
          <Typography
            style={{
              // wordBreak: 'none',
              opacity: typeof labelColor === 'string' ? 1 : 0.7,
              fontWeight: '500',
            }}
            myColor={
              typeof labelColor === 'string'
                ? labelColor
                : labelColor
                ? 'primary'
                : 'font'
            }
            align={align}
            variant="caption">
            {label}
          </Typography>
        )}
        {valueComponent ? (
          valueComponent
        ) : actualLink ? (
          <a
            target={newTab ? '_blank' : '_self'}
            style={{ width: '100%' }}
            rel="noopener noreferrer"
            href={actualLink}>
            <Typography variant={variant} myColor={'primary'} align={align}>
              {value}
            </Typography>
          </a>
        ) : value || values ? (
          values ? (
            values.map((value, index) => (
              <Typography
                key={value}
                align={align}
                variant="body1"
                myColor={myValueColor}>
                {index === 1 && valueBold ? <b>{value}</b> : value}
              </Typography>
            ))
          ) : (
            <Typography
              align={align}
              variant="body1"
              myColor={myValueColor}
              component="div">
              {value}
              {value2 && <Typography variant="subtitle2">{value2}</Typography>}
            </Typography>
          )
        ) : placeholder || placeholderId ? (
          <Typography
            id={placeholderId}
            align={align}
            style={{ color: 'rgba(0, 0, 0, 0.32)' }}>
            {placeholder}
          </Typography>
        ) : (
          <Typography
            id={label}
            myColor={myValueColor}
            align={align}></Typography>
        )}
        {/* <View h={24} /> */}
      </View>
      {renderCopy}
    </View>
  );
}

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

const useStyles = makeStyles(theme => ({
  container: {
    [theme.breakpoints.down(500)]: {
      flexWrap: 'wrap',
    },
  },
  label: {
    breakWord: 'keep-all',
    whiteSpace: 'nowrap',
    paddingRight: 20,
    [theme.breakpoints.down(500)]: {
      whiteSpace: 'inherit',
      flexWrap: 'wrap',
    },
  },
}));
