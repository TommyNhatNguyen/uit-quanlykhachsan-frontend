import { Select } from "antd";
import useServiceItems from "../hooks/useServiceItems";

export default function ServicePicker({
  value,
  onChange,
  placeholder = "Chọn dịch vụ",
  allowClear = true,
  ...rest
}) {
  const { data, isFetching } = useServiceItems({ pageSize: 1000 });

  const options = (data?.data ?? []).map((s) => ({
    label: s.catalog ? `${s.name} (${s.catalog})` : s.name,
    value: s.id,
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
