import PageTitle from "../components/Layout/PageTitle";
import PageContainer from "../components/Layout/PageContainer";
import AccessControlIcon from "../components/Icons/AccessControlIcon";

const AccessControlPage = () => {
  return (
    <PageContainer>
      <PageTitle icon={AccessControlIcon} className="mb-6">
        Access Control
      </PageTitle>
    </PageContainer>
  );
};

export default AccessControlPage;
