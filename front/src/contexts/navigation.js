import React, { useState, createContext, useContext, useEffect } from 'react';


const NavigationContext = createContext({});
const useNavigation = () => useContext(NavigationContext);

const NavigationProvider = (props) => {
  const [ navigationData, setNavigationData ] = useState({});

  return (
    <NavigationContext.Provider
      value={{ navigationData, setNavigationData }}
      {...props}
    />
  );
};

// eslint-disable-next-line func-style
function withNavigationWatcher(Component) {
  // eslint-disable-next-line react/display-name
  return function(props) {
    // eslint-disable-next-line react/prop-types
    const { path } = props.match;
    const { setNavigationData } = useNavigation();

    useEffect(() => {
      setNavigationData({ currentPath: path });
    }, [ path, setNavigationData ]);

    return React.createElement(Component, props);
  };
}

export {
  NavigationProvider,
  useNavigation,
  withNavigationWatcher,
};
