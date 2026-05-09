import { useQueryClient } from "@tanstack/react-query";
import { message, Modal } from "antd";
import React, { useState } from "react";
import { useServiceDetailDelete } from "../../../hooks/useServiceDetails";

export default function DeleteForm({ id, ...props }) {
  const queryClient = useQueryClient();
  const { mutate: remove, isPending } = useServiceDetailDelete();

  const onConfirm = () => {
    remove(id, {
      onSuccess: () => {
        message.success("Đã xoá");
        queryClient.invalidateQueries({ queryKey: ["service-details"] });
        props.onClose();
      },
      onError: () => {
        message.error("Lỗi khi xoá");
      },
    });
  };

  return (
    <Modal
      open={props.open}
      onCancel={props.onClose}
      onOk={onConfirm}
      okButtonProps={{ danger: true, loading: isPending }}
      title="Xoá sử dụng dịch vụ"
      okText="Xoá"
      cancelText="Huỷ"
    >
      Bạn có chắc chắn muốn xoá bản ghi dịch vụ này không?
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
