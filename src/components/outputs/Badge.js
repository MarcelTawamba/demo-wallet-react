import React from 'react';
import Typography from 'components/outputs/Text';
import { useTheme } from 'components/app/context';

const Badge = ({ text = 'A', radius = 32, maxLength = 1 }) => {
  const { colors } = useTheme();

  return (
    <div
      style={{
        height: radius * 2,
        width: radius * 2,
        maxHeight: radius * 2,
        maxWidth: radius * 2,
        borderRadius: radius,
        backgroundColor: colors.primary,
        display: 'table',
      }}>
      <Typography
        style={{
          fontSize: 14,
          color: colors.primaryContrast,
          fontWeight: 'bold',
          display: 'table-cell',
          lineHeight: 1,
          verticalAlign: 'middle',
          textAlign: 'center',
          margin: 8,
        }}>
        {text.substr(0, maxLength).toUpperCase()}
      </Typography>
    </div>
  );
};

export default Badge;
