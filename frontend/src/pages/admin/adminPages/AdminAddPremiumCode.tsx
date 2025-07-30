//file: frontend/src/pages/admin/adminPages/AdminAddPremiumCode.tsx
import AddPremiumAccountsCodes from "../adminForm/AddPremiumAccountsCodes";
import PageBreadcrumb from "../adminComponents/PageBreadCrumb";

export default function AdminAddPremiumAccountCodes() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Add Premium Code & Edit Premium Accounts"/>
      <div className="grid grid-cols-1 gap-6">
        <div className="space-y-6">
          <AddPremiumAccountsCodes/>
        </div>
      </div>
    </div>
  );
}