import { useQueryClient } from "@tanstack/react-query";
import { message, Modal } from "antd";
import React, { useState } from "react";
import { useRoomTypeDelete } from "../../../hooks/useRoomTypes";

export default function DeleteForm({ id, ...props }) {
  const queryClient = useQueryClient();
  const { mutate: remove, isPending } = useRoomTypeDelete();

  const onConfirm = () => {
    remove(id, {
      onSuccess: () => {
        message.success("Đã xoá loại phòng");
        queryClient.invalidateQueries({ queryKey: ["room-types"] });
        props.onClose();
      },
      onError: () => {
        message.error("Lỗi khi xoá loại phòng");
      },
    });
  };

  return (
    <Modal
      open={props.open}
      onCancel={props.onClose}
      onOk={onConfirm}
      okButtonProps={{ danger: true, loading: isPending }}
      title="Xoá loại phòng"
      okText="Xoá"
      cancelText="Huỷ"
    >
      Bạn có chắc chắn muốn xoá loại phòng này không?
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
