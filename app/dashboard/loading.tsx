export default function DashboardLoading() {
  return (
    <div className="dash-shell">
      <div className="dash-sidebar" />
      <div className="dash-main">
        <div className="skel skel-line" style={{ width: 220, height: 30, marginBottom: 24 }} />
        <div className="stat-grid">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="card stat-card">
              <div className="skel skel-line" style={{ width: "60%" }} />
              <div className="skel skel-line" style={{ width: "40%", height: 22 }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
