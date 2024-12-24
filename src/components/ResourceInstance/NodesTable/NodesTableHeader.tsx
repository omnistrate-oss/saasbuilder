import { Stack } from "@mui/material";

import Button from "src/components/Button/Button";
import LoadingSpinnerSmall from "src/components/CircularProgress/CircularProgress";
import SearchInput from "src/components/DataGrid/SearchInput";
import DataGridHeaderTitle from "src/components/Headers/DataGridHeaderTitle";
import FailoverIcon from "src/components/Icons/Failover/Failover";
import GenerateTokenIcon from "src/components/Icons/GenerateToken/GenerateTokenIcon";
import RefreshWithToolTip from "src/components/RefreshWithTooltip/RefreshWithToolTip";

type NodesTableHeaderProps = {
  resourceName?: string;
  count: number;
  refetchData: () => void;
  isRefetching: boolean;
  isFailoverDisabled: boolean;
  selectedNode?: { nodeId: string; resourceKey: string };
  showFailoverButton: boolean;
  showGenerateTokenButton: boolean;
  onGenerateTokenClick?: () => void;
  /* eslint-disable-next-line no-unused-vars*/
  handleFailover: (nodeId: string, resourceKey: string) => void;
  failoverMutation: { isLoading: boolean };
  searchText: string;
  /* eslint-disable-next-line no-unused-vars*/
  setSearchText: (text: string) => void;
};

const NodesTableHeader: React.FC<NodesTableHeaderProps> = ({
  resourceName,
  count,
  refetchData,
  isRefetching,
  isFailoverDisabled,
  selectedNode,
  showFailoverButton,
  showGenerateTokenButton,
  onGenerateTokenClick = () => {},
  handleFailover,
  failoverMutation,
  searchText,
  setSearchText,
}) => {
  return (
    <>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        p="20px"
        borderBottom="1px solid #EAECF0"
      >
        <DataGridHeaderTitle
          title={`List of Nodes ${resourceName ? `for ${resourceName}` : ""}`}
          desc="View and manage your Nodes"
          count={count}
          units={{
            singular: "Node",
            plural: "Nodes",
          }}
        />
        <Stack direction="row" alignItems="center" gap="12px">
          <SearchInput
            searchText={searchText}
            setSearchText={setSearchText}
            placeholder="Search by Node ID"
            width="250px"
          />
          <RefreshWithToolTip refetch={refetchData} disabled={isRefetching} />

          {showFailoverButton && (
            <Button
              variant="outlined"
              sx={{
                height: "40px !important",
                padding: "10px 14px !important",
              }}
              startIcon={<FailoverIcon disabled={isFailoverDisabled} />}
              disabled={isFailoverDisabled}
              onClick={() => {
                if (selectedNode && !isFailoverDisabled) {
                  handleFailover(selectedNode.nodeId, selectedNode.resourceKey);
                }
              }}
            >
              Failover
              {failoverMutation.isLoading && (
                <LoadingSpinnerSmall sx={{ marginLeft: "12px" }} />
              )}
            </Button>
          )}

          {showGenerateTokenButton && (
            <Button
              variant="outlined"
              sx={{
                height: "40px !important",
                padding: "10px 14px !important",
              }}
              startIcon={<GenerateTokenIcon />}
              onClick={onGenerateTokenClick}
            >
              Generate Token
            </Button>
          )}
        </Stack>
      </Stack>
    </>
  );
};

export default NodesTableHeader;
