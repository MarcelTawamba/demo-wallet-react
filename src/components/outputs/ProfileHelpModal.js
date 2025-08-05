import React from 'react';

import Info from './Info';
import { View } from 'components/layout/View';
// import Icon from './NewIcon';
import Text from './Text';
// import SimplePageListIcon from 'components/lists/SimplePageListIcon';

import ErrorOutline from '@material-ui/icons/ErrorOutline';
// import VerifiedUserOutlinedIcon from '@material-ui/icons/VerifiedUserOutlined';
// import DeleteIcon from '@material-ui/icons/Delete';
import StarIcon from '@material-ui/icons/Star';
// import StarBorderIcon from '@material-ui/icons/StarBorder';
// import EditIcon from '@material-ui/icons/Edit';
// import DoneIcon from '@material-ui/icons/Done';
// import ClearIcon from '@material-ui/icons/Clear';

const helpConfig = id => [
  {
    icon: <StarIcon color="primary" />,
    color: 'primary',
    id: 'primary_help_label',
    context: { id },
  },
  // { icon: 'star-border', color: 'font', label: 'Non-primary ' + id },
  // { : 'done', color: 'positive', label: 'Verified ' + id },
  {
    icon: <ErrorOutline color="error" />,
    color: 'negative',
    id: 'unverified_help_label',
    context: { id },
  },
];

export default function ProfileHelpModal(props) {
  const { id } = props;
  const isRtl = document.dir === 'rtl';

  return (
    <div>
      {helpConfig(id?.slice(0, -1))?.map(item => (
        <View
          key={item?.name ?? item}
          fD="row"
          ph={2}
          aI="center"
          pt={1}
          {...{ [isRtl ? 'ml' : 'mr']: 1.5 }}>
          {item?.icon}
          <View {...{ [isRtl ? 'pr' : 'pl']: 1 }}>
            <Text id={item.id} context={item.context || {}} />
          </View>
        </View>
      ))}
      <View ph={2} pt={1}>
        <Info
          id="profile_help_temporarily_disabled"
          langContext={{ id: id?.slice(0, -1) }}
        />
      </View>
    </div>
  );
}
