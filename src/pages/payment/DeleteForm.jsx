import { useQueryClient } from "@tanstack/react-query";
import { message, Modal } from "antd";
import { useState } from "react";
import { usePaymentDelete } from "../../hooks/usePayments";

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
  const { mutate, isPending } = usePaymentDelete();

  const handleOk = () => {
    mutate(id, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["payments"] });
        onClose();
        message.success("Xoá thanh toán thành công");
      },
      onError: () => {
        message.error("Xoá thanh toán thất bại");
      },
    });
  };

  return (
    <Modal
      open={open}
      title="Xoá thanh toán"
      onCancel={onClose}
      onOk={handleOk}
      okText="Xoá"
      cancelText="Huỷ"
      okButtonProps={{ danger: true, loading: isPending }}
    >
      Bạn có chắc chắn muốn xoá thanh toán #{id} không?
    </Modal>
  );
}
