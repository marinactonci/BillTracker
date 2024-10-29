import { DeleteOutlined } from "@ant-design/icons";
import { Button, Modal } from "antd";
import { useTranslations } from "next-intl";
import React, { useState } from "react";

interface ConfirmModalProps {
  isLoading: boolean;
  onConfirm: () => void;
}

function ConfirmModal({ isLoading, onConfirm }: ConfirmModalProps) {
  const [open, setOpen] = useState(false);

  const t = useTranslations("confirm_modal");

  return (
    <>
      <Button
        className="flex items-center gap-2"
        color="danger"
        variant="solid"
        onClick={() => setOpen(true)}
      >
        <DeleteOutlined />
        <span>{t("delete")}</span>
      </Button>
      <Modal
        title={t("title")}
        centered
        open={open}
        destroyOnClose
        keyboard
        okText="Create"
        cancelText="Cancel"
        footer={null}
        onOk={() => setOpen(false)}
        onCancel={() => setOpen(false)}
      >
        <p>{t("description")}</p>
        <div className="flex items-center justify-end mt-6">
          <div className="flex gap-3">
            <Button onClick={() => setOpen(false)}>{t("cancel")}</Button>
            <Button
              onClick={onConfirm}
              type="primary"
              variant="solid"
              color="danger"
            >
              {isLoading && (
                <span className="loading loading-spinner loading-md"></span>
              )}
              {!isLoading && t("delete")}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}

export default ConfirmModal;
