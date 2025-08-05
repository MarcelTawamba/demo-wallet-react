import React, { Component, useContext } from 'react';
import hoistNonReactStatics from 'hoist-non-react-statics';
import { defaultConfig } from 'redux/rehive/selectors';

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

function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    // TODO: return default config here
    return defaultConfig;
    // throw new Error('useTheme must be used within a ThemeProvider');
  }

  return context;
}

export default context;
export { useTheme };
