import React from 'react';
import Typography from '@material-ui/core/Typography';

import { standardizeString } from 'util/general';
import { useTheme } from '../app/context';
import Tooltip from '@material-ui/core/Tooltip';
import { useLanguage } from 'components/contexts/LanguageContext';
import { useConfiguration } from 'components/contexts/ConfigurationContext';
import { merge } from 'lodash';
import { useTranslation } from 'react-i18next';

function mergeContexts(context = {}, contextProps = {}) {
  try {
    if (context?.company?.name?.length < 1) {
      context.company.name = standardizeString(context?.company?.id);
    }
  } catch (e) {}

  return merge(context, contextProps);
}

const Text = ({
  id,
  children,
  myColor,
  c,
  width,
  opacity = 1,
  style,
  bold,
  padded,
  fontWeight,
  showTooltip,
  inline,
  locales,
  forwardRef,
  s,
  tA,
  lH,
  uppercase,
  lowercase,
  context: contextProps = {},
  ...restProps
}) => {
  const { lang } = useLanguage();
  const { config } = useConfiguration();
  const companyContext = { company: config };
  const { t } = useTranslation(['common']);

  // if (id) {
  //   children = lang?.[id] ?? standardizeString(id);
  // }
  if (id) {
    const i18nString = t(id, {
      defaultValue: null,
      ...mergeContexts(companyContext, contextProps),
    });
    if (i18nString) {
      // Check if the interpolation failed and returned template string
      if (i18nString.includes('{{company.name}}') && !config?.name) {
        // Company data not ready, show loading or fallback
        children = config?.id ? standardizeString(config.id) : '';
      } else {
        children = i18nString;
      }
    } else {
      const langEntry = lang?.en?.[id] ?? lang?.[id];
      if (typeof langEntry === 'function') {
        // children = langEntry(context);
        children = 'function';
      } else if (typeof langEntry === 'string') {
        children = langEntry;
      } else if (!children) {
        children = standardizeString(id);
      }
    }
  }

  const { colors } = useTheme();
  style = { width: width ? width : '100%', opacity, ...style };

  if (myColor || c) {
    style = {
      ...style,
      color: colors[myColor ?? c] ? colors[myColor ?? c] : myColor ?? c,
    };
  }
  if (bold || fontWeight) style.fontWeight = fontWeight ? fontWeight : '500';
  if (padded) style.paddingBottom = 8;
  if (s) style.fontSize = s;
  if (tA) style.textAlign = tA;
  if (inline) style.display = 'inline';
  if (uppercase) style.textTransform = 'uppercase';
  if (lowercase) style.textTransform = 'lowercase';
  if (forwardRef) restProps.ref = forwardRef;

  let typographyContent = null;
  if (typeof children === 'string') {
    try {
      const splits = children.split('**');
      if (splits?.length > 1) {
        typographyContent = (
          <Typography component="div" style={style} {...restProps}>
            {splits.map((item, index) => (
              <Typography
                key={index}
                component="span"
                {...restProps}
                style={{
                  ...style,
                  display: 'inline',
                  fontWeight: index % 2 === 0 ? 400 : 500,
                }}>
                {item}
              </Typography>
            ))}
          </Typography>
        );
      }
    } catch (ex) {
      console.log(ex);
    }
  }
  if (!typographyContent) {
    typographyContent = (
      <Typography component="div" style={style} {...restProps}>
        {children}
      </Typography>
    );
  }

  return showTooltip ? (
    <Tooltip title={children} placement="top-start" enterDelay={500}>
      {typographyContent}
    </Tooltip>
  ) : (
    typographyContent
  );
};

export default Text;
