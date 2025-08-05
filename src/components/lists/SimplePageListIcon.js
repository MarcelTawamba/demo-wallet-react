import React from 'react';

import ErrorOutline from '@material-ui/icons/ErrorOutline';
import VerifiedUserOutlinedIcon from '@material-ui/icons/VerifiedUserOutlined';
import DeleteIcon from '@material-ui/icons/Delete';
import StarIcon from '@material-ui/icons/Star';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import EditIcon from '@material-ui/icons/Edit';
import DoneIcon from '@material-ui/icons/Done';
import ClearIcon from '@material-ui/icons/Clear';
import { useTheme } from 'components/app/context';
import Text from 'components/outputs/Text';

export default function SimplePageListIcon(props) {
  const { type, value, onClick, item, hover } = props;
  const { colors } = useTheme();
  const isRtl = document.dir === 'rtl';

  const style = { fontSize: 20, [isRtl ? 'marginRight' : 'marginLeft']: 8 };
  const sharedProps = { style };
  switch (type) {
    case 'delete':
      if (item?.primary) return null;
      return (
        <DeleteIcon
          {...sharedProps}
          style={{ ...style, color: colors?.fontLight }}
        />
      );
    case 'verify':
      if (!value) {
        // return <VerifiedUserIcon color={'primary'} />;
        return <ErrorOutline color="error" {...sharedProps} />;
      }
      return null;
    // return (
    //   <DoneIcon
    //     {...sharedProps}
    //     style={{ ...style, color: colors?.success }}
    //   />
    // );
    // return <VerifiedUserOutlinedIcon />;
    case 'primary':
      if (value) {
        return (
          <Text
            id="Primary"
            s={14}
            style={{
              backgroundColor: '#D3FFF5',
              color: '#2BB292',
              paddingLeft: 5,
              paddingRight: 5,
              borderRadius: 8,
              // fontWeight: 'bold',
              // fontSize: 12,
            }}
          />
        );
        // <StarIcon color={'primary'} {...sharedProps} />;
      }
      return null;
    // return (
    //   <StarBorderIcon onClick={onClick} color="primary" {...sharedProps} />
    // );
    case 'edit':
      // if (!hover) return null;
      return (
        <EditIcon
          onClick={onClick}
          {...sharedProps}
          style={{ ...style, color: colors?.fontLight }}
        />
      );
    case 'confirm':
      return <DoneIcon onClick={onClick} {...sharedProps} />;
    case 'cancel':
      return <ClearIcon onClick={onClick} {...sharedProps} />;
    default:
      return null;
  }
}
