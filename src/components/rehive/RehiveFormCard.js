import React, { Component } from 'react';
import { resendVerification } from 'util/rehive';
import { View } from 'components/layout/View';
import Card from 'components/card/Card';
import { RehiveForm } from './RehiveForm';
// import Inputs from 'config/inputs';
import { safe } from 'util/general';
import CardLayout from 'components/card/CardLayout';

class RehiveFormCard extends Component {
  actionOne(item, index) {
    const { type, detailObj } = this.props;
    let label = '';
    let onPress = () => {};
    let disabled = false;
    // if (!detailObj.visible) {
    switch (type) {
      case 'mobile':
      case 'email':
        label = item.primary ? 'Primary' : 'MAKE PRIMARY';
        onPress = () => this.props.showModal('primary', index);
        disabled = item.primary ? true : false;
        break;
      default:
    }
    // }
    return {
      label,
      onPress,
      disabled,
    };
  }

  actionTwo(item, index) {
    const { type, company, detailObj } = this.props;
    let label = '';
    let onPress = () => {};
    let disabled = false;

    if (!detailObj.visible) {
      switch (type) {
        case 'mobile':
        case 'email':
          label = item && item.verified ? 'Verified' : 'VERIFY';
          onPress = () => {
            try {
              resendVerification(type, item, company);
            } catch (e) {
              console.log(e);
            }
            this.props.showModal('verify', index);
          };
          disabled = item && item.verified ? true : false;
          break;
        default:
      }
    }
    return {
      label,
      onPress,
      disabled,
    };
  }

  editable() {
    const { type } = this.props;

    switch (type) {
      case 'mobile':
      case 'email':
        return false;
      default:
        return true;
    }
  }

  actionFooter(item, index) {
    const { type, detailObj } = this.props;
    let icon = '';
    let onPress = () => {};
    let disabled = false;

    if (!detailObj.visible) {
      switch (type) {
        case 'mobile':
        case 'email':
          if (item.primary) {
            icon = '';
          } else {
            icon = 'delete';
          }
          break;
        case 'profile':
          icon = '';
          break;
        case 'address':
        case 'bank_account':
        case 'crypto_address':
        default:
          icon = 'delete';
          break;
      }
    }
    if (icon === 'delete') {
      onPress = () => this.props.showModal('delete', index);
    }
    return {
      icon,
      onPress,
      disabled,
    };
  }

  render() {
    const { type, item, index, handleStateChange } = this.props;

    const titleObj = {
      title: '',
      subtitle: '',
      badge: '',
    };

    const keys = Object.keys(Inputs[type]);
    let incomplete = false;
    let empty = true;
    const outputs = keys.map(key => {
      if (key !== 'primary') {
        const label = safe(Inputs[type][key], 'label', '');
        const value = item[key];
        if (!value) {
          incomplete = true;
        } else {
          empty = false;
        }
        return { label, value };
      }
    });

    const contentObj = {
      values: outputs,
      text: incomplete ? (empty ? 'Not yet provided' : 'Incomplete') : '',
      onClick: () => handleStateChange('edit', index),
    };

    const actionsObj = {
      primary: this.actionOne(item, index),
      secondary: this.actionOne(item, index),
    };

    const cardObj = {
      titleObj,
      actionsObj,
      contentObj,
      // design: design.wallets,
    };

    return <CardLayout className="card" key={index} {...cardObj} />;
  }
}

export default RehiveFormCard;
