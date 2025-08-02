//file: frontend/src/pages/admin/adminPages/AdminEditEbook.tsx
import EditEbooks from "../adminForm/EditEbookForm.tsx";
import PageBreadcrumb from "../adminComponents/PageBreadCrumb";

export default function AdminEditEbook() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Edit Ebooks"/>
      <div className="grid grid-cols-1 gap-6">
        <div className="space-y-6">
          <EditEbooks/>
        </div>
      </div>
    </div>
  );
}