import { useQueryClient } from "@tanstack/react-query";
import { message, Modal } from "antd";
import { useState } from "react";
import { useBookingDelete } from "../../hooks/useBookings";

export function DeleteFormTrigger({ id, children }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <span onClick={() => setOpen(true)}>{children}</span>
      {open && (
        <DeleteForm id={id} open={open} onClose={() => setOpen(false)} />
      )}
    </>
  );
}

function DeleteForm({ id, open, onClose }) {
  const queryClient = useQueryClient();
  const { mutate, isPending } = useBookingDelete();

  const handleOk = () => {
    mutate(id, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["bookings"] });
        onClose();
        message.success("Xoá đặt phòng thành công");
      },
      onError: () => {
        message.error("Xoá đặt phòng thất bại");
      },
    });
  };

  return (
    <Modal
      open={open}
      title="Xoá đặt phòng"
      onCancel={onClose}
      onOk={handleOk}
      okText="Xoá"
      cancelText="Huỷ"
      okButtonProps={{ danger: true, loading: isPending }}
    >
      Bạn có chắc chắn muốn xoá đặt phòng #{id} không?
    </Modal>
  );
}
