import GlobalDataProvider from "src/providers/GlobalDataProvider";
import Navbar from "./components/Layout/Navbar";
import Sidebar from "./components/Layout/Sidebar";
import Footer from "./components/Layout/Footer";

const DashboardLayout = ({ children }) => {
  return (
    <GlobalDataProvider>
      <div className="h-screen w-screen flex flex-col overflow-hidden">
        <Navbar />
        <div className="flex-1 relative overflow-hidden">
          <Sidebar />
          <div className="ml-[19rem] flex flex-col h-full">
            <div className="flex-1 overflow-y-auto bg-[#FCFCFC]">
              {children}
            </div>
            <Footer />
          </div>
        </div>
      </div>
    </GlobalDataProvider>
  );
};

export default DashboardLayout;
