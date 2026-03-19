import { currentOrg } from "../data/mockData";

const members = [
  { id: 1, name: "김민준", email: "minjun@techstart.io",   role: "관리자", status: "active",   joined: "2024-03-15" },
  { id: 2, name: "이서연", email: "seoyeon@techstart.io",  role: "멤버",   status: "active",   joined: "2024-05-20" },
  { id: 3, name: "박도현", email: "dohyun@techstart.io",   role: "멤버",   status: "active",   joined: "2024-08-11" },
  { id: 4, name: "최지우", email: "jiwoo@techstart.io",    role: "멤버",   status: "inactive", joined: "2025-01-03" },
];

export default function OrgMembers() {
  return (
    <div className="page-wrap">
      <div className="page-header-row">
        <div>
          <h1 style={s.title}>멤버 관리</h1>
          <p style={s.sub}>{currentOrg.name} · 총 {members.length}명</p>
        </div>
        <button style={s.btn}>+ 멤버 초대</button>
      </div>

      {/* 모바일: 카드 리스트 */}
      <div className="member-cards" style={s.mobileCards}>
        {members.map((m) => (
          <div key={m.id} style={s.memberCard}>
            <div style={s.memberCardTop}>
              <div style={s.memberAvatar}>{m.name[0]}</div>
              <div style={{ flex: 1 }}>
                <div style={s.memberName}>{m.name}</div>
                <div style={s.memberEmail}>{m.email}</div>
              </div>
              <span style={{ ...s.badge, background: m.status === "active" ? "#DCFCE7" : "#F1F5F9", color: m.status === "active" ? "#16A34A" : "#64748B" }}>
                {m.status === "active" ? "활성" : "비활성"}
              </span>
            </div>
            <div style={s.memberCardMeta}>
              <span style={{ ...s.badge, background: m.role === "관리자" ? "#EDE9FE" : "#F1F5F9", color: m.role === "관리자" ? "#7C3AED" : "#475569" }}>{m.role}</span>
              <span style={s.memberJoined}>가입 {m.joined}</span>
            </div>
          </div>
        ))}
      </div>

      {/* 데스크탑: 테이블 */}
      <div className="member-table-wrap" style={s.desktopTable}>
        <div className="table-wrap" style={{ background: "#fff", borderRadius: 12, boxShadow: "0 1px 3px rgba(0,0,0,0.07)", overflow: "hidden" }}>
          <table style={s.table}>
            <thead>
              <tr>{["이름", "이메일", "역할", "상태", "가입일"].map((h) => <th key={h} style={s.th}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {members.map((m) => (
                <tr key={m.id} style={s.tr}>
                  <td style={s.td}><strong>{m.name}</strong></td>
                  <td style={s.td}>{m.email}</td>
                  <td style={s.td}><span style={{ ...s.badge, background: m.role === "관리자" ? "#EDE9FE" : "#F1F5F9", color: m.role === "관리자" ? "#7C3AED" : "#475569" }}>{m.role}</span></td>
                  <td style={s.td}><span style={{ ...s.badge, background: m.status === "active" ? "#DCFCE7" : "#F1F5F9", color: m.status === "active" ? "#16A34A" : "#64748B" }}>{m.status === "active" ? "활성" : "비활성"}</span></td>
                  <td style={s.td}>{m.joined}</td>
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
  btn: { padding: "10px 18px", background: "#3B82F6", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontSize: 14, fontWeight: 600, whiteSpace: "nowrap" },
  // 모바일 카드
  mobileCards: { display: "flex", flexDirection: "column", gap: 10 },
  memberCard: { background: "#fff", borderRadius: 12, padding: "14px 16px", boxShadow: "0 1px 3px rgba(0,0,0,0.07)" },
  memberCardTop: { display: "flex", alignItems: "center", gap: 10, marginBottom: 10 },
  memberAvatar: { width: 36, height: 36, borderRadius: "50%", background: "#E2E8F0", color: "#475569", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 14, flexShrink: 0 },
  memberName: { fontSize: 14, fontWeight: 600, color: "#0F172A" },
  memberEmail: { fontSize: 12, color: "#94A3B8", marginTop: 1 },
  memberCardMeta: { display: "flex", alignItems: "center", justifyContent: "space-between" },
  memberJoined: { fontSize: 12, color: "#94A3B8" },
  badge: { padding: "3px 8px", borderRadius: 6, fontSize: 12, fontWeight: 500 },
  // 데스크탑 테이블
  desktopTable: {},
  table: { width: "100%", borderCollapse: "collapse", minWidth: 480 },
  th: { textAlign: "left", padding: "10px 16px", fontSize: 11, color: "#94A3B8", fontWeight: 600, borderBottom: "1px solid #F1F5F9", background: "#FAFAFA", textTransform: "uppercase" },
  tr: { borderBottom: "1px solid #F8FAFC" },
  td: { padding: "13px 16px", fontSize: 14, color: "#334155" },
};
