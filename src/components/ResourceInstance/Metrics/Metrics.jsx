import { Box, CircularProgress, Stack, styled } from "@mui/material";
import { Text } from "../../Typography/Typography";

import Divider from "../../Divider/Divider";
import Card from "../../Card/Card";
import { useCallback, useEffect, useRef, useState } from "react";
import useWebSocket from "react-use-websocket";
import MetricCard from "./MetricCard";
import LoadingSpinner from "../../LoadingSpinner/LoadingSpinner";
import CpuUsageChart from "./CpuUsageChart";
import MemUsagePercentChart from "./MemUsagePercentChart";
import LoadAverageChart from "./LoadAverageChart";
import DiskIOPSReadChart from "./DiskIOPSReadChart";
import DiskIOPSWriteChart from "./DiskIOPSWriteChart";
import DiskThroughputChart from "./DiskThroughputChart";
import NetworkThroughputChart from "./NetworkThroughputChart";
import DiskUsageChart from "./DiskUsageChart";
import useSnackbar from "../../../hooks/useSnackbar";
import formatDateUTC from "../../../utils/formatDateUTC";
import MultiLineChart from "./MultiLineChart";
import SingleLineChart from "./SingleLineChart";
import DataGridHeaderTitle from "src/components/Headers/DataGridHeaderTitle";
import Select from "src/components/FormElementsv2/Select/Select";
import MenuItem from "src/components/FormElementsv2/MenuItem/MenuItem";

const initialCpuUsage = {
  current: "",
  data: [],
};

const initialLoadAverage = {
  current: "",
  data: [],
};
const initialMemUsagePercentData = {
  current: "",
  data: [],
};

const connectionStatuses = {
  idle: "idle",
  connected: "connected",
  failed: "error",
  disconnected: "disconnected",
};

//store 4 hr data
const maxStorageTime = 3600 * 4;
//websocket reveives a new message every 60 seconds
const dataIncomeFrequency = 60;
const maxDataPoints = maxStorageTime / dataIncomeFrequency;

const ContainerCard = ({ children }) => {
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
      {children}
    </Card>
  );
};

const MetricsContainerCard = ({ children }) => {
  return (
    <Card
      mt={8}
      sx={{
        boxShadow: "0px 4px 30px 0px #2E2D740D",
        borderRadius: "0px",
        padding: "0px",
        marginTop: "12px",
        background: "#F9FAFB",
      }}
    >
      {children}
    </Card>
  );
};

