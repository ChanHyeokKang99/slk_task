import { BrowserRouter, Routes, Route } from "react-router-dom";
import OrgLayout from "./components/OrgLayout";
import OrgDashboard from "./pages/OrgDashboard";
import OrgMessageSettings from "./pages/OrgMessageSettings";
import OrgMembers from "./pages/OrgMembers";
import OrgBilling from "./pages/OrgBilling";

export default function App() {
  return (
    <BrowserRouter>
      <OrgLayout>
        <Routes>
          <Route path="/" element={<OrgDashboard />} />
          <Route path="/message-settings" element={<OrgMessageSettings />} />
          <Route path="/members" element={<OrgMembers />} />
          <Route path="/billing" element={<OrgBilling />} />
        </Routes>
      </OrgLayout>
    </BrowserRouter>
  );
}
