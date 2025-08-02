//frontend/src/pages/admin/adminForm/AddPremiumAccounts.tsx
import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import ComponentCard from "../adminComponents/ComponentCard.tsx";
import Label from "./FormElements/Label.tsx";
import Input from "./input/InputField.tsx";
import Select from "./FormElements/Select.tsx";
import Radio from "./input/Radio.tsx";
import Checkbox from "./input/Checkbox.tsx";
import MultiSelect from "./input/MultiSelect.tsx";
import TextArea from "./input/TextArea.tsx";
import Button from "../adminUI/Button.tsx";
import Alert from "../adminUI/Alert.tsx";
import DropzoneComponent from "./FormElements/DropZone.tsx";

export default function AddPremiumAccount() {

    const [productName, setProductName] = useState('');
    const [slug, setSlug] = useState('');
    const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState<string>('');
    const [isAvailable, setIsAvailable] = useState(false);
    const [status, setStatus] = useState<string>("active");
    const [tags, setTags] = useState<string[]>([]);
    const [platform, setPlatform] = useState('');
    const [duration, setDuration] = useState('');
    const [licenseType, setLicenseType] = useState<string>('key');

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");

    // Create reusable axios instance
    const api = useMemo(() => axios.create({ baseURL: 'http://localhost:5000/api' }), []);

    const tagOptions = [
        { value: "software", text: "Software" },
        { value: "subscription", text: "Subscription" },
        { value: "license", text: "License" },
        { value: "premium", text: "Premium" },
        { value: "account", text: "Account" },
        { value: "Special-Products", text: "Special Products" },
    ];

    const licenseOptions = [
        { value: "key", label: "Activation Key" },
        { value: "login", label: "Account Login" },
        { value: "serial", label: "Serial Number" },
    ];

    const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
    const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);

    useEffect(() => {
        if (productName && !slugManuallyEdited) {
            const generatedSlug = productName
                .toLowerCase()
                .replace(/[^a-z0-9\s-]/g, '')
                .replace(/\s+/g, '-')
                .replace(/-+/g, '-')
                .trim();
            setSlug(generatedSlug);
        }
    }, [productName]);

    useEffect(() => {
        return () => {
            if (thumbnailPreview) {
                URL.revokeObjectURL(thumbnailPreview);
            }
        };
    }, [thumbnailPreview]);

    const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSlug(e.target.value);
        setSlugManuallyEdited(true);
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        setSuccess(false);
        setError("");

         try {
            if (!productName.trim() || !slug.trim() || !price.trim() || 
                !platform.trim() || !duration.trim()) {
                throw new Error('Please fill all required fields');
            }

            const formData = new FormData();
            // Append all form fields
            formData.append('name', productName);
            formData.append('slug', slug);
            formData.append('description', description);
            formData.append('price', price);
            formData.append('isAvailable', isAvailable.toString());
            formData.append('status', status);
            formData.append('tags', tags.join(','));
            formData.append('platform', platform);
            formData.append('duration', duration);
            formData.append('licenseType', licenseType);
            
            // Append thumbnail file if exists
            if (thumbnailFile) {
                formData.append('thumbnail', thumbnailFile);
            }

            const response = await api.post('/premium', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.status >= 200 && response.status < 300) {
                setSuccess(true);
                resetForm();
            } else {
                throw new Error(response.data.message || 'Failed to create premium account');
            }
        } catch (err) {
            let errorMessage = 'An error occurred while adding the premium account';
            if (axios.isAxiosError(err)) {
                errorMessage = err.response?.data?.error ||
                    err.response?.data?.message ||
                    `Server error: ${err.response?.status}` ||
                    err.message;
            } else if (err instanceof Error) {
                errorMessage = err.message;
            }
            setError(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    const resetForm = () => {
        setProductName('');
        setSlug('');
        setSlugManuallyEdited(false);
        setDescription('');
        setPrice('');
        setStatus('active');
        setIsAvailable(false);
        setTags([]);
        setPlatform('');
        setDuration('');
        setLicenseType('key');
        setThumbnailFile(null);
        setThumbnailPreview(null);
    };


    return (
        <>
            <ComponentCard title="Section A: Basic Product Info">
                <div className="space-y-6">
                    <div>
                        <Label htmlFor="productName">Product Name*</Label>
                        <Input value={productName} type="text" id="productName" placeholder="e.g., Grammarly Premium" onChange={(e) => setProductName(e.target.value)} />
                    </div>
                    <div>
                        <Label htmlFor="slug">Slug*</Label>
                        <Input value={slug} type="text" id="slug" placeholder="Auto-generated but editable" onChange={handleSlugChange} />
                    </div>
                    <div>
                        <Label>Description</Label>
                        <TextArea value={description} onChange={setDescription} placeholder="Describe the premium account features" rows={4} />
                    </div>
                    <div>
                        <Label htmlFor="price">Price*</Label>
                        <Input type="number" id="price" placeholder="0.00" min="0.01" step={0.01} value={price} onChange={(e) => setPrice(e.target.value)} />
                    </div>
                    <div>
                        <Label>Status*</Label>
                        <div className="flex flex-wrap items-center gap-8">
                            <Radio
                                id="status-active"
                                name="status"
                                value="active"
                                checked={status === "active"}
                                onChange={() => setStatus("active")}
                                label="Active"
                            />
                            <Radio
                                id="status-inactive"
                                name="status"
                                value="inactive"
                                checked={status === "inactive"}
                                onChange={() => setStatus("inactive")}
                                label="Inactive"
                            />
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <Label htmlFor="availability">Availability:</Label>
                        <div className="flex items-center gap-3">
                            <Checkbox checked={isAvailable} onChange={setIsAvailable} />
                            <span className="block text-sm font-medium text-gray-700 dark:text-gray-400">Available for purchase</span>
                        </div>
                    </div>
                    <div>
                        <MultiSelect label="Tags" options={tagOptions} onChange={setTags} defaultSelected={tags} />
                    </div>

                    <div>
                        <Label>Add Thumbnail</Label>
                        <DropzoneComponent
                            onFileSelected={(file) => {
                                setThumbnailFile(file);
                                if (file) {
                                    const previewUrl = URL.createObjectURL(file);
                                    setThumbnailPreview(previewUrl);
                                } else {
                                    setThumbnailPreview(null);
                                }
                            }}
                            acceptedTypes={['image/jpeg', 'image/png', 'image/webp']}
                            maxSize={2 * 1024 * 1024}
                        />
                        {thumbnailPreview && (
                            <div className="mt-2 border border-gray-300 rounded-lg p-2 w-48">
                                <img src={thumbnailPreview} alt="Thumbnail preview" className="w-full h-auto rounded" />
                            </div>
                        )}
                    </div>

                </div>
            </ComponentCard>

            <ComponentCard title="Section B: Premium Account Details">
                <div className="space-y-6">
                    <div>
                        <Label htmlFor="platform">Platform*</Label>
                        <Input value={platform} type="text" id="platform" placeholder="e.g., Grammarly, Adobe, Microsoft" onChange={(e) => setPlatform(e.target.value)} />
                    </div>
                    <div>
                        <Label htmlFor="duration">Duration*</Label>
                        <Input value={duration} type="text" id="duration" placeholder="e.g., 1 Year, 6 Months, Lifetime" onChange={(e) => setDuration(e.target.value)} />
                    </div>
                    <div>
                        <Label>License Type*</Label>
                        <Select options={licenseOptions} defaultValue={licenseType} onChange={(value) => setLicenseType(value)} />
                    </div>
                </div>
            </ComponentCard>

            <ComponentCard title="Section C: Delivery">
                <div className="space-y-6">
                    <div>
                        <Label htmlFor="deliveryFormat">Delivery Format</Label>
                        <Input value="Email" type="text" id="deliveryFormat" disabled />
                    </div>
                </div>
            </ComponentCard>

            <div className="rounded-2xl border border-gray-200 bg-white px-4 py-4 dark:border-gray-800 dark:bg-white/[0.03]">
                <div className="flex items-center justify-center gap-5">
                    <Button size="md" variant="primary" onClick={handleSubmit} disabled={isSubmitting}>
                        {isSubmitting ? 'Creating premium account...' : 'Add Premium Account'}
                    </Button>

                    
                    {success && <Alert variant="success" title="Success" message="Premium account added successfully!" />}
                    {error && <Alert variant="error" title="Error" message={error} />}
                </div>
            </div>

        </>
    );
}