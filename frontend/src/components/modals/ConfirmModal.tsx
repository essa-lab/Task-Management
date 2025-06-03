import React, { useEffect, useRef } from "react";

interface ConfirmModalProbs {
  isOpen: boolean;
  onClose: () => void;
  type: string;
  onSubmit: () => void;
  name: string | undefined;
}

const ConfirmModal: React.FC<ConfirmModalProbs> = ({
  isOpen,
  onClose,
  onSubmit,
  type,
  name,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  const handleSubmit = () => {
    onSubmit();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2 className="modal-title">
          Delete this {type === "task" ? "Task" : "Board"}?
        </h2>
        <p className="modal-message">
          Are you sure you want to delete the ‘<strong>{name}</strong>’
          {type === "task"
            ? " Task?"
            : " board?\nThis action will remove all columns and tasks and cannot be reversed."}
        </p>
        <div className="modal-buttons">
          <button className="btn btn-delete" onClick={handleSubmit}>
            Delete
          </button>
          <button className="btn btn-cancel" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
