import { currentOrg } from "../data/mockData";

const invoices = [
  { month: "2026년 3월", amount: 1500000, usage: 15420, status: "paid" },
  { month: "2026년 2월", amount: 1500000, usage: 14800, status: "paid" },
  { month: "2026년 1월", amount: 1500000, usage: 16100, status: "paid" },
];

export default function OrgBilling() {
  return (
    <div className="page-wrap">
      <div style={s.header}>
        <h1 style={s.title}>요금 · 정산</h1>
        <p style={s.sub}>{currentOrg.name} · {currentOrg.plan} 플랜</p>
      </div>

      <div style={s.planCard}>
        <div style={s.planLabel}>현재 플랜</div>
        <div style={s.planName}>{currentOrg.plan}</div>
        <div style={s.planPrice}>월 1,500,000원</div>
      </div>

      <div style={s.card}>
        <div style={s.cardTitle}>청구 내역</div>
        <div className="table-wrap">
          <table style={s.table}>
            <thead>
              <tr>{["청구 월", "발송 건수", "청구 금액", "상태"].map((h) => <th key={h} style={s.th}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {invoices.map((inv) => (
                <tr key={inv.month} style={s.tr}>
                  <td style={s.td}>{inv.month}</td>
                  <td style={s.td}>{inv.usage.toLocaleString()}건</td>
                  <td style={s.td}>{inv.amount.toLocaleString()}원</td>
                  <td style={s.td}><span style={s.paidBadge}>납부 완료</span></td>
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
  header: { marginBottom: 24 },
  title: { fontSize: 22, fontWeight: 700, color: "#0F172A", margin: 0 },
  sub: { fontSize: 13, color: "#94A3B8", margin: "4px 0 0" },
  planCard: { background: "#EFF6FF", border: "1px solid #BFDBFE", borderRadius: 12, padding: "20px 24px", marginBottom: 20 },
  planLabel: { fontSize: 12, color: "#3B82F6", fontWeight: 600, textTransform: "uppercase", marginBottom: 4 },
  planName: { fontSize: 20, fontWeight: 700, color: "#1D4ED8" },
  planPrice: { fontSize: 14, color: "#3B82F6", marginTop: 4 },
  card: { background: "#fff", borderRadius: 12, padding: 24, boxShadow: "0 1px 3px rgba(0,0,0,0.07)" },
  cardTitle: { fontSize: 15, fontWeight: 600, color: "#0F172A", marginBottom: 16 },
  table: { width: "100%", borderCollapse: "collapse", minWidth: 360 },
  th: { textAlign: "left", padding: "8px 12px", fontSize: 11, color: "#94A3B8", fontWeight: 600, borderBottom: "1px solid #F1F5F9", textTransform: "uppercase", whiteSpace: "nowrap" },
  tr: { borderBottom: "1px solid #F8FAFC" },
  td: { padding: "12px 12px", fontSize: 14, color: "#334155", whiteSpace: "nowrap" },
  paidBadge: { background: "#DCFCE7", color: "#16A34A", padding: "3px 8px", borderRadius: 6, fontSize: 12, fontWeight: 600 },
};
