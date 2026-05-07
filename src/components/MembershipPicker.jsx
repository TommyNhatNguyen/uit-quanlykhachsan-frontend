import { Select } from "antd";
import useMembershipTypes from "../hooks/useMembershipTypes";

export default function MembershipPicker({ value, onChange, placeholder = "Chọn hạng thành viên", allowClear = true, ...rest }) {
  const { data, isFetching } = useMembershipTypes();

  const options = (data?.data ?? []).map((m) => ({
    label: m.name,
    value: m.id,
  }));

  return (
    <Select
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      allowClear={allowClear}
      options={options}
      loading={isFetching}
      {...rest}
    />
  );
}
