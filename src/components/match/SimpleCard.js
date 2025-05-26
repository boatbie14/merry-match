import React, { useState } from "react";

const SimpleCard = ({ children, onSwipe, onCardLeftScreen }) => {
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [transform, setTransform] = useState("");

  const handleTouchStart = (e) => {
    setStartX(e.touches[0].clientX);
    setStartY(e.touches[0].clientY);
    setIsDragging(true);
  };

  const handleMouseDown = (e) => {
    setStartX(e.clientX);
    setStartY(e.clientY);
    setIsDragging(true);
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    const currentX = e.touches[0].clientX;
    const currentY = e.touches[0].clientY;
    const diffX = currentX - startX;
    const diffY = currentY - startY;
    const rotation = diffX / 10;

    setTransform(`translate(${diffX}px, ${diffY}px) rotate(${rotation}deg)`);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const currentX = e.clientX;
    const currentY = e.clientY;
    const diffX = currentX - startX;
    const diffY = currentY - startY;
    const rotation = diffX / 10;

    setTransform(`translate(${diffX}px, ${diffY}px) rotate(${rotation}deg)`);
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;

    const transformStyle = transform;
    const match = transformStyle.match(/translate\(([^,]+)px,\s*([^)]+)px\)/);

    if (match) {
      const diffX = parseFloat(match[1]);
      if (diffX > 100) {
        onSwipe("right");
        setTimeout(() => onCardLeftScreen(), 300);
      } else if (diffX < -100) {
        onSwipe("left");
        setTimeout(() => onCardLeftScreen(), 300);
      }
    }

    setIsDragging(false);
    setTransform("");
  };

  const handleMouseUp = handleTouchEnd;

  return (
    <div
      style={{
        transform,
        transition: isDragging ? "none" : "transform 0.3s",
        position: "absolute",
        width: "100%",
        height: "100%",
        zIndex: 1,
        touchAction: "none",
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {children}
    </div>
  );
};

export default SimpleCard;
