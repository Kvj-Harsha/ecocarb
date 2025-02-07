import React, { ReactNode } from "react";
import PrivateRoute from "../components/PrivateRoute";

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <PrivateRoute>
      <div>{children}</div>
    </PrivateRoute>
  );
};

export default Layout;
