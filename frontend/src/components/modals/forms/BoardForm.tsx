import React, { useEffect, useRef, useState } from "react";
import { Board, Column } from "@/app/types";

interface BoardFormProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "add" | "edit";
  initialData?: Board;
  onSubmit: (data: { title: string; column: Column[] }) => void;
}

const BoardForm: React.FC<BoardFormProps> = ({
  isOpen,
  onClose,
  mode,
  initialData,
  onSubmit,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [name, setName] = useState("");
  const [columns, setColumns] = useState<Column[]>([]);
  const [errors, setErrors] = React.useState<{
    name?: string;
    columns?: string[];
  }>({});

  const validateForm = () => {
    const newErrors: typeof errors = {};
    if (!name.trim()) {
      newErrors.name = "Board name is required.";
    }

    if (mode === "add") {
      const colErrors: string[] = [];

      columns.forEach((col, idx) => {
        if (!col.title.trim()) {
          colErrors[idx] = "Column name is required.";
        }
      });

      if (colErrors.length > 0) {
        newErrors.columns = colErrors;
      }
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

  useEffect(() => {
    if (mode === "edit" && initialData) {
      setName(initialData.title);
      setColumns(initialData.columns?.map((col: Column) => col) || []);
    } else {
      setName("");
      setColumns([]);
    }
  }, [isOpen, mode, initialData]);

  const addColumn = () => setColumns([...columns, { title: "" }]);
  const updateColumn = (index: number, value: Column) => {
    const updated = [...columns];
    updated[index] = value;
    setColumns(updated);
  };
  const removeColumn = (index: number) => {
    const updated = [...columns];
    updated.splice(index, 1);
    setColumns(updated);
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    onSubmit({
      title: name,
      column: columns,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content" ref={modalRef}>
        <h2>{mode === "add" ? "Add New Board" : "Edit Board"}</h2>

        <label>Board Name</label>
        <input
          type="text"
          placeholder="e.g. Web Design"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        {errors.name && <p className="error-message">{errors.name}</p>}

        {
          <>
            <label>Board Columns</label>
            <div className="columns-list">
              {columns.map((col, idx) => (
                <div key={idx} className="column-input-wrapper">
                  
                  <input
                    type="text"
                    className={`column-input ${
                      errors.columns && errors.columns[idx] ? "input-error" : ""
                    }`}
                    value={col.title}
                    placeholder={errors.columns?.[idx] || "Enter column name"}
                    onChange={(e) =>
                      updateColumn(idx, { ...col, title: e.target.value })
                    }
                  />
                  {errors.columns?.[idx] && (
    <span className="error-inside">{errors.columns[idx]}</span>
  )}
                  <button
                    type="button"
                    onClick={() => removeColumn(idx)}
                    className={`remove-column-btn ${
                      errors.columns && errors.columns[idx] ? "btn-error" : ""
                    }`}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
            <button className="add-column-btn" onClick={addColumn}>
              + Add New Column
            </button>
          </>
        }

        <div className="modal-buttons">
          <button className="submit-btn" onClick={handleSubmit}>
            {mode === "add" ? "Create New Board" : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BoardForm;
