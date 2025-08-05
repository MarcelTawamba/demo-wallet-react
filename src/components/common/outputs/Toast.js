import React from 'react';
import MuiAlert from '@material-ui/lab/Alert';
import Snackbar from '@material-ui/core/Snackbar';
import en from 'config/locales/en';
import { standardizeString } from 'util/general';

let openSnackbarFn = () => {};

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

class Toast extends React.Component {
  state = {
    open: false,
    text: '',
    alert: null,
  };

  componentDidMount() {
    openSnackbarFn = this.openSnackbar;
  }

  openSnackbar = ({ text, id, alert }) => {
    const localedText = en[id] ?? (id ? standardizeString(id) : text);
    this.setState({
      open: true,
      text: localedText,
      alert,
    });
  };

  handleSnackbarClose = () => {
    this.setState({
      open: false,
      text: '',
    });
  };

  render() {
    const text = (
      <span
        id="snackbar-message-id"
        dangerouslySetInnerHTML={{ __html: this.state.text }}
      />
    );

    return (
      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        message={this.state.alert ? null : text}
        autoHideDuration={3000}
        onClose={this.handleSnackbarClose}
        open={this.state.open}>
        {this.state.alert && <Alert severity={this.state.alert}>{text}</Alert>}
      </Snackbar>
    );
  }
}

export function showToast(props) {
  openSnackbarFn(props);
}

export default Toast;
