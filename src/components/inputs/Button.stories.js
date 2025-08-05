// MyComponent.stories.js

import React from 'react';
import { Button } from './Button';

export const Basic = () => <Button label="Basic" />;
export const Primary = () => <Button color="primary" label="Primary" />;

const buttonStoriesConfig = {
  title: 'Inputs/Button',
  component: Button,
};

export default buttonStoriesConfig;
