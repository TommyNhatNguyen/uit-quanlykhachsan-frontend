import { Select } from "antd";
import useCustomers from "../hooks/useCustomers";

export default function CustomerPicker({
  value,
  onChange,
  placeholder = "Chọn khách hàng",
  allowClear = true,
  ...rest
}) {
  const { data, isFetching } = useCustomers({ pageSize: 1000 });

  const options = (data?.data ?? []).map((c) => ({
    label: `${c.name}${c.phone ? ` — ${c.phone}` : ""}`,
    value: c.id,
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
