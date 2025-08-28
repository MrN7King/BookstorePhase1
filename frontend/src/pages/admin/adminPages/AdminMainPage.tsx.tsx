// frontend/src/pages/admin/adminPages/AdminMainPage.tsx
import { Route, Routes } from "react-router-dom";
import AppLayout from "../adminLayout/AppLayout";
import { ScrollToTop } from "../adminUI/ScrollToTop";
import AdminAddPremiumAccount from "./AdminAddPremiumAccount";
import AdminAddPremiumAccountCodes from "./AdminAddPremiumCode";
import AdminAddProduct from "./AdminAddProduct";
import AdminEditEbook from "./AdminEditEbook";
import AdminUserEditPage from "./AdminUserEditPage";
import AdminUserPermissionsPage from "./AdminUserPermissionPage";
import Dashboard from "./Dashboard";
// NEW: Import the ProtectedRoute component
import ProtectedRoute from "../adminComponents/ProtectedRoute.tsx";

export default function AdminMainPage() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route element={<AppLayout />}>
          {/* Dashboard is a default permission for employees */}
          <Route index element={<ProtectedRoute permissionKey="dashboard"><Dashboard /></ProtectedRoute>} />
          
          {/* Pages requiring specific permissions */}
          <Route path="/addEbooks" element={<ProtectedRoute permissionKey="addEbooks"><AdminAddProduct /></ProtectedRoute>} />
          <Route path="/editEbooks" element={<ProtectedRoute permissionKey="editEbooks"><AdminEditEbook /></ProtectedRoute>} />
          <Route path="/addPremiumAccount" element={<ProtectedRoute permissionKey="addPremiumAccount"><AdminAddPremiumAccount /></ProtectedRoute>} />
          <Route path="/addPremiumCodes" element={<ProtectedRoute permissionKey="addPremiumCodes"><AdminAddPremiumAccountCodes /></ProtectedRoute>} />
          <Route path="/manage-users" element={<ProtectedRoute permissionKey="manageUsers"><AdminUserEditPage /></ProtectedRoute>} />
          {/* This page is restricted to owners only by the backend, but the frontend check is also crucial */}
          <Route path="/user-permissions" element={<ProtectedRoute permissionKey="userPermissions"><AdminUserPermissionsPage /></ProtectedRoute>} />
        </Route>
      </Routes>
    </>
  );
}