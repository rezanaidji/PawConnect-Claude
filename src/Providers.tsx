import { Outlet } from "react-router-dom";
import { SessionProvider } from "./context/SessionContext";
import { ThemeProvider } from "./context/ThemeContext";

const Providers = () => {
  return (
    <ThemeProvider>
      <SessionProvider>
        <Outlet />
      </SessionProvider>
    </ThemeProvider>
  );
};

export default Providers;
