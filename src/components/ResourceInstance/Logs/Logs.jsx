import Ansi from "ansi-to-react";
import {
  Box,
  CircularProgress,
  IconButton as MuiIconButton,
  Stack,
} from "@mui/material";
import { useRef, useState, useEffect } from "react";
import { Text } from "../../Typography/Typography";
import Card from "../../Card/Card";
import Divider from "../../Divider/Divider";
import { useWebSocket } from "react-use-websocket/dist/lib/use-websocket";
import styled from "@emotion/styled";
import useSnackbar from "../../../hooks/useSnackbar";
import InfiniteScroll from "react-infinite-scroller";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import Tooltip from "../../Tooltip/Tooltip";
import LoadingSpinner from "src/components/LoadingSpinner/LoadingSpinner";
import DataGridHeaderTitle from "src/components/Headers/DataGridHeaderTitle";
import Select from "src/components/FormElementsv2/Select/Select";
import MenuItem from "src/components/FormElementsv2/MenuItem/MenuItem";

const logsPerPage = 50;

const connectionStatuses = {
  idle: "idle",
  connected: "connected",
  failed: "error",
  disconnected: "disconnected",
};

const Log = styled("pre")({
  fontWeight: 500,
  fontSize: "12px",
  lineHeight: "16px",
  color: "#FFFFFF",
  "&+&": {
    marginTop: 30,
  },
  wordBreak: "break-word",
  whiteSpace: "pre-wrap",
});

const LogsContainer = styled(Box)(() => ({
  height: 500,
  overflowY: "auto",
  marginTop: 24,
  borderRadius: "8px",
  backgroundColor: "#101828",
  padding: "0px 60px 24px 24px",
  fontFamily: "Monaco, monospace",
  color: "#FFFFFF",
}));

const IconButton = ({ direction, divRef, titleText }) => {
  const position = direction === "up" ? { top: "20px" } : { bottom: "20px" };

  return (
    <MuiIconButton
      onClick={() => divRef.current.scrollIntoView({ behavior: "smooth" })}
      sx={{
        position: "absolute",
        border: "1px solid #2B3E6B",
        right: "28px",
        backgroundColor: "#1D273F",
        boxShadow: "0px 1px 2px 0px #1018280D",

        "&:hover": {
          backgroundColor: "#1D273F",
        },
        ...position,
      }}
    >
      <Tooltip
        title={<Text sx={{ padding: "4px", color: "white" }}>{titleText}</Text>}
        placement={direction === "up" ? "bottom-start" : "top-start"}
      >
        {direction === "up" ? (
          <KeyboardArrowUpIcon sx={{ color: "#DCE1E8" }} />
        ) : (
          <KeyboardArrowDownIcon sx={{ color: "#DCE1E8" }} />
        )}
      </Tooltip>
    </MuiIconButton>
  );
};

