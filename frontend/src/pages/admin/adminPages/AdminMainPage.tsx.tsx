// src/pages/admin/adminPages/AdminMainPage.tsx
import { Route, Routes } from "react-router-dom";
import AppLayout from "../adminLayout/AppLayout";
import { ScrollToTop } from "../adminUI/ScrollToTop";
import AdminAddPremiumAccount from "./AdminAddPremiumAccount";
import AdminAddPremiumAccountCodes from "./AdminAddPremiumCode";
import AdminAddProduct from "./AdminAddProduct";
import AdminEditEbook from "./AdminEditEbook";
import AdminUserEditPage from "./AdminUserEditPage";
import Dashboard from "./Dashboard";

// Import the new UserEditPage component

export default function AdminMainPage() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route element={<AppLayout />}>
          {/* Dashboard for admin, accessed at /admin */}
          <Route index element={<Dashboard />} />
          <Route path="/Add-ebooks" element={<AdminAddProduct />} />
          <Route path="/Add-premiumAccount" element={<AdminAddPremiumAccount />} />
          <Route path="/Add-premiumCodes" element={<AdminAddPremiumAccountCodes />} />
          <Route path="/edit-ebook" element={<AdminEditEbook />} />

          {/* New route for the UserEditPage */}
         <Route path="/manage-users" element={<AdminUserEditPage />} />

          {/* Other Admin Pages (commented out) */}
          {/* ... */}
        </Route>
      </Routes>
    </>
  );
}