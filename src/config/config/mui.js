const muiConfig = {
  typography: {
    h6: { lineHeight: 1.2, fontSize: 18, color: '#' },
    body1: { lineHeight: 1.4, color: '#585858' },
    body2: { lineHeight: 1.4, color: '#585858' },
    h5: { fontWeight: 500, color: '#434343', lineHeight: 1, fontSize: 25 },
    h3: {
      fontWeight: 500,
      color: '#434343',
      fontSize: '2.2rem',
      // lineHeight: '2rem',
      // display: 'inline-block',
    },
    h4: {
      color: '#434343',
      fontSize: '1.6rem',
      lineHeight: 1,
    },
    h2: {
      color: '#434343',
    },
    h1: {
      color: '#434343',
    },
    // overline: {
    //   color: '#777777',
    // },
    // caption: {
    //   color: '#777777',
    // },
    subtitle2: {
      opacity: 0.7,
      fontSize: '0.75rem',
      fontWeight: 300,
      color: '#585858',
    },
  },
  shape: { borderRadius: 10 },
  breakpoints: {
    values: {
      xs: 480,
      sm: 736,
      md: 980,
      lg: 1280,
      xl: 1600,
    },
  },
  overrides: {
    MuiIconButton: {
      root: {
        padding: 8,
      },
    },
    MuiListItem: {
      root: {
        '&$selected': {
          backgroundColor: '#EEE',
        },
      },
    },
    MuiTableRow: {
      // root: {
      //   '&:last-child td': {
      //     borderBottom: 0,
      //   },
      // },
    },
    MuiTextField: {
      root: {
        marginTop: 7,
        marginBottom: 7,
      },
    },
  },
  props: {
    MuiButton: {
      disableElevation: true,
    },
  },
};
export default muiConfig;