function Logs(props) {
  const {
    nodes = [],
    socketBaseURL,
    instanceStatus,
    //resourceKey,
    resourceInstanceId,
    //mainResourceHasCompute,
  } = props;
  const [logs, setLogs] = useState([]);
  let selectedId = "";

  if (nodes.length > 0) {
    selectedId = nodes[0].id;
  }
  const [selectedNodeId, setSelectedNodeId] = useState(selectedId);
  const [errorMessage, setErrorMessage] = useState("");
  let logsSocketEndpoint = null;
  if (socketBaseURL && selectedNodeId) {
    logsSocketEndpoint = `${socketBaseURL}&podName=${selectedNodeId}&instanceId=${resourceInstanceId}`;
  }
  //  else if (socketBaseURL && resourceKey && mainResourceHasCompute) {
  //   logsSocketEndpoint = `${socketBaseURL}&podName=${resourceKey}-0&instanceId=${resourceInstanceId}`;
  // }

  const [isLogsDataLoaded, setIsLogsDataLoaded] = useState(false);
  const [socketConnectionStatus, setConnectionStatus] = useState(
    connectionStatuses.idle
  );
  const [hasMoreLogs, setHasMoreLogs] = useState(true);
  const [records, setRecords] = useState(logsPerPage);
  const startDivRef = useRef();
  const endDivRef = useRef();

  const loadMoreLogs = () => {
    if (records === logs.length) {
      setHasMoreLogs(false);
    } else if (records < logs.length) {
      setRecords((prev) => prev + logsPerPage);
    }
  };

  const snackbar = useSnackbar();
  useEffect(() => {
    setLogs([]);
  }, [selectedNodeId]);

  function handleNodeChange(event) {
    const { value } = event.target;
    setSelectedNodeId(value);
  }

  const { getWebSocket } = useWebSocket(logsSocketEndpoint, {
    onOpen: () => {
      setConnectionStatus(connectionStatuses.connected);
      setLogs([]);
      // setIsLogsDataLoaded(true);
    },
    onError: (event) => {
      console.log("Socket connection error", event);
    },
    onMessage: (event) => {
      if (!isLogsDataLoaded) {
        setIsLogsDataLoaded(true);
      }
      const data = event.data;
      setLogs((prevData) => [...prevData, data]);
    },
    shouldReconnect: () => true,
    reconnectAttempts: 3,
    retryOnError: true,
    reconnectInterval: (attemptNumber) => {
      const interval = Math.pow(2, attemptNumber) * 1000;
      return interval;
    },
    onReconnectStop: () => {
      if (isLogsDataLoaded) {
        snackbar.showError(
          "Unable to get the latest data. The displayed data might be outdated"
        );
      } else {
        // snackbar.showError("Unable to get the latest data...");
        setErrorMessage(
          "Can't access logs data. Please check if the instance is available and logs are enabled."
        );
      }
    },
  });

  useEffect(() => {
    function handleNetorkDisconnect() {
      snackbar.showError(
        "Network disconnected. The displayed data might be outdated"
      );
    }
    window.addEventListener("offline", handleNetorkDisconnect);
    //close the socket on unmount
    return () => {
      window.removeEventListener("offline", handleNetorkDisconnect);
      const socket = getWebSocket();
      if (socket) {
        socket.close();
      }
    };
  }, [logsSocketEndpoint]);

  if (!logsSocketEndpoint || errorMessage || instanceStatus === "STOPPED") {
    return (
      <Card
        mt={4}
        sx={{
          paddingTop: "12.5px",
          paddingLeft: "20px",
          paddingRight: "20px",
          minHeight: "500px",
        }}
      >
        <Stack direction="row" justifyContent="center" marginTop="200px">
          <Text size="xlarge">
            {errorMessage ||
              `Logs are not available ${instanceStatus !== "RUNNING" ? "as the instance is not running" : ""}`}
          </Text>
        </Stack>
      </Card>
    );
  }

  if (
    !isLogsDataLoaded &&
    socketConnectionStatus === connectionStatuses.connected
  ) {
    return (
      <Stack
        flexDirection={"column"}
        gap="30px"
        alignItems="center"
        sx={{ marginTop: "200px", marginBottom: "200px" }}
      >
        <CircularProgress />
        <Text size="large" weight="medium">
          Connected to the server, logs will be available shortly
        </Text>
      </Stack>
    );
  }
  if (!isLogsDataLoaded) {
    return <LoadingSpinner />;
  }

  return (
    <Card
      mt={"32px"}
      sx={{
        paddingTop: "12.5px",
        paddingLeft: "20px",
        paddingRight: "20px",
        minHeight: "500px",
        borderRadius: "8px",
      }}
    >
      <Stack
        sx={{
          flexDirection: "row",
          justifyContent: "space-between",
        }}
        alignItems="center"
      >
        <DataGridHeaderTitle
          title={`Logs`}
          desc="Detailed logs for monitoring and troubleshooting"
        />
        {nodes?.length > 0 && (
          <Box>
            <Text size="small" weight="medium" color="#344054" ml="5px">
              Node ID
            </Text>
            <Select
              value={selectedNodeId}
              sx={{
                width: "auto",
                maxWidth: "250px",
              }}
              onChange={handleNodeChange}
            >
              {nodes.map((node) => (
                <MenuItem
                  value={node.id}
                  key={node.id}
                  sx={{
                    whiteSpace: "normal",
                    wordBreak: "break-all",
                    maxWidth: "255px",
                  }}
                >
                  {node.id}
                </MenuItem>
              ))}
            </Select>
          </Box>
        )}
      </Stack>
      <Divider sx={{ marginTop: "12px" }} />

      <Box position="relative">
        <LogsContainer className="sleek-scroll">
          <div
            ref={startDivRef}
            style={{ visibility: "hidden", height: "24px" }}
          />
          <InfiniteScroll
            pageStart={0}
            hasMore={hasMoreLogs}
            loadMore={loadMoreLogs}
            useWindow={false}
          >
            {logs
              ?.filter((log, index) => index < records)
              .map((log) => {
                return (
                  <>
                    <Log key={log}>
                      <Ansi>{log}</Ansi>
                    </Log>
                  </>
                );
              })}
          </InfiniteScroll>
          <div ref={endDivRef} style={{ visibility: "hidden" }} />
        </LogsContainer>
        {isLogsDataLoaded && (
          <>
            <IconButton
              titleText={"Navigate to top"}
              direction="up"
              divRef={startDivRef}
            />
            <IconButton
              titleText={"Navigate to bottom"}
              direction="down"
              divRef={endDivRef}
            />
          </>
        )}
      </Box>
    </Card>
  );
}

export default Logs;
