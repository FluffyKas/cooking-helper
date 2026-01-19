"use client";

import { useState } from "react";

interface LabelsSelectorProps {
  availableLabels: string[];
  selectedLabels: string[];
  onLabelsChange: (labels: string[]) => void;
  onNewLabelCreated?: (label: string) => void;
}

export default function LabelsSelector({
  availableLabels,
  selectedLabels,
  onLabelsChange,
  onNewLabelCreated,
}: LabelsSelectorProps) {
  const [customLabel, setCustomLabel] = useState("");

  const isLabelSelected = (label: string) =>
    selectedLabels.some((l) => l.toLowerCase() === label.toLowerCase());

  const toggleLabel = (label: string) => {
    if (isLabelSelected(label)) {
      onLabelsChange(selectedLabels.filter((l) => l.toLowerCase() !== label.toLowerCase()));
    } else {
      onLabelsChange([...selectedLabels, label]);
    }
  };

  const addCustomLabel = () => {
    const trimmed = customLabel.trim();
    if (trimmed && !isLabelSelected(trimmed)) {
      const formatted = trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase();
      onLabelsChange([...selectedLabels, formatted]);
      setCustomLabel("");

      // Notify parent if this is a new label not in availableLabels
      if (onNewLabelCreated && !availableLabels.some((l) => l.toLowerCase() === formatted.toLowerCase())) {
        onNewLabelCreated(formatted);
      }
    }
  };

  const removeLabel = (label: string) => {
    onLabelsChange(selectedLabels.filter((l) => l !== label));
  };

  return (
    <div>
      <label className="block text-sm font-medium mb-2">
        Labels <span className="text-gray-400 text-xs">(optional)</span>
      </label>

      {availableLabels.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {availableLabels.map((label) => (
            <button
              key={label}
              type="button"
              onClick={() => toggleLabel(label)}
              className={`px-3 py-1 rounded-full text-sm transition-colors ${
                isLabelSelected(label)
                  ? "bg-mint-300 text-nav-dark"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      )}

      {selectedLabels.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {selectedLabels.map((label) => (
            <span
              key={label}
              className="inline-flex items-center gap-1 px-3 py-1 bg-mint-300 text-nav-dark rounded-full text-sm"
            >
              {label}
              <button
                type="button"
                onClick={() => removeLabel(label)}
                className="hover:text-red-600"
                aria-label={`Remove ${label} label`}
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}

      <div className="flex gap-2">
        <input
          type="text"
          value={customLabel}
          onChange={(e) => setCustomLabel(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addCustomLabel();
            }
          }}
          className="flex-1 px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-mint-300 bg-gray-50 text-gray-800"
          placeholder="Add custom label and press Enter..."
        />
        <button
          type="button"
          onClick={addCustomLabel}
          className="px-4 py-2 bg-mint-200 text-nav-dark font-semibold rounded-xl hover:bg-mint-300 transition-colors"
        >
          Add
        </button>
      </div>
    </div>
  );
}
