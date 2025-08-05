import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import $ from 'jquery';

class Hover extends React.Component {
  state = { hover: false };

  shouldComponentUpdate(nextProps, nextState, nextContext) {
    return (
      !_.isEqual(nextProps, this.props) ||
      !_.isEqual(nextState, this.state) ||
      !_.isEqual(nextContext, this.context)
    );
  }

  isHovered = element => {
    try {
      return element && $(element).is(':hover');
    } catch (err) {
      console.error(err);
    }
  };

  componentDidMount = () => {
    setTimeout(function () {
      if (this.isMounted) {
        var element = ReactDOM.findDOMNode(this);
        this.setState({ hover: !!this.isHovered(element) });
      }
    }, 1);
  };

  componentWillUnmount = () => {
    // this.isMounted = false;
  };

  componentDidUpdate = (prevProps, prevState, prevContext) => {
    setTimeout(function () {
      if (this.isMounted) {
        var element = ReactDOM.findDOMNode(this);
        this.setState({ hover: !!this.isHovered(element) });
      }
    }, 1);
  };

  render() {
    const { render, onHoverEnter, onHoverLeave, ...restProps } = this.props;
    return (
      <div
        {...restProps}
        className={this.state.hover ? 'hover' : 'not-hover'}
        onMouseEnter={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}
        onMouseOver={this.onMouseOver}>
        {render(this.state.hover)}
      </div>
    );
  }

  onMouseEnter = () => {
    if (this.state.hover === false) {
      if (this.props.onHoverEnter) this.props.onHoverEnter();
      this.setState({ hover: true });
    }
  };

  onMouseOver = () => {
    if (this.state.hover === false) {
      if (this.props.onHoverEnter) this.props.onHoverEnter();
      this.setState({ hover: true });
    }
  };

  onMouseLeave = () => {
    if (this.state.hover === true) {
      if (this.props.onHoverLeave) this.props.onHoverLeave();
      this.setState({ hover: false });
    }
  };
}

export default Hover;
