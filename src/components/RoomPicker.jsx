import { Select } from "antd";
import useRooms from "../hooks/useRooms";

export default function RoomPicker({ value, onChange, placeholder = "Chọn phòng", allowClear = true, ...rest }) {
  const { data, isFetching } = useRooms({ pageSize: 1000 });

  const options = (data?.data ?? []).map((r) => ({
    label: `#${r.room_num} — ${r.room_name}`,
    value: r.id,
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