function Metrics(props) {
  const snackbar = useSnackbar();
  const {
    nodes = [],
    socketBaseURL,
    instanceStatus,
    resourceKey,
    resourceInstanceId,
    customMetrics = [],
    productTierType,
    //mainResourceHasCompute,
  } = props;
  let firstNode = null;
  if (nodes.length > 0) {
    firstNode = nodes[0];
  }
  const [selectedNode, setSelectedNode] = useState(firstNode);
  const [errorMessage, setErrorMessage] = useState("");

  let metricsSocketEndpoint = null;
  if (socketBaseURL && selectedNode) {
    metricsSocketEndpoint = `${socketBaseURL}&podName=${selectedNode.id}&instanceId=${resourceInstanceId}`;
  }
  // else if (socketBaseURL && resourceKey && mainResourceHasCompute) {
  //   metricsSocketEndpoint = `${socketBaseURL}&podName=${resourceKey}-0&instanceId=${resourceInstanceId}`;
  // }

  const socketOpenTime = useRef(null);
  const [isMetricsDataLoaded, setIsMetricsDataLoaded] = useState(false);
  const [socketConnectionStatus, setConnectionStatus] = useState(
    connectionStatuses.idle
  );
  const numConnectError = useRef(0);
  const [cpuUsageData, setCpuUsageData] = useState({
    current: "",
    data: [],
  });

  const [memUsagePercentData, setMemUsagePercentData] = useState({
    current: "",
    data: [],
  });

  const [loadAverage, setLoadAverage] = useState({
    current: "",
    data: [],
  });

  const [totalMemoryGiB, setTotalMemoryGiB] = useState(null);
  const [memoryUsageGiB, setMemoryUsageGiB] = useState(null);
  const [memoryUsagePercent, setMemoryUsagePercent] = useState(null);
  const [systemUptimeHours, setSystemUptimeHours] = useState(null);
  const [diskIOPSReadLabels, setDiskIOPSReadLabels] = useState([]);
  const [diskIOPSWriteLabels, setDiskIOPSWriteLabels] = useState([]);
  const [diskThroughputReadLabels, setDiskThroughputReadLabels] = useState([]);
  const [diskThroughputWriteLabels, setDiskThroughputWriteLabels] = useState(
    []
  );
  const [netThroughputReceiveLabels, setNetThroughputReceiveLabels] = useState(
    []
  );
  const [netThroughputSendLabels, setNetThroughputSendLabels] = useState([]);
  const [diskIOPSRead, setDiskIOPSRead] = useState([]);
  const [diskIOPSWrite, setDiskIOPSWrite] = useState([]);
  const [diskThroughputRead, setDiskThroughputRead] = useState([]);
  const [diskThroughputWrite, setDiskThroughputWrite] = useState([]);
  const [netThroughputReceive, setNetThroughputReceive] = useState([]);
  const [netThroughputSend, setNetThroughputSend] = useState([]);
  const [diskPathLabels, setDiskPathLabels] = useState([]);
  const [diskUsage, setDiskUsage] = useState([]);
  const [customMetricsChartData, setCustomMetricsChartData] = useState({});

  const handleIncomingMetricEvent = (data) => {
    const messageTime = data.UnixEpochTimestamp;

    const metrics = data.Metrics;

    const formattedDate = formatDateUTC(messageTime * 1000);

    if (isOlderThanFourHours(messageTime)) {
    } else {
      //Start displaying metrics as soon as we receive data that is 2 min 10 seconds older than socket opening timestamp. We don't show the charts immediately as we wait and collect data to prevent too many rerenders
      if (
        socketOpenTime.current &&
        socketOpenTime.current - messageTime <= 140 &&
        !isMetricsDataLoaded
      ) {
        setIsMetricsDataLoaded(true);
      }

      if (metrics) {
        let loadAverage = null;
        let cpuUsage = null;
        let memoryUsageBytes = null;
        let totalMemoryBytes = null;
        let memoryUsagePercent = null;
        let systemUptime = null;
        const diskIOPSRead = { time: formattedDate };
        const diskIOPSWrite = { time: formattedDate };
        const diskThroughputRead = { time: formattedDate };
        const diskThroughputWrite = { time: formattedDate };
        const netThroughputReceive = { time: formattedDate };
        const netThroughputSend = { time: formattedDate };
        const diskUsage = { time: formattedDate };

        const customMetricsData = {};

        metrics.forEach((metric) => {
          if (metric.Name === "cpu_usage") {
            cpuUsage = metric;
          }
          if (metric.Name === "load_avg" && metric.Labels.period === "5min") {
            loadAverage = metric;
          }
          if (metric.Name === "mem_usage_bytes") {
            memoryUsageBytes = metric;
          }
          if (metric.Name === "mem_total_bytes") {
            totalMemoryBytes = metric;
          }
          if (metric.Name === "mem_total_bytes") {
            totalMemoryBytes = metric;
          }
          if (metric.Name === "mem_usage_percent") {
            memoryUsagePercent = metric;
            metricMemUsagePercentData(memoryUsagePercent, formattedDate);
          }
          if (metric.Name === "system_uptime_seconds") {
            systemUptime = metric;
          }
          if (
            metric.Name === "disk_ops_per_sec" &&
            metric.Labels.type === "read"
          ) {
            const value = metric.Value;
            const label = metric.Labels.disk;

            setDiskIOPSReadLabels((prev) => {
              const isAlreadyPresent = prev.find(
                (diskLabel) => diskLabel === label
              );

              if (!isAlreadyPresent) {
                return [...prev, label];
              } else {
                return prev;
              }
            });
            diskIOPSRead[label] = value;
          }

          if (
            metric.Name === "disk_ops_per_sec" &&
            metric.Labels.type === "write"
          ) {
            const value = metric.Value;
            const label = metric.Labels.disk;

            setDiskIOPSWriteLabels((prev) => {
              const isAlreadyPresent = prev.find(
                (diskLabel) => diskLabel === label
              );

              if (!isAlreadyPresent) {
                return [...prev, label];
              } else {
                return prev;
              }
            });

            diskIOPSWrite[label] = value;
          }

          if (
            metric.Name === "disk_throughput_bytes_per_sec" &&
            metric.Labels.type === "read"
          ) {
            const value = Number(
              Number(metric.Value / Math.pow(1024, 2)).toFixed(2)
            );
            const label = metric.Labels.disk;

            setDiskThroughputReadLabels((prev) => {
              const isAlreadyPresent = prev.find(
                (diskLabel) => diskLabel === label
              );

              if (!isAlreadyPresent) {
                return [...prev, label];
              } else {
                return prev;
              }
            });

            diskThroughputRead[label] = value;
          }

          if (
            metric.Name === "disk_throughput_bytes_per_sec" &&
            metric.Labels.type === "write"
          ) {
            const value = Number(
              Number(metric.Value / Math.pow(1024, 2)).toFixed(2)
            );
            const label = metric.Labels.disk;

            setDiskThroughputWriteLabels((prev) => {
              const isAlreadyPresent = prev.find(
                (diskLabel) => diskLabel === label
              );

              if (!isAlreadyPresent) {
                return [...prev, label];
              } else {
                return prev;
              }
            });

            diskThroughputWrite[label] = value;
          }

          if (
            metric.Name === "net_throughput_bytes_per_sec" &&
            metric.Labels.direction === "recv"
          ) {
            const value = Number(
              Number(metric.Value / Math.pow(1024, 2)).toFixed(2)
            );
            const label = metric.Labels.interface;

            setNetThroughputReceiveLabels((prev) => {
              const isAlreadyPresent = prev.find(
                (interfaceLabel) => interfaceLabel === label
              );

              if (!isAlreadyPresent) {
                return [...prev, label];
              } else {
                return prev;
              }
            });

            netThroughputReceive[label] = value;
          }

          if (
            metric.Name === "net_throughput_bytes_per_sec" &&
            metric.Labels.direction === "sent"
          ) {
            const value = Number(
              Number(metric.Value / Math.pow(1024, 2)).toFixed(2)
            );
            const label = metric.Labels.interface;

            setNetThroughputSendLabels((prev) => {
              const isAlreadyPresent = prev.find(
                (interfaceLabel) => interfaceLabel === label
              );

              if (!isAlreadyPresent) {
                return [...prev, label];
              } else {
                return prev;
              }
            });

            netThroughputSend[label] = value;
          }

          if (metric.Name === "disk_usage_percent") {
            const value = Math.round(metric.Value);
            const label = metric.Labels.path;
            setDiskPathLabels((prev) => {
              const isAlreadyPresent = prev.find((path) => path === label);

              if (!isAlreadyPresent) {
                return [...prev, label];
              } else {
                return prev;
              }
            });

            diskUsage[label] = value;
          }

          const customMetricMatch = customMetrics.find(
            (metricInfo) => metricInfo.metricName === metric.Name
          );

          if (customMetricMatch) {
            const labelName = metric.Labels.series_name;
            const value = metric.Value;

            //check if single line chart or multiline chart by looking at labels length
            //if labels length > 0, multiline
            if (customMetricMatch.labels.length > 0) {
              if (customMetricMatch.labels.includes(labelName)) {
                //check if value of some other label is already set
                if (customMetricsData[metric.Name]) {
                  customMetricsData[metric.Name] = {
                    ...customMetricsData[metric.Name],
                    [labelName]: value,
                    time: formattedDate,
                  };
                } else {
                  customMetricsData[metric.Name] = {
                    [labelName]: value,
                    time: formattedDate,
                  };
                }
              }
            } else {
              //single line chart data
              customMetricsData[metric.Name] = {
                x: formattedDate,
                y: value,
              };
            }
          }
        });

        //make sure each custom metric's data is available before appliying state update
        customMetrics.forEach((customMetricInfo) => {
          const { metricName, labels } = customMetricInfo;
          if (!(metricName in customMetricsData)) {
            //if data is not present, set default value based on whether it's single line or multi line chart
            //multiline
            if (labels.length > 0) {
              customMetricsData[metricName] = { time: formattedDate };
            } else {
              customMetricsData[metricName] = {
                x: formattedDate,
              };
            }
          }
        });

        //console.log("New custom Data point", customMetricsData)
        //set custom metrics chart data
        setCustomMetricsChartData((prev) => {
          const updatedData = {};
          Object.entries(prev).forEach(([metricName, prevMetricDataArray]) => {
            const newDataPoint = customMetricsData[metricName];

            if (prevMetricDataArray.length >= maxDataPoints) {
              updatedData[metricName] = [
                ...prevMetricDataArray.slice(1, maxDataPoints),
                newDataPoint,
              ];
            } else {
              updatedData[metricName] = [...prevMetricDataArray, newDataPoint];
            }
          });

          return updatedData;
        });

        //Set CPU Usage
        let value = null;
        if (cpuUsage) {
          value = Math.round(cpuUsage.Value);
        }

        setCpuUsageData((prev) => {
          if (prev.data.length === maxDataPoints) {
            return {
              current: !isNaN(value) && value !== null ? value : prev.current,
              data: [
                ...prev.data.slice(1, maxDataPoints),
                {
                  x: formattedDate,
                  y: value,
                },
              ],
            };
          } else {
            return {
              current: !isNaN(value) && value !== null ? value : prev.current,
              data: [
                ...prev.data,
                {
                  x: formattedDate,
                  y: value,
                },
              ],
            };
          }
        });

        //Set loadaverage
        let loadAverageValue = null;
        if (loadAverage) {
          loadAverageValue = loadAverage.Value;
        }
        setLoadAverage((prev) => {
          if (prev.data.length === maxDataPoints) {
            return {
              current:
                !isNaN(loadAverageValue) && loadAverageValue !== null
                  ? loadAverageValue
                  : prev.current,
              data: [
                ...prev.data.slice(1, maxDataPoints),
                {
                  x: formattedDate,
                  y: loadAverageValue,
                },
              ],
            };
          } else {
            return {
              current:
                !isNaN(loadAverageValue) && loadAverageValue !== null
                  ? loadAverageValue
                  : prev.current,
              data: [
                ...prev.data,
                {
                  x: formattedDate,
                  y: loadAverageValue,
                },
              ],
            };
          }
        });

        //Set memory bytes
        if (memoryUsageBytes) {
          const value = memoryUsageBytes.Value;
          setMemoryUsageGiB(Number(value / Math.pow(1024, 3)).toFixed(2));
        }

        if (totalMemoryBytes) {
          const value = totalMemoryBytes.Value;
          setTotalMemoryGiB(Number(value / Math.pow(1024, 3)).toFixed(2));
        }

        if (memoryUsagePercent) {
          const value = Number(memoryUsagePercent.Value).toFixed(0);

          setMemoryUsagePercent(value);
        }
        if (systemUptime) {
          const value = systemUptime.Value;
          let sysUptimeHours = 0;
          if (value > 0) {
            sysUptimeHours = Number(value / 3600).toFixed(1);
          }
          setSystemUptimeHours(sysUptimeHours);
        }

        if (diskIOPSRead) {
          setDiskIOPSRead((prev) => {
            if (prev.length === maxDataPoints) {
              return [...prev.slice(1, maxDataPoints), diskIOPSRead];
            } else {
              return [...prev, diskIOPSRead];
            }
          });
        }

        if (diskIOPSWrite) {
          setDiskIOPSWrite((prev) => {
            if (prev.length === maxDataPoints) {
              return [...prev.slice(1, maxDataPoints), diskIOPSRead];
            } else {
              return [...prev, diskIOPSRead];
            }
          });
        }

        if (diskThroughputRead) {
          setDiskThroughputRead((prev) => {
            if (prev.length === maxDataPoints) {
              return [...prev.slice(1, maxDataPoints), diskThroughputRead];
            } else {
              return [...prev, diskThroughputRead];
            }
          });
        }

        if (diskThroughputWrite) {
          setDiskThroughputWrite((prev) => {
            if (prev.length === maxDataPoints) {
              return [...prev.slice(1, maxDataPoints), diskThroughputWrite];
            } else {
              return [...prev, diskThroughputWrite];
            }
          });
        }

        if (netThroughputReceive) {
          setNetThroughputReceive((prev) => {
            if (prev.length === maxDataPoints) {
              return [...prev.slice(1, maxDataPoints), netThroughputReceive];
            } else {
              return [...prev, netThroughputReceive];
            }
          });
        }

        if (netThroughputSend) {
          setNetThroughputSend((prev) => {
            if (prev.length === maxDataPoints) {
              return [...prev.slice(1, maxDataPoints), netThroughputSend];
            } else {
              return [...prev, netThroughputSend];
            }
          });
        }

        if (diskUsage) {
          setDiskUsage((prev) => {
            if (prev.length === maxDataPoints) {
              return [...prev.slice(1, maxDataPoints), diskUsage];
            } else {
              return [...prev, diskUsage];
            }
          });
        }
      }
    }
  };

  const { getWebSocket } = useWebSocket(metricsSocketEndpoint, {
    onOpen: () => {
      setIsMetricsDataLoaded(false);
      socketOpenTime.current = Date.now() / 1000;
      setConnectionStatus(connectionStatuses.connected);
      numConnectError.current = 0;
    },
    onError: () => {
      // console.log("Error socket", event);
      numConnectError.current = numConnectError.current + 1;
    },
    onMessage: (event) => {
      const data = JSON.parse(event.data);
      handleIncomingMetricEvent(data);
    },
    onClose: () => {
      //console.log("Socket connection closed");
    },
    shouldReconnect: () => true,
    reconnectAttempts: 3,
    retryOnError: true,
    reconnectInterval: (attemptNumber) => {
      const interval = Math.pow(2, attemptNumber) * 1000;
      return interval;
    },
    onReconnectStop: () => {
      // console.log("Stopping", numAttempts);
      if (isMetricsDataLoaded) {
        snackbar.showError(
          "Unable to get the latest data. The displayed data might be outdated"
        );
      } else {
        // snackbar.showError("Unable to get the latest data...");
        setErrorMessage(
          "Can't access metrics data. Please check if the instance is available and metrics are enabled."
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
      //console.log("Running cleanup");
      const socket = getWebSocket();
      if (socket) {
        //console.log("Socket", socket);
        socket.close();
        //console.log("Closing metrics socket");
      }
    };
  }, [metricsSocketEndpoint]);

  const initialiseCustomMetricsData = useCallback(() => {
    const initialCustomMetricData = customMetrics.reduce((acc, curr) => {
      const { metricName } = curr;
      acc[metricName] = [];
      return acc;
    }, {});
    setCustomMetricsChartData(initialCustomMetricData);
  }, [customMetrics]);

  //initialise custom metrics data
  useEffect(() => {
    initialiseCustomMetricsData();
  }, [initialiseCustomMetricsData]);

  if (!metricsSocketEndpoint || errorMessage) {
    return (
      <ContainerCard>
        <Stack direction="row" justifyContent="center" marginTop="200px">
          <Text size="xlarge">
            {errorMessage ||
              `Metrics are not available ${
                instanceStatus !== "RUNNING"
                  ? "as the instance is not running"
                  : ""
              }`}
          </Text>
        </Stack>
      </ContainerCard>
    );
  }

  //console.log("connectionStatus", connectionStatus);
  function initialiseMetricsData() {
    setCpuUsageData(initialCpuUsage);
    setLoadAverage(initialLoadAverage);
    setMemUsagePercentData(initialMemUsagePercentData);
    setTotalMemoryGiB(null);
    setMemoryUsageGiB(null);
    setMemoryUsagePercent(null);
    setSystemUptimeHours(null);
    setDiskIOPSReadLabels([]);
    setDiskIOPSWriteLabels([]);
    setDiskThroughputReadLabels([]);
    setDiskThroughputWriteLabels([]);
    setNetThroughputReceiveLabels([]);
    setNetThroughputSendLabels([]);
    setDiskIOPSRead([]);
    setDiskIOPSWrite([]);
    setDiskThroughputRead([]);
    setDiskThroughputWrite([]);
    setNetThroughputReceive([]);
    setNetThroughputSend([]);
    setDiskPathLabels([]);
    setDiskUsage([]);
  }

  function metricMemUsagePercentData(memoryUsagePercent, formattedDate) {
    if (memoryUsagePercent && formattedDate) {
      const value = Math.round(memoryUsagePercent.Value);
      setMemUsagePercentData((prev) => {
        if (prev.data.length === maxDataPoints) {
          return {
            current: value,
            data: [
              ...prev.data.slice(1, maxDataPoints),
              {
                x: formattedDate,
                y: value,
              },
            ],
          };
        } else {
          return {
            current: value,
            data: [
              ...prev.data,
              {
                x: formattedDate,
                y: value,
              },
            ],
          };
        }
      });
    }
  }

  function handleNodeChange(event) {
    setIsMetricsDataLoaded(false);
    const { value } = event.target;
    initialiseMetricsData();
    initialiseCustomMetricsData();
    setSelectedNode(value);
  }

  //console.log("Is metrics data loaded", isMetricsDataLoaded);

  // if (socketConnectionStatus === connectionStatuses.failed) {
  //   return <ConnectionFailureUI />;
  // }

  if (
    !isMetricsDataLoaded &&
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
          Connected to the server, metrics will be available shortly
        </Text>
      </Stack>
    );
  }
  if (!isMetricsDataLoaded) {
    return <LoadingSpinner />;
  }

  //console.log("Is metrics data loaded", isMetricsDataLoaded);

  return (
    <ContainerCard>
      <Stack
        sx={{
          //marginTop: "46px",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
        alignItems="center"
      >
        <DataGridHeaderTitle
          title={`Metrics`}
          desc="Metrics for monitoring and performance insights"
          count={10 + customMetrics?.length}
          units={{
            singular: "Metric",
            plural: "Metrics",
          }}
        />
        {nodes?.length > 0 && (
          <Box>
            <Text size="small" weight="medium" color="#344054" ml="5px">
              Node ID
            </Text>
            <Select
              value={selectedNode}
              sx={{
                width: "auto",
                height: "40px !important",
                padding: "10px 14px !important",
                minHeight: "40px",
                maxWidth: "250px",
              }}
              onChange={handleNodeChange}
              MenuProps={{ disableScrollLock: true }}
            >
              {nodes.map((node) => (
                <MenuItem
                  value={node}
                  key={node.id}
                  sx={{
                    whiteSpace: "normal",
                    wordBreak: "break-all",
                    maxWidth: "255px",
                  }}
                >
                  {node.displayName}
                </MenuItem>
              ))}
            </Select>
          </Box>
        )}
      </Stack>
      <Divider sx={{ marginTop: "12px" }} />

      <Box display="flex" alignItems="stretch" gap={"12px"} mt={3}>
        <MetricCard title="CPU Usage" value={cpuUsageData.current} unit="%" />
        {productTierType !== "OMNISTRATE_MULTI_TENANCY" && (
          <MetricCard title="Load average" value={loadAverage.current} />
        )}
        {selectedNode?.storageSize && (
          <MetricCard
            title="Storage"
            value={selectedNode?.storageSize}
            unit="GiB"
          />
        )}
        <MetricCard title="Total RAM" value={totalMemoryGiB} unit="GiB" />
        <MetricCard title="Used RAM" value={memoryUsageGiB} unit="GiB" />
        <MetricCard title="RAM Usage (%)" value={memoryUsagePercent} unit="%" />
        <MetricCard
          title="System Uptime"
          value={systemUptimeHours}
          unit="hrs"
        />
      </Box>
      <MetricsContainerCard>
        <CpuUsageChart data={cpuUsageData.data} />
      </MetricsContainerCard>
      <MetricsContainerCard>
        <MemUsagePercentChart data={memUsagePercentData.data} />
      </MetricsContainerCard>

      {productTierType !== "OMNISTRATE_MULTI_TENANCY" && (
        <MetricsContainerCard>
          <LoadAverageChart data={loadAverage.data} />
        </MetricsContainerCard>
      )}

      <MetricsContainerCard>
        <DiskUsageChart data={diskUsage} labels={diskPathLabels} />
      </MetricsContainerCard>

      <MetricsContainerCard>
        <DiskIOPSReadChart data={diskIOPSRead} labels={diskIOPSReadLabels} />
      </MetricsContainerCard>

      <MetricsContainerCard>
        <DiskIOPSWriteChart data={diskIOPSWrite} labels={diskIOPSWriteLabels} />
      </MetricsContainerCard>

      <MetricsContainerCard>
        <DiskThroughputChart
          chartName="Disk Throughput (Read)"
          data={diskThroughputRead}
          labels={diskThroughputReadLabels}
        />
      </MetricsContainerCard>

      <MetricsContainerCard>
        <DiskThroughputChart
          chartName="Disk Throughput (Write)"
          data={diskThroughputWrite}
          labels={diskThroughputWriteLabels}
        />
      </MetricsContainerCard>
      {productTierType !== "OMNISTRATE_MULTI_TENANCY" && (
        <>
          <MetricsContainerCard>
            <NetworkThroughputChart
              chartName="Network Throughput (Receive)"
              data={netThroughputReceive}
              labels={netThroughputReceiveLabels}
            />
          </MetricsContainerCard>
          <MetricsContainerCard>
            <NetworkThroughputChart
              chartName="Network Throughput (Send)"
              data={netThroughputSend}
              labels={netThroughputSendLabels}
            />
          </MetricsContainerCard>
        </>
      )}
      {customMetrics //show metrics for selected node resource type
        .filter((metric) => {
          if (selectedNode)
            return metric.resourceKey === selectedNode?.resourceKey;
          //else assume it's a serverless resource and filter by the main resource key
          else return metric.resourceKey === resourceKey;
        })
        .map((metricInfo) => {
          const { metricName, labels } = metricInfo;
          if (labels.length > 0)
            return (
              <MetricsContainerCard key={metricName}>
                <MultiLineChart
                  chartName={metricName}
                  data={customMetricsChartData[metricName]}
                  labels={labels}
                  key={metricName}
                />
              </MetricsContainerCard>
            );
          else
            return (
              <MetricsContainerCard key={metricName}>
                <SingleLineChart
                  chartName={metricName}
                  data={customMetricsChartData[metricName]}
                  key={metricName}
                />
              </MetricsContainerCard>
            );
        })}
    </ContainerCard>
  );
}

export default Metrics;

function isOlderThanFourHours(unixTimestampSeconds) {
  const currentTimestamp = Date.now() / 1000;
  const timeDifferenceInSeconds = currentTimestamp - unixTimestampSeconds;
  if (timeDifferenceInSeconds / 3600 > 4) {
    return true;
  }
  return false;
}

export const MetricsCardsContainer = styled(Box)({
  display: "grid",
  gridTemplateColumns: "repeat(5, 1fr)",
  columnGap: "24px",
});

// const ConnectionFailureUI = () => {
//   return (
//     <Card
//       mt={3}
//       sx={{
//         paddingTop: "12.5px",
//         paddingLeft: "20px",
//         paddingRight: "20px",
//         minHeight: "500px",
//       }}
//     >
//       <Stack direction="row" justifyContent="center" marginTop="200px">
//         <Text size="xlarge">Failed to get metrics data</Text>
//       </Stack>
//     </Card>
//   );
// };
