"use client";

export default function Spinner({ size = 48 }: { size?: number }) {
  return (
    <div
      className="spinner-cube"
      style={{ width: size, height: size }}
    />
  );
}
