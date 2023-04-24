import React, { useState } from "react";
import Select from "react-select";
import { MultiSelect } from "react-multi-select-component";
import ReactSelect, { components } from "react-select";
import { useEffect } from "react";

const Option = (props) => {
  return (
    <div>
      <components.Option {...props}>
        <input
          type="checkbox"
          checked={props.isSelected}
          onChange={() => null}
        />{" "}
        <label>{props.label}</label>
      </components.Option>
    </div>
  );
};

export const SelectBox = ({
  isMulti,
  isDisabled,
  options,
  name,
  className,
  onChange,
  selectedValue,
}) => {
  const customStyles = {
    control: (base) => ({
      ...base,
      height: 28,
      minHeight: 28,
    }),
    dropdownIndicator: (base) => ({
      ...base,
      paddingTop: 0,
      paddingBottom: 0,
    }),
    clearIndicator: (base) => ({
      ...base,
      paddingTop: 0,
      paddingBottom: 0,
    }),
  };

  // useEffect(() => {
  //   const data = option.unshift({ label: "Select", value: "" });
  //   setOption(data);
  // }, []);
  return (
    <>
      <Select
        className={`basic-single ${className}`}
        classNamePrefix="select"
        isMulti={isMulti}
        isSearchable={true}
        value={selectedValue?.label !== "" && selectedValue}
        isDisabled={isDisabled}
        name={name}
        defaultValue={selectedValue}
        onChange={onChange}
        selectedValue={selectedValue}
        options={options}
        styles={customStyles}
      />
    </>
  );
};

export const SelectBoxWithCheckbox = ({
  name,
  options,
  value,
  onChange,
  depends,
}) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    if (value !== "") {
      const array1 = value?.split(",");
      var result = options.filter(function (o1) {
        return array1?.some(function (o2) {
          return o1.value == o2;
        });
      });
      setData(result);
      if (depends) {
        depends(result);
      }
    }
  }, [options, value]);

  return (
    <MultiSelect
      options={options}
      onChange={(e) => {
        onChange(e, name);
        setData(e);
      }}
      labelledBy="Select"
      value={data}
    />
  );
};
