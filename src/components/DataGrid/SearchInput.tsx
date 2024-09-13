import { FC, useState, useEffect, useRef } from "react";
import { IconButton, InputAdornment } from "@mui/material";
import SearchLens from "components/Icons/SearchLens/SearchLens";
import TextField from "components/FormElementsv2/TextField/TextField";
import ClearIcon from "@mui/icons-material/Clear";
import Tooltip from "../Tooltip/Tooltip";

type SearchInputProps = {
  placeholder?: string;
  searchText: string;
  /* eslint-disable-next-line no-unused-vars*/
  setSearchText: (text: string) => void;
  width?: string;
};

const SearchInput: FC<SearchInputProps> = ({
  placeholder,
  searchText,
  setSearchText,
  width = "320px",
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null); // Reference for the TextField input

  const handleChange = () => {
    if (isExpanded && !searchText) {
      setIsExpanded(false);
    } else {
      setIsExpanded(true);
      searchRef.current?.focus(); // Focus the input when expanding
    }
  };

  // Close on outside click if searchText is empty
  useEffect(() => {
    if (searchText && !isExpanded) {
      setIsExpanded(true);
    }
  }, [searchText, isExpanded]);

  // Close on outside click if searchText is empty
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node) &&
        !searchText
      ) {
        setIsExpanded(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [searchText, containerRef]);

  return (
    <div
      ref={containerRef}
      style={{ position: "relative", display: "inline-block" }}
    >
      <TextField
        inputRef={searchRef} // Attach the ref to the TextField
        placeholder={placeholder || "Search"}
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        sx={{
          width: isExpanded ? width : "0px",
          transition: isExpanded
            ? "width 0.4s ease-out, opacity 0.4s ease-out"
            : "width 0.4s ease-in, opacity 0.4s ease-in", // Smooth transition for width and opacity
          opacity: isExpanded ? 1 : 0,
          overflow: "hidden",
          borderRadius: "8px", // Add border-radius here
          boxShadow: "none",
          "&:focus-within": {
            boxShadow:
              "0px 0px 0px 4px #F4EBFF, 0px 1px 2px 0px rgba(16, 24, 40, 0.05)",
          },
          mt: "0px",
          [`& .MuiOutlinedInput-input`]: {
            paddingLeft: "10px !important",
            paddingRight: "0px !important",
          },
          [`& .MuiInputAdornment-root`]: {
            border: "none",
            padding: "0px",
            paddingRight: "25px !important",
          },
        }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              {searchText && (
                <IconButton size="small" onClick={() => setSearchText("")}>
                  <ClearIcon />
                </IconButton>
              )}
            </InputAdornment>
          ),
        }}
      />
      <Tooltip placement={"top"} title={"Search"} isVisible={!isExpanded}>
        <IconButton
          size="small"
          onClick={handleChange}
          style={{ position: "absolute", right: "0", marginTop: "6px" }}
        >
          <SearchLens />
        </IconButton>
      </Tooltip>
    </div>
  );
};

export default SearchInput;
