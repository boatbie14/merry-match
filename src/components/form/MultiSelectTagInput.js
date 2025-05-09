import { Box, Chip } from "@mui/material";
import { useState, useRef } from "react";

export default function MultiSelectTagInput({
  label = "",
  name,
  value = [],
  onChange,
  placeholder = "Type and press Enter",
}) {
  const [input, setInput] = useState("");
  const inputRef = useRef(null);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && input.trim() !== "") {
      e.preventDefault();
      if (!value.includes(input.trim())) {
        const newTags = [...value, input.trim()];
        onChange?.({
          target: {
            name,
            value: newTags,
          },
        });
        setInput("");
      }
    }
  };

  const handleBlur = () => {
    if (input.trim() !== "") {
      if (!value.includes(input.trim())) {
        const newTags = [...value, input.trim()];
        onChange?.({
          target: {
            name,
            value: newTags,
          },
        });
      }
      setInput("");
    }
  };

  const handleDelete = (tagToDelete) => {
    const newTags = value.filter((tag) => tag !== tagToDelete);
    onChange?.({
      target: {
        name,
        value: newTags,
      },
    });
  };

  return (
    <Box>
      {label && (
        <Box sx={{ fontSize: "16px", fontWeight: 500, mb: 1 }}>{label}</Box>
      )}
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: "4px",
          minHeight: "48px",
          width: "100%",
          border: "1px solid #D6D9E4",
          borderRadius: "8px",
          padding: "8px",
          "&:focus-within": {
            borderColor: "#A62D82",
          },
          cursor: "text",
        }}
        onClick={() => inputRef.current?.focus()}
      >
        {value.map((tag, index) => (
          <Chip
            key={index}
            label={tag}
            onDelete={() => handleDelete(tag)}
            sx={{
              backgroundColor: "#F6EBFA",
              color: "#A62D82",
              "& .MuiChip-deleteIcon": {
                color: "#A62D82",
              },
            }}
          />
        ))}
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          placeholder={value.length === 0 ? placeholder : ""}
          style={{
            flex: "1 0 100px",
            border: "none",
            outline: "none",
            backgroundColor: "transparent",
            fontSize: "16px",
            padding: "4px",
            minWidth: "100px",
          }}
        />
      </Box>
    </Box>
  );
}
