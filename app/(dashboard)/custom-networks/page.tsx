import PageTitle from "../components/Layout/PageTitle";
import PageContainer from "../components/Layout/PageContainer";
import CustomNetworksIcon from "../components/Icons/CustomNetworksIcon";

const CustomNetworksPage = () => {
  return (
    <PageContainer>
      <PageTitle icon={CustomNetworksIcon} className="mb-6">
        Custom Networks
      </PageTitle>
    </PageContainer>
  );
};

export default CustomNetworksPage;
