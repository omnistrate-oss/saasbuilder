import React, { FC, ReactNode, useState } from "react";
import Collapse from "@mui/material/Collapse";
import { Box, Stack } from "@mui/material";
import {
  ColumnDef,
  ExpandedState,
  Row,
  RowData,
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  TableContainer,
  DetailViewTableRow,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "./components/styled";
import Pagination from "./components/Pagination";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import { SetState } from "src/types/common/reactGenerics";

type InfiniteData<TData> = {
  pages: Array<{
    events: TData[];
    eventsSummary?: {
      eventsSummary: Record<string, number>;
    };
  }>;
  pageParams: Array<any>;
};

type CursorPaginatedDataTableProps<TData> = {
  pageIndex: number;
  setPageIndex: SetState<number>;
  columns: ColumnDef<TData, any>[];
  data?: InfiniteData<TData>;
  renderDetailsComponent?: (props: { rowData: TData }) => ReactNode;
  noRowsText: string;
  isLoading?: boolean;
  getRowCanExpand?: (rowData: Row<TData>) => boolean;
  getSubRows?: (originalRow: TData) => TData[];
  HeaderComponent: FC;
  headerProps: any;
  hasNextPage?: boolean;
  fetchNextPage?: () => void;
  isFetchingNextPage?: boolean;
  pageSize?: number;
};

const DEFAULT_COLUMN_MIN_WIDTH = 150;

const CursorPaginatedDataTable = <TData,>(
  props: CursorPaginatedDataTableProps<TData>
): ReactNode => {
  const {
    pageIndex,
    setPageIndex,
    columns,
    data,
    renderDetailsComponent,
    noRowsText,
    isLoading,
    getRowCanExpand = () => true,
    HeaderComponent,
    headerProps = {},
    getSubRows,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    pageSize = 10,
  } = props;

  const [expanded, setExpanded] = useState<ExpandedState>({});

  // Flatten all events from all pages into a single array
  const rows =
    data?.pages.reduce<TData[]>((acc, page) => {
      return [...acc, ...(page.events || [])];
    }, []) || [];

  const currentPageData = rows.slice(
    pageIndex * pageSize,
    (pageIndex + 1) * pageSize
  );

  const table = useReactTable({
    data: currentPageData,
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    columns: columns,
    state: {
      expanded,
      pagination: {
        pageIndex,
        pageSize,
      },
    },
    onExpandedChange: setExpanded,
    getRowCanExpand: getRowCanExpand,
    defaultColumn: {
      minSize: 150,
    },
    getSubRows: getSubRows,
    manualPagination: true,
    pageCount: Math.ceil(rows.length / pageSize),
    paginateExpandedRows: false,
  });

  const rowData = table.getRowModel().rows;

  const numsColumns = table.getHeaderGroups().reduce((acc, curr) => {
    if (curr.headers.length > acc) {
      acc = curr.headers.length;
      return acc;
    }
    return acc;
  }, 0);

  //returns the flex values set on the meta in coldef.
  //if flex is not set, checks if size is set. If so returns 0 else 1
  const getColumnFlexValue = (colDef: ColumnDef<TData>): number => {
    const columnSize = colDef.meta?.width;
    const isFixedColumnSizeSet = Boolean(columnSize);
    const columnFlex = colDef.meta?.flex;

    return columnFlex ? Math.min(columnFlex, 2) : isFixedColumnSizeSet ? 0 : 1;
  };

  const flexTotal = columns.reduce((acc, curr) => {
    const flexValue = getColumnFlexValue(curr);
    acc = acc + flexValue;
    return acc;
  }, 0);

  const getColumnWidthPercentage = (colDef: ColumnDef<TData>): number => {
    const flexVal = getColumnFlexValue(colDef);
    const percentage = (flexVal / flexTotal) * 100;
    return percentage;
  };

  const getColumnWidth = (colDef: ColumnDef<TData>): string | number => {
    //if flex is set on column, it takes precedence over everything else;
    let width: string | number = 150;
    const isFlexSet = Boolean(colDef.meta?.flex);
    if (isFlexSet) {
      width = `${getColumnWidthPercentage(colDef)}%`;
    } else if (colDef.meta?.width) {
      width = colDef.meta?.width;
    } else {
      width = `${getColumnWidthPercentage(colDef)}%`;
    }
    return width;
  };

  const getColumnMinWidth = (colDef: ColumnDef<TData>): string | number => {
    let minWidth = DEFAULT_COLUMN_MIN_WIDTH;
    if (colDef.meta?.minWidth) {
      minWidth = colDef.meta?.minWidth;
    } else if (colDef.meta?.width) {
      minWidth = colDef.meta?.width;
    }
    return minWidth;
  };

  return (
    <TableContainer sx={{ borderRadius: "8px" }}>
      <HeaderComponent {...headerProps} />
      <Stack minHeight="605px" justifyContent="space-between">
        <Box sx={{ overflowX: "auto", flexGrow: 1 }}>
          <Table sx={{ tableLayout: "fixed", width: "100%" }}>
            {table.getHeaderGroups().map((headerGroup) => (
              <colgroup key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <col
                    key={header.id}
                    style={{
                      width: getColumnWidth(header.column.columnDef),
                      minWidth: getColumnMinWidth(header.column.columnDef),
                    }}
                  />
                ))}
              </colgroup>
            ))}
            <TableHead>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    const sortDirection = header.column.getIsSorted();
                    const columnAlignment =
                      header.column.columnDef.meta?.align || "left";
                    return (
                      <TableCell
                        align={columnAlignment}
                        key={header.id}
                        onClick={header.column.getToggleSortingHandler()}
                        sx={{
                          cursor: "pointer",
                          "& .MuiIconButton-root": {
                            display: sortDirection ? "inline-flex" : "none",
                          },
                          "&:hover": {
                            "& .MuiIconButton-root": {
                              display: "inline-flex",
                            },
                          },
                        }}
                      >
                        <Stack
                          display="inline-flex"
                          direction="row"
                          gap="8px"
                          alignItems="center"
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                        </Stack>
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
            </TableHead>
            <TableBody>
              {!isLoading &&
                rowData.map((row) => (
                  <React.Fragment key={row.id}>
                    <TableRow>
                      {row.getVisibleCells().map((cell) => {
                        const cellValue: any = cell.getValue();
                        const columnAlignment =
                          cell.column.columnDef.meta?.align || "left";
                        let title = "";
                        if (
                          ["string", "number", "boolean"].includes(
                            typeof cellValue
                          )
                        ) {
                          title = cellValue.toString();
                        }
                        return (
                          <TableCell
                            key={cell.id}
                            align={columnAlignment}
                            title={title}
                            sx={{
                              fontSize: "14px",
                              fontWeight: "500",
                            }}
                          >
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                    {row.getIsExpanded() && renderDetailsComponent && (
                      <DetailViewTableRow>
                        <TableCell
                          sx={{
                            paddingBottom: 0,
                            paddingTop: 0,
                            whiteSpace: "normal",
                          }}
                          colSpan={numsColumns}
                        >
                          <Collapse
                            in={row.getIsExpanded()}
                            timeout="auto"
                            unmountOnExit
                          >
                            {renderDetailsComponent({
                              rowData: row.original,
                            })}
                          </Collapse>
                        </TableCell>
                      </DetailViewTableRow>
                    )}
                  </React.Fragment>
                ))}
            </TableBody>
          </Table>
        </Box>

        {(rows.length === 0 || isLoading) && (
          <Stack
            justifyContent="center"
            alignItems="center"
            fontSize="14px"
            flexGrow={1}
            height="480px"
          >
            {isLoading ? <LoadingSpinner /> : noRowsText}
          </Stack>
        )}
        <Pagination
          isPreviousDisabled={!table.getCanPreviousPage() || isLoading}
          isNextDisabled={
            (!table.getCanNextPage() && !hasNextPage) || isLoading
          }
          handlePrevious={() => {
            setPageIndex(Math.max(0, pageIndex - 1));
          }}
          handleNext={async () => {
            const nextPageIndex = pageIndex + 1;
            const totalLoadedItems = rows.length;
            const nextPageStartIndex = nextPageIndex * pageSize;

            // If we're about to show items we haven't loaded yet and there are more pages
            if (
              nextPageStartIndex >= totalLoadedItems &&
              hasNextPage &&
              !isFetchingNextPage
            ) {
              await fetchNextPage?.();
            }

            setPageIndex(nextPageIndex);
          }}
          pageCount={table.getPageCount()}
          pageIndex={pageIndex}
          setPageIndex={setPageIndex}
          hidePageNumbers
        />
      </Stack>
    </TableContainer>
  );
};

export default CursorPaginatedDataTable;

interface ColumnFlex {
  flex?: number;
  width?: number;
  minWidth?: number;
  align?: "center" | "left" | "right";
}
declare module "@tanstack/react-table" {
  /*eslint-disable-next-line*/
  interface ColumnMeta<TData extends RowData, TValue> extends ColumnFlex {}
}
