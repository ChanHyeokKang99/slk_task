import { currentOrg, recentSendLogs } from "../data/mockData";

const statusStyle = {
  success: { color: "#16A34A", label: "성공" },
  fail:    { color: "#DC2626", label: "실패" },
  pending: { color: "#D97706", label: "대기" },
};

export default function OrgDashboard() {
  return (
    <div className="page-wrap">
      {/* 헤더 */}
      <div className="page-header-row">
        <div>
          <h1 style={s.title}>발송 현황</h1>
          <p style={s.sub}>2026년 3월 19일 기준</p>
        </div>
        <div style={{
          ...s.providerBadge,
          background: currentOrg.apiConfigured ? "#F0FDF4" : "#FEF2F2",
          border: `1px solid ${currentOrg.apiConfigured ? "#86EFAC" : "#FECACA"}`,
          color: currentOrg.apiConfigured ? "#16A34A" : "#DC2626",
        }}>
          {currentOrg.apiConfigured
            ? `✓ 연동 중 · ${currentOrg.messageProvider === "cloudmessage" ? "클라우드메시지" : "센드톡"}`
            : "⚠ 업체 미설정"}
        </div>
      </div>

      {/* 통계 카드 */}
      <div className="stat-grid">
        {[
          { label: "이번 달 발송", value: currentOrg.monthlyUsage.toLocaleString() + "건", icon: "✉️", color: "#3B82F6" },
          { label: "대기 중",      value: currentOrg.pendingMessages + "건",                icon: "⏳", color: "#F59E0B" },
          { label: "멤버 수",      value: currentOrg.memberCount + "명",                    icon: "👥", color: "#8B5CF6" },
        ].map((c) => (
          <div key={c.label} style={s.statCard}>
            <div style={{ ...s.statIcon, background: c.color + "18", color: c.color }}>{c.icon}</div>
            <div>
              <div style={s.statVal}>{c.value}</div>
              <div style={s.statLabel}>{c.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* 최근 발송 내역 */}
      <div style={s.card}>
        <div style={s.cardTitle}>최근 발송 내역</div>
        <div className="table-wrap">
          <table style={s.table}>
            <thead>
              <tr>{["유형", "수신번호", "상태", "시각"].map((h) => <th key={h} style={s.th}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {recentSendLogs.map((l) => (
                <tr key={l.id} style={s.tr}>
                  <td style={s.td}><span style={s.typeBadge}>{l.type}</span></td>
                  <td style={s.td}>{l.recipient}</td>
                  <td style={{ ...s.td, color: statusStyle[l.status].color, fontWeight: 600 }}>{statusStyle[l.status].label}</td>
                  <td style={s.td}>{l.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

const s = {
  title: { fontSize: 22, fontWeight: 700, color: "#0F172A", margin: 0 },
  sub: { fontSize: 13, color: "#94A3B8", margin: "4px 0 0" },
  providerBadge: { fontSize: 13, fontWeight: 600, padding: "6px 14px", borderRadius: 20, whiteSpace: "nowrap" },
  statCard: { background: "#fff", borderRadius: 12, padding: "18px 20px", display: "flex", alignItems: "center", gap: 14, boxShadow: "0 1px 3px rgba(0,0,0,0.07)" },
  statIcon: { width: 44, height: 44, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 },
  statVal: { fontSize: 22, fontWeight: 700, color: "#0F172A" },
  statLabel: { fontSize: 13, color: "#64748B", marginTop: 2 },
  card: { background: "#fff", borderRadius: 12, padding: 24, boxShadow: "0 1px 3px rgba(0,0,0,0.07)" },
  cardTitle: { fontSize: 15, fontWeight: 600, color: "#0F172A", marginBottom: 16 },
  table: { width: "100%", borderCollapse: "collapse", minWidth: 360 },
  th: { textAlign: "left", padding: "8px 12px", fontSize: 11, color: "#94A3B8", fontWeight: 600, borderBottom: "1px solid #F1F5F9", textTransform: "uppercase", whiteSpace: "nowrap" },
  tr: { borderBottom: "1px solid #F8FAFC" },
  td: { padding: "12px 12px", fontSize: 14, color: "#334155", whiteSpace: "nowrap" },
  typeBadge: { background: "#F1F5F9", color: "#475569", padding: "2px 8px", borderRadius: 6, fontSize: 12, fontWeight: 500 },
};
