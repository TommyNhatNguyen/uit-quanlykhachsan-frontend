import { useQueryClient } from "@tanstack/react-query";
import { message, Modal } from "antd";
import { useState } from "react";
import { useEmployeeDelete } from "../../hooks/useEmployees";

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
  const { mutate, isPending } = useEmployeeDelete();

  const handleOk = () => {
    mutate(id, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["employees"] });
        onClose();
        message.success("Xóa nhân viên thành công");
      },
      onError: () => {
        message.error("Xóa nhân viên thất bại");
      },
    });
  };

  return (
    <Modal
      open={open}
      title="Xoá nhân viên"
      onCancel={onClose}
      onOk={handleOk}
      okText="Xoá"
      cancelText="Huỷ"
      okButtonProps={{ danger: true, loading: isPending }}
    >
      Bạn có chắc chắn muốn xoá nhân viên này không?
    </Modal>
  );
}
