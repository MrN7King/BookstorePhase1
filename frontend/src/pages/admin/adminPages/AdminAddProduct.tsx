//file: frontend/src/pages/admin/adminForm/FormElements.tsx
import AddEbook from "../adminForm/AddEbook";
import PageBreadcrumb from "../adminComponents/PageBreadCrumb";

export default function FormElements() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Add Ebook" />
      <div className="grid grid-cols-1 gap-6">
        <div className="space-y-6">
          <AddEbook/>
        </div>
        {/* <div className="space-y-6"> */}
          {/* <InputGroup />
          <FileInputExample />
          <CheckboxComponents />
          <RadioButtons />
          <ToggleSwitch />
          <DropzoneComponent /> */}
        {/* </div> */}
      </div>
    </div>
  );
}