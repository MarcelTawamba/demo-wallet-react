import React from 'react';

const Fallback = props => {
  const { hideRefresh = false } = props;

  const styles = {
    container: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      padding: '32px',
      minHeight: '100vh',
      width: '100%',
      fontFamily: 'Roboto, Arial, sans-serif',
    },
    title: {
      fontSize: '24px',
      fontWeight: '500',
      color: '#f44336',
      marginBottom: '16px',
      textAlign: 'center',
    },
    description: {
      fontSize: '16px',
      color: '#666',
      marginBottom: '32px',
      textAlign: 'center',
      maxWidth: '400px',
    },
    button: {
      padding: '12px 24px',
      backgroundColor: '#5336FF',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      fontSize: '14px',
      fontWeight: '500',
      cursor: 'pointer',
      textTransform: 'uppercase',
    },
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Something went wrong</h2>
      <p style={styles.description}>
        Please try refreshing the page or contact support if the problem persists.
      </p>
      {!hideRefresh && (
        <button
          style={styles.button}
          onClick={() => window.location.reload(false)}
        >
          Refresh Page
        </button>
      )}
    </div>
  );
};

export default Fallback;
