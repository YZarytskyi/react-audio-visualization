import React from "react";
import Select, { StylesConfig } from "react-select";

const selectStyles = (width: string): StylesConfig => ({
  control: (provided) => ({
    ...provided,
    width: width,
    height: "45px",
    borderColor: "gray",
    border: "none",
    boxShadow: "none",
    padding: "0 10px 0 0",
    backgroundColor: "#414141",
    cursor: "pointer",
    fontSize: "15px",
    fontWeight: "400",
    color: "white",
    "&:hover": {
      border: "none",
    },
  }),
  container: (provided) => ({
    ...provided,
    marginTop: "7px",
  }),
  valueContainer: (provided) => ({
    ...provided,
    padding: "0 0 0 5px",
  }),
  singleValue: (provided) => ({
    ...provided,
    color: "white",
    textAlign: "center",
  }),
  indicatorSeparator: () => ({
    display: "none",
  }),
  dropdownIndicator: (provided, state) => ({
    ...provided,
    color: "white",
    padding: "0",
    transform: state.selectProps.menuIsOpen ? "rotate(180deg)" : "rotate(0)",
    transition: "transform 200ms",
    "&:hover": {
      color: "white",
    },
  }),
  option: (provided) => ({
    ...provided,
    backgroundColor: "#414141",
    color: "white",
    cursor: "pointer",
    fontWeight: "400",
    fontSize: "15px",
    "&:hover": {
      backgroundColor: "#4b4b4b",
    },
  }),
  placeholder: (provided) => ({
    ...provided,
    color: "#9C9C9C",
    fontSize: "13px",
    fontWeight: "400",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  }),
  menu: (provided) => ({
    ...provided,
    backgroundColor: "#414141",
  }),
});

type StringTrueOrFalse = "true" | "false";

export interface SelectOptionsType<T> {
  value: T;
  label: T;
}

interface CustomSelectProps {
  options: SelectOptionsType<StringTrueOrFalse | number>[];
  defaultValue: SelectOptionsType<StringTrueOrFalse | number>[];
  placeholder?: string;
  width: string;
  onChange: (newValue: unknown) => void;
}

const CustomSelect: React.FC<CustomSelectProps> = ({
  options,
  defaultValue,
  placeholder = "Select...",
  width = "200px",
  onChange,
}) => {
  return (
    <Select
      options={options}
      placeholder={placeholder}
      isSearchable={false}
      styles={selectStyles(width)}
      defaultValue={defaultValue}
      onChange={onChange}
    />
  );
};

export default CustomSelect;
