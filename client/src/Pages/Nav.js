import React from "react";
import { useNavigate } from "react-router-dom";

const NavHook = (Component) => {
  
  return function WithNavigate(props) {
    const navigate = useNavigate();
    return <Component navigate={navigate} {...props} />
  };
};

export default NavHook;