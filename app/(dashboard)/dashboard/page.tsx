import PageTitle from "../components/Layout/PageTitle";
import DashboardIcon from "../components/Icons/DashboardIcon";
import PageContainer from "../components/Layout/PageContainer";

const DashboardPage = () => {
  return (
    <PageContainer>
      <PageTitle icon={DashboardIcon} className="mb-6">
        Dashboard
      </PageTitle>
    </PageContainer>
  );
};

export default DashboardPage;
