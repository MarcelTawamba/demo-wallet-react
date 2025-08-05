import React, { Component } from 'react';

import { Button } from 'components/inputs/Button';
import { View } from 'components/layout/View';
import Image from 'components/outputs/Image';
import Text from 'components/outputs/Text';

const WelcomeScreens = ({ index, screens, handleButtonPress }) => {
  const renderButtons = () => {
    return (
      <View p={2} aI={'center'}>
        <Button
          type="submit"
          color={'primary'}
          variant={'contained'}
          size="large"
          className="btn btn-block focus"
          onClick={() => handleButtonPress('primary', null)}
          wide>
          {index + 1 < screens.length ? 'Next' : 'Enter'}
        </Button>

        <Button
          variant="text"
          onClick={() => handleButtonPress('back', null)}
          color={'secondary'}>
          Cancel
        </Button>
      </View>
    );
  };

  const renderContent = () => {
    return (
      <View p={1} aI={'center'}>
        <Text variant={'h3'} align={'center'}>
          {screens[index].title}
        </Text>
        <Text align={'center'}>{screens[index].description}</Text>
      </View>
    );
  };

  // const schema = {
  //   email: yup
  //     .string()
  //     .email(
  //       fields.helper && fields.email.helper
  //         ? fields.email.helper
  //         : 'Please enter a valid email',
  //     )
  //     .required(
  //       fields.error && fields.email.error
  //         ? fields.email.error
  //         : 'Email is required',
  //     ),
  // };

  return (
    <React.Fragment>
      {renderContent()}

      {renderButtons()}
    </React.Fragment>
  );
  // }
};
export default WelcomeScreens;
