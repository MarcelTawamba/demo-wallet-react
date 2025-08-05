import React, { Component, useContext } from 'react';
import hoistNonReactStatics from 'hoist-non-react-statics';

export const ThemeContext = React.createContext({
  context: {},
});

//function that receives a component, and returns a new composed component.
const context = ComposedComponent => {
  class ContextComponent extends Component {
    render() {
      return (
        <ThemeContext.Consumer>
          {context => (
            <ComposedComponent
              {...this.props}
              colors={context.colors}
              design={context.design}
              profile={context.profile}
              rem={context.rem}
              services={context.services}
            />
          )}
        </ThemeContext.Consumer>
      );
    }
  }

  hoistNonReactStatics(ContextComponent, ComposedComponent);

  return ContextComponent;
};

function ThemeProvider({ children, value }) {
  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

export default context;
export { useTheme, ThemeProvider };
