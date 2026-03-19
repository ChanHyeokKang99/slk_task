import { NavLink } from "react-router-dom";
import { currentOrg } from "../data/mockData";

const navItems = [
  { path: "/", icon: "📊", label: "발송 현황" },
  { path: "/message-settings", icon: "🔑", label: "업체 설정" },
  { path: "/members", icon: "👥", label: "멤버" },
  { path: "/billing", icon: "💳", label: "정산" },
];

export default function OrgLayout({ children }) {
  return (
    <div className="org-root">
      {/* ── 데스크탑 사이드바 ── */}
      <aside className="org-sidebar">
        <div className="org-block" style={s.orgBlock}>
          <div style={s.orgAvatar}>{currentOrg.name[0]}</div>
          <div>
            <div className="org-name" style={s.orgName}>{currentOrg.name}</div>
            <div className="org-plan" style={s.orgPlan}>{currentOrg.plan} 플랜</div>
          </div>
        </div>

        <nav style={s.nav}>
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/"}
              className="nav-item"
              style={({ isActive }) => ({
                ...s.navItem,
                ...(isActive ? s.navActive : {}),
              })}
            >
              <span className="nav-icon" style={s.navIcon}>{item.icon}</span>
              <span className="sidebar-label">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="admin-block" style={s.adminBlock}>
          <div style={s.adminAvatar}>{currentOrg.adminName[0]}</div>
          <div>
            <div className="admin-name" style={s.adminName}>{currentOrg.adminName}</div>
            <div className="admin-email" style={s.adminEmail}>{currentOrg.adminEmail}</div>
          </div>
        </div>
      </aside>

      {/* ── 메인 콘텐츠 ── */}
      <main className="org-main">{children}</main>

      {/* ── 모바일 하단 탭바 ── */}
      <nav className="bottom-nav">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === "/"}
            className={({ isActive }) => isActive ? "active" : ""}
          >
            <span className="nav-icon">{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}

const s = {
  orgBlock: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "22px 18px",
    borderBottom: "1px solid #1E293B",
  },
  orgAvatar: {
    width: 36, height: 36, borderRadius: 10,
    background: "#3B82F6", color: "#fff",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontWeight: 700, fontSize: 16, flexShrink: 0,
  },
  orgName: { color: "#F1F5F9", fontSize: 13, fontWeight: 700, lineHeight: 1.3 },
  orgPlan: { color: "#475569", fontSize: 11, marginTop: 2 },
  nav: { flex: 1, padding: "10px 0" },
  navItem: {
    display: "flex", alignItems: "center", gap: 10,
    padding: "11px 18px",
    color: "#64748B", textDecoration: "none",
    fontSize: 14, fontWeight: 500,
    borderLeft: "3px solid transparent",
    transition: "all 0.12s",
  },
  navActive: {
    color: "#F1F5F9", background: "#1E293B",
    borderLeft: "3px solid #3B82F6",
  },
  navIcon: { fontSize: 15, width: 20, textAlign: "center" },
  adminBlock: {
    display: "flex", alignItems: "center", gap: 10,
    padding: "14px 18px", borderTop: "1px solid #1E293B",
  },
  adminAvatar: {
    width: 30, height: 30, borderRadius: "50%",
    background: "#334155", color: "#94A3B8",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontWeight: 700, fontSize: 13, flexShrink: 0,
  },
  adminName: { color: "#94A3B8", fontSize: 12, fontWeight: 600 },
  adminEmail: { color: "#475569", fontSize: 11 },
};
