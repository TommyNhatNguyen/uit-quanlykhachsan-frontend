import { Select } from "antd";
import useBookingDetails from "../hooks/useBookingDetails";

const fmtDate = (v) => (v ? new Date(v).toLocaleDateString("vi-VN") : "?");

export default function BookingDetailPicker({
  value,
  onChange,
  placeholder = "Chọn chi tiết đặt phòng",
  allowClear = true,
  mode,
  ...rest
}) {
  const { data, isFetching } = useBookingDetails({ pageSize: 1000 });

  const options = (data?.data ?? []).map((d) => {
    const room = d.room
      ? `#${d.room.room_num} — ${d.room.room_name}`
      : `Phòng #${d.room_id}`;
    const dates = `${fmtDate(d.checkin_date)} → ${fmtDate(d.checkout_date)}`;
    return {
      label: `#${d.id} · ${room} · ${dates}`,
      value: d.id,
    };
  });

  return (
    <Select
      mode={mode}
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
