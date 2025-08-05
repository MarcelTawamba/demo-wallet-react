import React, { Component } from 'react';
import ListItem from '@material-ui/core/ListItem';
import MenuIcon from './MenuIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
// import ExpandLess from '@material-ui/icons/ExpandLess';
// import ExpandMore from '@material-ui/icons/ExpandMore';
// import Text from 'components/outputs/Text';
import { Link } from 'react-router-dom';
import { Button } from 'components/inputs/Button';

class HeaderButton extends Component {
  state = {
    open: false,
  };

  renderLink = itemProps => <Link to={this.props.to} {...itemProps} />;

  render() {
    const { icon, label, pathname } = this.props;
    // const { open } = this.state;
    const selected =
      this.props.to === '/'
        ? this.props.to === pathname
        : pathname.includes(this.props.to);
    return (
      <Button
        // button
        component={this.renderLink}
        // dense
        variant="text"
        color="primary">
        <MenuIcon name={icon ? icon : label} selected={true} />
      </Button>
    );
  }
}

export default HeaderButton;
