import React, { ReactNode } from "react";
import PrivateRoute from "../components/PrivateRoute";
import ANavbar from "../components/ANavbar";

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <PrivateRoute>
      <div>
        <ANavbar/>
        {children}
      </div>
    </PrivateRoute>
  );
};

export default Layout;
