import React, { useEffect, useRef, useState } from "react";

interface ColumnFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { title: string }) => void;
}

const ColumnForm: React.FC<ColumnFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [title, setTitle] = useState("");
  const [errors, setErrors] = React.useState<{ title?: string }>({});

  const validateForm = () => {
    const newErrors: typeof errors = {};
    if (!title.trim()) {
      newErrors.title = "Column Title is required.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

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
    if (!validateForm()) return;

    onSubmit({
      title: title,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content" ref={modalRef}>
        <h2>Add New Column</h2>

        <label>Column Title</label>
        <input
          type="text"
          placeholder="e.g. To-Do"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        {errors.title && <p className="error-message">{errors.title}</p>}

        <div className="modal-buttons">
          <button className="submit-btn" onClick={handleSubmit}>
            Create New Column
          </button>
        </div>
      </div>
    </div>
  );
};

export default ColumnForm;
