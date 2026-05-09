import { useQueryClient } from "@tanstack/react-query";
import { message, Modal } from "antd";
import React, { useState } from "react";
import { useServiceItemDelete } from "../../../hooks/useServiceItems";

export default function DeleteForm({ id, ...props }) {
  const queryClient = useQueryClient();
  const { mutate: remove, isPending } = useServiceItemDelete();

  const onConfirm = () => {
    remove(id, {
      onSuccess: () => {
        message.success("Đã xoá dịch vụ");
        queryClient.invalidateQueries({ queryKey: ["service-items"] });
        props.onClose();
      },
      onError: () => {
        message.error("Lỗi khi xoá dịch vụ");
      },
    });
  };

  return (
    <Modal
      open={props.open}
      onCancel={props.onClose}
      onOk={onConfirm}
      okButtonProps={{ danger: true, loading: isPending }}
      title="Xoá dịch vụ"
      okText="Xoá"
      cancelText="Huỷ"
    >
      Bạn có chắc chắn muốn xoá dịch vụ này không?
    </Modal>
  );
}

export const DeleteFormTrigger = ({ children, id }) => {
  const [open, setOpen] = useState(false);
  return (
    <>
      {React.cloneElement(children, { onClick: () => setOpen(true) })}
      {open && <DeleteForm id={id} open={open} onClose={() => setOpen(false)} />}
    </>
  );
};
