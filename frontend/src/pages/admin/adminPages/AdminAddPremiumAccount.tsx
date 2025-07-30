//file: frontend/src/pages/admin/adminPages/AdminAddPremiumAccount.tsx
import AddPremiumAccount from "../adminForm/AddPremiumAccounts";
import PageBreadcrumb from "../adminComponents/PageBreadCrumb";

export default function AdminAddPremiumAccount() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Add Premium"/>
      <div className="grid grid-cols-1 gap-6">
        <div className="space-y-6">
          <AddPremiumAccount/>
        </div>
      </div>
    </div>
  );
}