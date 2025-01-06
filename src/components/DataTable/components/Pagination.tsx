import { usePagination } from "@mui/lab";
import { FC } from "react";
import Button from "src/components/Button/Button";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { Box, List } from "@mui/material";
import { styleConfig } from "src/providerConfig";

type PaginationProps = {
  isPreviousDisabled: boolean;
  isNextDisabled: boolean;
  handlePrevious: () => void;
  handleNext: () => void;
  pageCount: number;
  pageIndex: number;
  /* eslint-disable-next-line no-unused-vars*/
  setPageIndex: (pageIndex: number) => void;
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
      <Button
        size="small"
        variant="outlined"
        startIcon={<ArrowBackIcon />}
        disabled={isPreviousDisabled}
        onClick={handlePrevious}
      >
        Previous
      </Button>
      <List sx={{ display: "flex", px: "20px", gap: "2px" }}>
        {filteredItems.map(({ page, type, selected, ...item }, index) => {
          let children: null | React.ReactNode = null;

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
