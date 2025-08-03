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
import DropzoneComponent from './FormElements/DropZone'; 
import MultiSelect from './input/MultiSelect';

interface EditFormProps {
    productId: string;
    onSaved: (updated: PremiumProduct) => void;
    onDeleted: () => void;
}

export default function EditPremiumProductForm({ productId, onSaved, onDeleted }: EditFormProps) {
    const [product, setProduct] = useState<Partial<PremiumProduct & { description?: string; tags?: string[]; thumbnailUrl?: string; }>>({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);

    const tagOptions = [
        { value: "software", text: "Software" },
        { value: "subscription", text: "Subscription" },
        { value: "license", text: "License" },
        { value: "premium", text: "Premium" },
        { value: "account", text: "Account" },
        { value: "Special-Products", text: "Special Products" },
    ];

     // thumbnail state
    const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
    const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);

    useEffect(() => {
        axios.get(`http://localhost:5000/api/premium/${productId}`)
            .then(res => { 
                setProduct(res.data); setLoading(false); 
                if (res.data.thumbnailUrl) {
                    setThumbnailPreview(res.data.thumbnailUrl);
                }
                 setLoading(false);
            })
            .catch(() => setError('Failed to load product'));
    }, [productId]);

     useEffect(() => {
        if (message) {
            const timeout = setTimeout(() => setMessage(null), 4000);
            return () => clearTimeout(timeout);
        }
    }, [message]);

    // Handle thumbnail changes
    const handleThumbnailChange = (file: File | null) => {
        setThumbnailFile(file);
        if (file) {
            const previewUrl = URL.createObjectURL(file);
            setThumbnailPreview(previewUrl);
        } else {
            setThumbnailPreview(product.thumbnailUrl || null);
        }
    };

    // Clear message when product changes
    useEffect(() => {
        setMessage(null);
    }, [productId]);

    const handleChange = (key: string, value: any) => {
        setProduct(prev => ({ ...prev, [key]: value }));
    };

    const handleSave = async () => {
         setIsUploading(true);
        setMessage(null);
        setError(null);

          try {
            const formData = new FormData();
            
            // Append text fields
            formData.append('name', product.name || '');
            formData.append('slug', product.slug || '');
            formData.append('description', product.description || '');
            formData.append('price', String(product.price || 0));
            formData.append('isAvailable', String(product.isAvailable || false));
            formData.append('status', product.status || 'active');

            formData.append('tags', product.tags ? product.tags.join(',') : '');

            formData.append('platform', product.platform || '');
            formData.append('duration', product.duration || '');
            formData.append('licenseType', product.licenseType || 'key');
            
            // Append thumbnail if changed
            if (thumbnailFile) {
                formData.append('thumbnail', thumbnailFile);
            }

            const response = await axios.put(
                `http://localhost:5000/api/premium/${productId}`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            setMessage('Product updated successfully');
            onSaved(response.data);
        } catch (err: any) {
            let errorMsg = 'Update failed. Please try again.';
            
            if (err.response?.data?.message) {
                errorMsg = err.response.data.message;
            } else if (err.message) {
                errorMsg = err.message;
            }
            
            setError(errorMsg);
        } finally {
            setIsUploading(false);
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
                <Label>Tags</Label>
                <MultiSelect 
                    label="Tags" 
                    options={tagOptions} 
                    onChange={(selectedTags) => handleChange('tags', selectedTags)} 
                    defaultSelected={product.tags || []} 
                />
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

            <div>
            {/* Add thumbnail section */}
                <Label>Thumbnail</Label>
                <DropzoneComponent 
                    onFileSelected={handleThumbnailChange}
                    acceptedTypes={['image/jpeg', 'image/png', 'image/webp']}
                    maxSize={2 * 1024 * 1024} // 2MB
                />
                {thumbnailPreview && (
                    <div className="mt-2 border border-gray-300 rounded-lg p-2 w-48">
                        <img 
                            src={thumbnailPreview} 
                            alt="Thumbnail preview" 
                            className="w-full h-auto rounded" 
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            {thumbnailFile ? "New thumbnail" : "Current thumbnail"}
                        </p>
                    </div>
                )}
            </div>

            <div className="flex gap-2 justify-center">
                <Button 
                    variant="primary" 
                    onClick={handleSave}
                    disabled={isUploading}
                >
                    {isUploading ? 'Saving...' : 'Save Changes'}
                </Button>
                <Button variant="destruction" onClick={handleDelete}>Delete</Button>
            </div>

            {message && <Alert variant="info" title="Note" message={message} />}
        </div>
    );
}