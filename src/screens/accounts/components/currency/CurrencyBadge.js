import React from 'react';
import Typography from 'components/outputs/Text';
import CurrencyPlaceholderImage, {
  images,
} from 'components/outputs/CurrencyPlaceholderImage';
import { useTheme } from 'components/app/context';
import Image from 'components/outputs/Image';

// Default function to get currency code
const defaultGetCurrencyCode = (currency) => {
  return currency?.display_code ?? currency?.code ?? '';
};

// Helper function to find the display label for a currency code
function findCurrencyLabel(value, items) {
  // First try to find in the items array
  if (Array.isArray(items) && items.length > 0 && typeof items[0] === 'object') {
    const item = items.find(i => i?.value === value);
    if (item?.label) {
      return item.label;
    }
  }
  
  // If not found, try to extract the display_code from the value
  try {
    if (value && value.includes('_')) {
      // For codes like "USDC_SOL", we want to display "USDC"
      const parts = value.split('_');
      if (parts.length > 1) {
        return parts[0];
      }
    }
  } catch (error) {
    console.error('Error parsing currency code:', error);
  }
  
  // If all else fails, just return the value
  return value;
}

const CurrencyBadge = props => {
  const {
    text = '',
    radius = 32,
    color,
    currency,
    maxLength = 6,
    style,
    getCurrencyCode = defaultGetCurrencyCode,
  } = props;

  const { colors } = useTheme();
  
  // Determine the display text to use
  let displayText = '';
  
  // If currency object is provided, always use the display_code from it
  if (currency) {
    displayText = getCurrencyCode(currency);
  } 
  // If no currency but text is provided, use that
  else if (text) {
    displayText = text;
  }

  return (
    <div style={{ paddingLeft: 8, paddingRight: 8, ...style }}>
      {currency?.icon ? (
        <Image
          src={currency?.icon}
          width={radius * 2}
          height={radius * 2}
          style={{ borderRadius: radius }}
        />
      ) : images[displayText] ? (
        <CurrencyPlaceholderImage name={displayText} radius={radius} />
      ) : (
        <div
          style={{
            height: radius * 2,
            width: radius * 2,
            maxHeight: radius * 2,
            maxWidth: radius * 2,
            borderRadius: radius,
            backgroundColor: color ? colors[color] : colors.primary,
            display: 'table',
          }}>
          <Typography
            className="badge-child"
            style={{
              fontSize:
                displayText.length <= 2
                  ? 24
                  : displayText.length < 4
                  ? 16
                  : displayText.length < 5
                  ? 14
                  : displayText.length < 6
                  ? 12
                  : 10,
              color: colors[color + 'Contrast']
                ? colors[color + 'Contrast']
                : colors.primaryContrast,
              fontWeight: 'bold',
              display: 'table-cell',
              lineHeight: 1,
              verticalAlign: 'middle',
              textAlign: 'center',
              margin: 8,
            }}>
            {displayText ? displayText.substr(0, maxLength).toUpperCase() : ''}
          </Typography>
        </div>
      )}
    </div>
  );
};

const styles = {
  circle: {
    // margin: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
  },
};

export default CurrencyBadge;
