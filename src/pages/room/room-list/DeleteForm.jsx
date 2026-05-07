import { useQueryClient } from "@tanstack/react-query";
import { message, Modal } from "antd";
import React, { useState } from "react";
import { useRoomDelete } from "../../../hooks/useRooms";

export default function DeleteForm({ id, ...props }) {
  const queryClient = useQueryClient();
  const { mutate: remove, isPending } = useRoomDelete();

  const onConfirm = () => {
    remove(id, {
      onSuccess: () => {
        message.success("Đã xoá phòng");
        queryClient.invalidateQueries({ queryKey: ["rooms"] });
        props.onClose();
      },
      onError: () => {
        message.error("Lỗi khi xoá phòng");
      },
    });
  };

  return (
    <Modal
      open={props.open}
      onCancel={props.onClose}
      onOk={onConfirm}
      okButtonProps={{ danger: true, loading: isPending }}
      title="Xoá phòng"
      okText="Xoá"
      cancelText="Huỷ"
    >
      Bạn có chắc chắn muốn xoá phòng này không?
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
