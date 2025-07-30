// File: frontend/src/pages/admin/adminForm/AddPremiumAccountsCodes.tsx
import ComponentCard from "../adminComponents/ComponentCard.tsx";
import { useState, useRef } from 'react';
import PremiumAccountsTable, { PremiumAccountsTableRef, PremiumProduct } from '../adminComponents/PremiumAccountsTable.tsx';
import PremiumCodesTable from '../adminComponents/PremiumCodesTable.tsx';
import TextArea from '../adminForm/input/TextArea';
import Button from '../adminUI/Button';
import axios from 'axios';
import EditPremiumProductForm from "./EditPremiumProductForm.tsx";


export default function AddPremiumAccountsCodes() {

    const tableRef = useRef<PremiumAccountsTableRef>(null);

    const [selected, setSelected] = useState<PremiumProduct | null>(null);
    const [codeInput, setCodeInput] = useState('');
    const [message, setMessage] = useState<string | null>(null);

    const handleSelect = (product: PremiumProduct) => {
        setSelected(product);
        setCodeInput('');
        setMessage(null);
    };

    const handleAddCodes = async () => {
        if (!selected) return;
        const codes = codeInput.split('\n').map((c) => c.trim()).filter(Boolean);
        try {
            const api = axios.create({ baseURL: 'http://localhost:5000/api' });
            await api.post('/premium/codes/bulk', { productId: selected._id, codes });
            setMessage('Codes added successfully');
            setCodeInput('');
        } catch (err) {
            setMessage('Error adding codes');
        }
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
                        <PremiumAccountsTable ref={tableRef} onSelect={handleSelect} />
                    </ComponentCard>
                </div>

                {/* Add Codes Section */}
                <div className="col-span-12 xl:col-span-6">
                    <ComponentCard title="Add Premium Account Codes">

                        {selected && (
                            <div className="mb-4">
                                <p className="text-gray-700 dark:text-gray-300 mb-2">Existing Codes for Selected Product</p>
                                <PremiumCodesTable productId={selected._id} />
                            </div>
                        )}
                        <p className="text-gray-700 dark:text-gray-300 mb-2">
                            Enter New codes here (one per line).
                        </p>

                        {selected ? (
                            <>
                                <TextArea
                                    value={codeInput}
                                    onChange={setCodeInput}
                                    placeholder="Enter codes here..."
                                    rows={6}
                                />
                                <div className="mt-2 flex justify-center">
                                    <Button variant="primary" onClick={handleAddCodes}>
                                        Add Codes
                                    </Button>
                                </div>
                                {message && <p className="text-sm mt-2">{message}</p>}
                            </>
                        ) : (
                            <p className="text-gray-600 dark:text-gray-300">Please select a product first.</p>
                        )}
                        {/* You can place a <TextArea> and a submit button here */}
                    </ComponentCard>
                </div>

                {/* Edit Product Section */}
                <div className="col-span-12 xl:col-span-6">
                    <ComponentCard title="Edit Premium Product Details">
                        {selected ? (
                            <EditPremiumProductForm
                                productId={selected._id}
                                onSaved={(updated) => {
                                    setSelected(updated);
                                    setMessage("Product updated");
                                    tableRef.current?.refresh();
                                }}
                                onDeleted={() => {
                                    setSelected(null);
                                    setMessage("Product deleted");
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
