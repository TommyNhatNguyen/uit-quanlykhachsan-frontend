import { Select } from "antd";
import useEmployees from "../hooks/useEmployees";

export default function EmployeePicker({
  value,
  onChange,
  placeholder = "Chọn nhân viên",
  allowClear = true,
  ...rest
}) {
  const { data, isFetching } = useEmployees({ pageSize: 1000 });

  const options = (data?.data ?? []).map((e) => ({
    label: `${e.name}${e.position ? ` — ${e.position}` : ""}`,
    value: e.id,
  }));

  return (
    <Select
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      allowClear={allowClear}
      options={options}
      loading={isFetching}
      showSearch
      filterOption={(input, opt) =>
        opt.label.toLowerCase().includes(input.toLowerCase())
      }
      {...rest}
    />
  );
}
