// File: frontend/src/pages/admin/adminForm/EditPremiumProductForm.tsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import Input from './input/InputField';
import Checkbox from './input/Checkbox';
import Select from './FormElements/Select';
import TextArea from './input/TextArea';
import Button from '../adminUI/Button';
import Alert from '../adminUI/Alert';
import { PremiumProduct } from '../adminComponents/PremiumAccountsTable';
import Label from "./FormElements/Label.tsx";

interface EditFormProps {
    productId: string;
    onSaved: (updated: PremiumProduct) => void;
    onDeleted: () => void;
}

export default function EditPremiumProductForm({ productId, onSaved, onDeleted }: EditFormProps) {
    const [product, setProduct] = useState<Partial<PremiumProduct & { description?: string; tags?: string[] }>>({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);

    useEffect(() => {
        axios.get(`http://localhost:5000/api/premium/${productId}`)
            .then(res => { setProduct(res.data); setLoading(false); })
            .catch(() => setError('Failed to load product'));
    }, [productId]);

     useEffect(() => {
        if (message) {
            const timeout = setTimeout(() => setMessage(null), 4000);
            return () => clearTimeout(timeout);
        }
    }, [message]);

    // Clear message when product changes
    useEffect(() => {
        setMessage(null);
    }, [productId]);

    const handleChange = (key: string, value: any) => {
        setProduct(prev => ({ ...prev, [key]: value }));
    };

    const handleSave = async () => {
        try {
            const res = await axios.put(`http://localhost:5000/api/premium/${productId}`, product);
            setMessage('Updated successfully');
            onSaved(res.data);
        }  catch (err: any) {
        if (
            err.response?.status === 400 &&
            err.response?.data?.code === 11000 &&
            err.response?.data?.keyPattern?.slug
        ) {
            setMessage('Slug already exists. Please choose a different one.');
        } else if (err.response?.data?.message) {
            setMessage(err.response.data.message);
        } else {
            setMessage('Update failed. Please try again.');
        }
    }

    };

    const handleDelete = async () => {
        await axios.delete(`http://localhost:5000/api/premium/${productId}`);
        onDeleted();
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <Alert variant="error" title="Error" message={error} />;

    return (
        <div className="space-y-4">
             <div>
                <Label htmlFor="name">Product Name</Label>
                <Input id="name" placeholder="Product Name" value={product.name || ''}
                    onChange={e => handleChange('name', e.target.value)} />
            </div>

            <div>
                <Label htmlFor="slug">Slug</Label>
                <Input id="slug" placeholder="Slug" value={product.slug || ''}
                    onChange={e => handleChange('slug', e.target.value)} />
            </div>

            <div>
                <Label htmlFor="description">Description</Label>
                <TextArea value={product.description || ''}
                    onChange={val => handleChange('description', val)}
                    placeholder="Description" rows={3} />
            </div>

            <div>
                <Label htmlFor="price">Price</Label>
                <Input id="price" type="number" value={product.price || ''}
                    onChange={e => handleChange('price', parseFloat(e.target.value))} />
            </div>

            <div>
                <Checkbox checked={product.isAvailable || false}
                    onChange={val => handleChange('isAvailable', val)}
                    label="Available" />
            </div>

            <div>
                <Label>Status</Label>
                <Select options={[{ value: 'active', label: 'Active' }, { value: 'inactive', label: 'Inactive' }]}
                    defaultValue={product.status}
                    onChange={val => handleChange('status', val)} />
            </div>

            <div>
                <Label htmlFor="platform">Platform</Label>
                <Input id="platform" value={product.platform || ''}
                    onChange={e => handleChange('platform', e.target.value)}
                    placeholder="Platform" />
            </div>

            <div>
                <Label htmlFor="duration">Duration</Label>
                <Input id="duration" value={product.duration || ''}
                    onChange={e => handleChange('duration', e.target.value)}
                    placeholder="Duration" />
            </div>

            <div>
                <Label>License Type</Label>
                <Select options={[{ value: 'key', label: 'Key' }, { value: 'login', label: 'Login' }, { value: 'serial', label: 'Serial' }]}
                    defaultValue={product.licenseType}
                    onChange={val => handleChange('licenseType', val)} />
            </div>

            <div className="flex gap-2 justify-center">
                <Button variant="primary" onClick={handleSave}>Save Changes</Button>
                <Button variant="destruction" onClick={handleDelete}>Delete</Button>
            </div>

            {message && <Alert variant="info" title="Note" message={message} />}
        </div>
    );
}