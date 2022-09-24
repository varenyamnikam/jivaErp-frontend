import React, { useContext, createContext } from "react";
import useLocalStorage from "../hooks/useLocalStorage";

const Context = createContext({
  newroled: [],
});

const Provider = (props) => {
  const { children } = props;
  const [newroled, setUserRoles] = useLocalStorage("newroled", [
    {
      id: 0,
      roleCode: "ADMI",
      roleName: "Admi User",
    },
    {
      id: 1,
      roleCode: "Secret",
      roleName: "Secret User",
    },
    {
      id: 2,
      roleCode: "hang glide",
      roleName: "Hang User",
    },
  ]);

  const removeUserRole = (roleCode) => {
    const newnewroled = newroled.filter((t) => t.roleCode !== roleCode);
    setUserRoles(newnewroled);
  };


  return (
    <Context.Provider value={{ removeUserRole }}>
      {children}
    </Context.Provider>
  );
};

export const useUserRoles = () => useContext(Context);

export const withProvider = (Component) => {
  return (props) => {
    return (
      <Provider>
        <Component {...props} />
      </Provider>
    );
  };
};
