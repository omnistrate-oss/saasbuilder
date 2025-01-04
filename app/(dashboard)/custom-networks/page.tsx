"use client";

import PageTitle from "../components/Layout/PageTitle";
import PageContainer from "../components/Layout/PageContainer";
import CustomNetworksIcon from "../components/Icons/CustomNetworksIcon";
import DataTable from "src/components/DataTable/DataTable";
import { useMemo } from "react";
import CustomNetworksTableHeader from "./components/CustomNetworksTableHeader";
import { createColumnHelper } from "@tanstack/react-table";
import GridCellExpand from "src/components/GridCellExpand/GridCellExpand";
import RegionIcon from "src/components/Region/RegionIcon";

const columnHelper = createColumnHelper<any>(); // TODO: Add type

const CustomNetworksPage = () => {
  const dataTableColumns = useMemo(() => {
    return [
      columnHelper.accessor("region", {
        id: "region",
        header: "Region",
        cell: (data) => {
          return (
            <GridCellExpand
              value={data.row.original.region || "Global"}
              startIcon={<RegionIcon />}
            />
          );
        },
        meta: {
          minWidth: 150,
        },
      }),
    ];
  }, []);

  return (
    <PageContainer>
      <PageTitle icon={CustomNetworksIcon} className="mb-6">
        Custom Networks
      </PageTitle>

      <div>
        <DataTable
          columns={dataTableColumns}
          rows={[]}
          noRowsText="No instances"
          HeaderComponent={CustomNetworksTableHeader}
          headerProps={{}}
          isLoading={false}
        />
      </div>
    </PageContainer>
  );
};

export default CustomNetworksPage;
