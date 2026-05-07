import { Select } from "antd";
import useRoomTypes from "../hooks/useRoomTypes";

export default function RoomTypePicker({ value, onChange, placeholder = "Chọn loại phòng", allowClear = true, ...rest }) {
  const { data, isFetching } = useRoomTypes({ pageSize: 1000 });
  const options = (data?.data ?? []).map((rt) => ({ label: rt.name, value: rt.id }));

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
