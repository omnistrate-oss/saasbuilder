import { usePagination } from "@mui/lab";
import React, { FC } from "react";
import Button from "src/components/Button/Button";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { Box, List } from "@mui/material";
import { Text } from "src/components/Typography/Typography";

type PaginationProps = {
  isPreviousDisabled?: boolean;
  isNextDisabled?: boolean;
  handlePrevious: () => void;
  handleNext: () => void;
  pageCount: number;
  pageIndex: number;
  setPageIndex: (pageIndex: number) => void;
  hidePageNumbers?: boolean;
};

const Pagination: FC<PaginationProps> = (props) => {
  const {
    isPreviousDisabled,
    isNextDisabled,
    handlePrevious,
    handleNext,
    pageCount,
    pageIndex,
    setPageIndex,
    hidePageNumbers,
  } = props;

  const { items } = usePagination({ count: pageCount, page: pageIndex + 1 });

  const filteredItems = items?.filter(
    (item) => item.type !== "previous" && item.type !== "next"
  );

  return (
    <Box
      sx={{
        width: "100%",
        height: "80px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        px: "24px",
        gap: "12px",
        borderTop: "1px solid #EAECF0",
      }}
    >
      {pageCount > 0 && hidePageNumbers && (
        <Text size="small" weight="medium">
          Page {pageIndex + 1}
        </Text>
      )}
      <Button
        size="small"
        variant="outlined"
        startIcon={<ArrowBackIcon />}
        disabled={isPreviousDisabled}
        onClick={handlePrevious}
        style={{
          marginLeft: hidePageNumbers ? "auto" : 0,
        }}
      >
        Previous
      </Button>
      {!hidePageNumbers && (
        <List sx={{ display: "flex", px: "20px", gap: "2px" }}>
          {filteredItems.map(({ page, type, selected, ...item }, index) => {
            let children: React.ReactNode | null = null;

            if (type === "start-ellipsis" || type === "end-ellipsis") {
              children = (
                <Box
                  sx={{ display: "flex", alignItems: "center", height: "100%" }}
                >
                  …
                </Box>
              );
            } else if (type === "page") {
              children = (
                <Button
                  {...item}
                  size="small"
                  variant="text"
                  sx={{
                    minWidth: 0,
                    width: 40,
                    height: 40,
                    color: selected ? "#6941C6" : "#475467",
                    background: selected ? "#F2F4F7" : "transparent",
                    "&:hover": {
                      background: "#F2F4F7",
                    },
                  }}
                  onClick={() => {
                    setPageIndex(page - 1);
                  }}
                >
                  {page}
                </Button>
              );
            }

            return <li key={index}>{children}</li>;
          })}
        </List>
      )}
      <Button
        size="small"
        variant="outlined"
        endIcon={<ArrowForwardIcon />}
        disabled={isNextDisabled}
        onClick={handleNext}
      >
        Next
      </Button>
    </Box>
  );
};

export default Pagination;
