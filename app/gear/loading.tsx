export default function GearLoading() {
  return (
    <div className="wrap section-tight">
      <div className="skel skel-line" style={{ width: 180, height: 32, marginBottom: 24 }} />
      <div className="grid-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="skel-card">
            <div className="skel skel-media" />
            <div className="skel skel-line" style={{ width: "40%" }} />
            <div className="skel skel-line" style={{ width: "75%" }} />
          </div>
        ))}
      </div>
    </div>
  );
}
