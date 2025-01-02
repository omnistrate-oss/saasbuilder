import GlobalDataProvider from "src/providers/GlobalDataProvider";
import Navbar from "./components/Layout/Navbar";
import Sidebar from "./components/Layout/Sidebar";

const DashboardLayout = ({ children }) => {
  return (
    <GlobalDataProvider>
      <div className="h-screen w-screen flex flex-col overflow-hidden">
        <Navbar />
        <div className="flex-1 relative overflow-hidden">
          <Sidebar />
          <div
            className="ml-80 h-full overflow-y-auto bg-[#FCFCFC]"
            // TODO: Check if this has any impact
            // style={{
            //   scrollbarGutter: "stable",
            // }}
          >
            {children}
          </div>
        </div>
      </div>
    </GlobalDataProvider>
  );
};

export default DashboardLayout;
