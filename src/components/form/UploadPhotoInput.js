import React from "react";
import {
  Box,
  IconButton,
  Paper,
  Grid,
  styled,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import {
  DndContext,
  closestCenter,
  useSensor,
  useSensors,
  PointerSensor,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { IoAdd } from "react-icons/io5";

const UploadBox = styled(Paper)(() => ({
  width: 180,
  height: 180,
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  cursor: "pointer",
  borderRadius: 16,
  backgroundColor: "#F1F2F6",
  "&:hover": {
    backgroundColor: "#E5E6EC",
  },
  margin: "0 auto",
  boxShadow: "none",
}));

const ImageBox = styled(Paper)(() => ({
  width: 180,
  height: 180,
  position: "relative",
  borderRadius: 16,
  overflow: "visible",
  margin: "0 auto",
  boxShadow: "none",
}));

const ImageWrapper = styled(Box)({
  width: "100%",
  height: "100%",
  overflow: "hidden",
  borderRadius: 16,
  position: "relative",
});

function SortableImageItem({ id, src, onRemove, onUpload, index }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
    transition,
  };

  return (
    <Grid sx={{ width: { xs: '50%', sm: '33.33%', md: '25%' } }}>
      {src ? (
        <ImageBox ref={setNodeRef} style={style} {...attributes} {...listeners}>
          <ImageWrapper>
            <img
              src={src}
              alt={`Profile ${index + 1}`}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />

            {index === 0 && (
              <Box
                sx={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  backgroundColor: "rgba(0,0,0,0.6)",
                  color: "white",
                  padding: 0.5,
                  textAlign: "center",
                }}
              >
                <Typography variant="caption">Avatar Image</Typography>
              </Box>
            )}
          </ImageWrapper>

          <Box
            sx={{
              position: "absolute",
              top: 8,
              left: 8,
              backgroundColor: "rgba(255,255,255,0.7)",
              borderRadius: "50%",
              cursor: "grab",
              zIndex: 10,
            }}
            {...attributes}
            {...listeners}
          >
            <IconButton size="small">
              <DragIndicatorIcon />
            </IconButton>
          </Box>

          <IconButton
            size="small"
            onMouseDown={(e) => {
              e.stopPropagation();
              e.preventDefault();
              onRemove(id);
            }}
            sx={{
              position: "absolute",
              top: -4,
              right: -4,
              width: 24,
              height: 24,
              backgroundColor: "#AF2758",
              color: "white",
              zIndex: 9999,
              pointerEvents: "auto",
              "&:hover": { backgroundColor: "#951F49" },
            }}
          >
            <CloseIcon sx={{ fontSize: 16 }} />
          </IconButton>
        </ImageBox>
      ) : (
        <UploadBox onClick={() => onUpload(id)}>
          <IoAdd size={24} color="#7D2262" />
          <p className="text-[#7D2262] text-sm pt-2.5">Upload Photo</p>
        </UploadBox>
      )}
    </Grid>
  );
}

export default function UploadPhotoInput({ name, value, onChange }) {
  const sensors = useSensors(useSensor(PointerSensor));
  const items = Array.isArray(value)
    ? value
    : Array.from({ length: 5 }, (_, i) => ({ id: `img${i + 1}`, src: "" }));

  const handleUpload = (id) => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";

    fileInput.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        // ✅ เช็คว่าเป็นรูปภาพ
        if (!file.type.startsWith("image/")) {
          alert("Please upload a valid image file.");
          return;
        }
    
        // ✅ เช็คขนาดไม่เกิน 2MB
        const maxSizeInMB = 2;
        if (file.size > maxSizeInMB * 1024 * 1024) {
          alert(`File is too large. Maximum size is ${maxSizeInMB}MB.`);
          return;
        }
    
        const reader = new FileReader();
        reader.onload = (event) => {
          const current = Array.isArray(value)
            ? value
            : Array.from({ length: 5 }, (_, i) => ({
                id: `img${i + 1}`,
                src: "",
              }));
    
          const updated = current.map((item) =>
            item.id === id ? { ...item, src: event.target.result, file } : item
          );
    
          onChange(updated);
        };
        reader.readAsDataURL(file);
      }
    };
    

    fileInput.click();
  };

  const handleRemove = (id) => {
    const updated = items.map((item) =>
      item.id === id ? { ...item, src: "", file: null } : item
    );
    onChange(updated);
  };

  const handleDragEnd = ({ active, over }) => {
    if (active.id !== over.id) {
      const oldIndex = items.findIndex((i) => i.id === active.id);
      const newIndex = items.findIndex((i) => i.id === over.id);
      const newItems = arrayMove(items, oldIndex, newIndex);
      onChange(newItems);
    }
  };

  return (
    <Box>
      <Typography sx={{ fontSize: 16, fontWeight: 400, mb: 1, color: "#424C6B" }}>
        Upload at least 2 photos
      </Typography>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={items.map((item) => item.id)}
          strategy={horizontalListSortingStrategy}
        >
          <Grid container spacing={2}>
            {items.map((item, index) => (
              <SortableImageItem
                key={item.id}
                id={item.id}
                src={item.src}
                index={index}
                onRemove={handleRemove}
                onUpload={handleUpload}
              />
            ))}
          </Grid>
        </SortableContext>
      </DndContext>
    </Box>
  );
}
