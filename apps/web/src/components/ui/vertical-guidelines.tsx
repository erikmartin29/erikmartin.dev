const lineStyle: React.CSSProperties = {
  position: "absolute",
  top: 0,
  height: "100%",
  width: "1px",
  backgroundColor: "var(--guideline)",
};

export function VerticalGuidelines() {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: 1,
      }}
      aria-hidden="true"
    >
      <div
        style={{
          ...lineStyle,
          left: "calc(50% - var(--max-content-width) / 2)",
        }}
      />
      <div
        style={{
          ...lineStyle,
          left: "calc(50% + var(--max-content-width) / 2)",
        }}
      />
    </div>
  );
}
