import { useQueryClient } from "@tanstack/react-query";
import { message, Modal } from "antd";
import React, { useState } from "react";
import { useHotelDelete } from "../../hooks/useHotels";

export default function DeleteForm({ id, ...props }) {
  const queryClient = useQueryClient();
  const { mutate: remove, isPending } = useHotelDelete();

  const onConfirm = () => {
    remove(id, {
      onSuccess: () => {
        message.success("Đã xoá chi nhánh");
        queryClient.invalidateQueries({ queryKey: ["hotels"] });
        props.onClose();
      },
      onError: () => {
        message.error("Lỗi khi xoá chi nhánh");
      },
    });
  };

  return (
    <Modal
      open={props.open}
      onCancel={props.onClose}
      onOk={onConfirm}
      okButtonProps={{ danger: true, loading: isPending }}
      title="Xoá chi nhánh"
      okText="Xoá"
      cancelText="Huỷ"
    >
      Bạn có chắc chắn muốn xoá chi nhánh này không?
    </Modal>
  );
}

export const DeleteFormTrigger = ({ children, id }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      {React.cloneElement(children, { onClick: () => setOpen(true) })}
      {open && (
        <DeleteForm id={id} open={open} onClose={() => setOpen(false)} />
      )}
    </>
  );
};
