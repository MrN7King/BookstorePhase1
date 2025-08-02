// File: frontend/src/pages/admin/adminForm/EditEbookForm.tsx
import ComponentCard from "../adminComponents/ComponentCard.tsx";
import { useState, useRef } from 'react';
import EbooksTable, { EbooksTableRef, EbookProduct } from '../adminComponents/EbookTable.tsx';
import EditEbookForm from "./EditEbook.tsx";


export default function AddPremiumAccountsCodes() {

    const tableRef = useRef<EbooksTableRef>(null);

    const [selected, setSelected] = useState<EbookProduct | null>(null);
    const [codeInput, setCodeInput] = useState('');
    const [message, setMessage] = useState<string | null>(null);

    const handleSelect = (product: EbookProduct) => {
        setSelected(product);
        setCodeInput('');
        setMessage(null);
    };

    const refreshTable = () => {
        tableRef.current?.refresh();
    };

    return (
        <>
            <div className="grid grid-cols-12 gap-4 md:gap-6">
                {/* Table Section */}
                <div className="col-span-12">
                    <ComponentCard title="Select a Premium Product to Edit or Add Codes">
                        <EbooksTable ref={tableRef} onSelect={handleSelect} />
                    </ComponentCard>
                </div>

                {/* Edit Product Section */}
                <div className="col-span-12">
                    <ComponentCard title="Edit Premium Product Details">
                        {selected ? (
                            <EditEbookForm
                                productId={selected._id}
                                onSaved={(updated) => {
                                    setSelected(updated);
                                    setMessage("Ebook updated");
                                    tableRef.current?.refresh();
                                }}
                                onDeleted={() => {
                                    setSelected(null);
                                    setMessage("Ebook deleted");
                                    tableRef.current?.refresh();
                                }}
                            />
                        ) : (
                            <p className="text-gray-600 dark:text-gray-300">Please select a product to edit.</p>
                        )}
                    </ComponentCard>
                </div>
            </div>
        </>
    );
}
