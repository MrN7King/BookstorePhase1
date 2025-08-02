//frontend/src/pages/admin/adminForm/EditEbook.tsx

import { useState, useEffect } from 'react';
import axios from 'axios';
import ComponentCard from '../adminComponents/ComponentCard';
import Label from './FormElements/Label';
import Input from './input/InputField';
import Select from './FormElements/Select';
import DatePicker from './FormElements/date-picker';
import TextArea from './input/TextArea';
import Radio from './input/Radio';
import Checkbox from './input/Checkbox';
import MultiSelect from './input/MultiSelect';
import DropzoneComponent from './FormElements/DropZone';
import FileSizeInput from './input/FileSizeInput';
import Button from '../adminUI/Button';
import Alert from '../adminUI/Alert';

interface EditEbookFormProps {
    productId: string;
    onSaved: (updated: any) => void;
    onDeleted: () => void;
}

export default function EditEbookForm({ productId, onSaved, onDeleted }: EditEbookFormProps) {
    // Loading / status
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);

    // Section A: Basic
    const [name, setName] = useState('');
    const [slug, setSlug] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState<number>(0);
    const [isAvailable, setAvailable] = useState(false);
    const [status, setStatus] = useState<'active' | 'inactive'>('active');
    const [tags, setTags] = useState<string[]>([]);
    const genreOptions = [
        { value: 'Fantasy', text: 'Fantasy' },
        { value: 'Sci-Fi', text: 'Sci-Fi' },
        { value: 'Mystery', text: 'Mystery' },
        { value: 'Thriller', text: 'Thriller' },
        { value: 'Biography', text: 'Biography' },
    ];
    const [language, setLanguage] = useState('');
    const langOptions = [
        { value: 'English', label: 'English' },
        { value: 'Sinhala', label: 'Sinhala' },
        { value: 'Tamil', label: 'Tamil' },
    ];

    // File uploads
    const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
    const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
    const [ebookFile, setEbookFile] = useState<File | null>(null);
    const [currentUpload, setCurrentUpload] = useState<'thumbnail' | 'ebook' | null>(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isUploading, setUploading] = useState(false);

    // Section B: Details
    const [author, setAuthor] = useState('');
    const [ISBN, setISBN] = useState('');
    const [publicationDate, setPubDate] = useState<string>('');

    // Update date handler
    const handleDateChange = (dates: Date[]) => {
        if (dates && dates.length > 0) {
            setPubDate(dates[0].toISOString());
        } else {
            setPubDate('');
        }
    };

    const [publisher, setPublisher] = useState('');
    const [edition, setEdition] = useState('');

    // Section C: Metadata
    const [pageCount, setPageCount] = useState<number>(0);

    const [existingEbookName, setExistingEbookName] = useState<string | null>(null);
    const [fileSize, setFileSize] = useState<number>(0); // in KB
    const [fileFormat, setFileFormat] = useState<string>('');

    // Initialize: fetch existing ebook
    useEffect(() => {

        setError(null); // Reset error when product changes
        setLoading(true);

        axios.get(`http://localhost:5000/api/productEbook/${productId}`)
            .then(res => {
                const e = res.data.ebook || res.data;
                // Basic
                setName(e.name);
                setSlug(e.slug);
                setDescription(e.description);
                setPrice(e.price);
                setAvailable(e.isAvailable);
                setStatus(e.status);
                setTags(e.tags || []);
                setLanguage(e.language || '');
                // Files
                setThumbnailPreview(e.thumbnailUrl || null);
                // keep fileInfo in payload if no re-upload
                // Details
                setAuthor(e.author);
                setISBN(e.ISBN || '');
                setPubDate(e.publicationDate ? new Date(e.publicationDate).toISOString() : '');
                setPublisher(e.publisher || '');
                setEdition(e.edition || '');
                // Metadata
                if (e.metadata) {
                    setPageCount(e.metadata.pageCount || 0);
                    setFileSize(e.metadata.fileSize || 0);  // NEW
                    setFileFormat(e.metadata.fileFormat || ''); // NEW
                }

                setLoading(false);
            })
            .catch(() => {
                setError('Failed to load e-book');
                setLoading(false);
            });
    }, [productId]);

    // Clear message timer
    useEffect(() => {
        if (!message) return;
        const t = setTimeout(() => setMessage(null), 4000);
        return () => clearTimeout(t);
    }, [message]);

    useEffect(() => {
        // Create new preview when thumbnailFile changes
        if (thumbnailFile) {
            const previewUrl = URL.createObjectURL(thumbnailFile);
            setThumbnailPreview(previewUrl);

            // Cleanup function
            return () => {
                URL.revokeObjectURL(previewUrl);
            };
        } else {
            setThumbnailPreview(null);
        }
    }, [thumbnailFile]);

    // Handlers
    const handleSave = async () => {
        setError(null);
        setMessage(null);
        setUploading(true);

        try {
            const fd = new FormData();
            // Basic fields
            fd.append('name', name);
            fd.append('slug', slug);
            fd.append('description', description);
            fd.append('price', price.toString());
            fd.append('isAvailable', String(isAvailable));
            fd.append('status', status);
            tags.forEach(tag => fd.append('tags', tag));
            fd.append('language', language);
            // Details
            fd.append('author', author);
            fd.append('ISBN', ISBN);
            if (publicationDate) fd.append('publicationDate', publicationDate);
            fd.append('publisher', publisher);
            fd.append('edition', edition);
            // Metadata
            fd.append('metadata[pageCount]', pageCount.toString());
            fd.append('metadata[fileSize]', fileSize.toString());
            fd.append('metadata[fileFormat]', fileFormat);
            // Files
            if (thumbnailFile) {
                fd.append('thumbnail', thumbnailFile);
            }
            if (ebookFile) {
                fd.append('ebook', ebookFile);
            }

            const { data } = await axios.put(
                `http://localhost:5000/api/productEbook/${productId}`,
                fd,
                {
                    headers: { 'Content-Type': 'multipart/form-data' },
                    onUploadProgress: e => {
                        if (e.total) setUploadProgress(Math.round(e.loaded / e.total * 100));
                    }
                }
            );
            setMessage('Saved successfully');
            onSaved(data);
        } catch (err: any) {

            let errorMessage = 'Update failed';

            if (err.response) {

                // Handle different error types
                if (err.response.status === 413) {
                    errorMessage = 'File too large. Thumbnail max 2MB, Ebook max 50MB';
                } else if (err.response.data?.error) {
                    errorMessage = err.response.data.error;
                }
            } else if (err.message) {
                errorMessage = err.message;
            }

            setError(errorMessage);

            console.error(err);

        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async () => {
        try {
            await axios.delete(`http://localhost:5000/api/productEbook/${productId}`);
            onDeleted();
        } catch (err: any) {
            console.error(err);
            setError(err.response?.data?.error || 'Delete failed');
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <Alert variant="error" title="Error" message={error} />;

    return (
        <div className="space-y-6">
            {/* Section A */}
            <ComponentCard title="Section A: Basic Info">
                <div className="space-y-4">
                    <div>
                        <Label>Title</Label>
                        <Input value={name} onChange={e => setName(e.target.value)} />
                    </div>
                    <div>
                        <Label>Slug</Label>
                        <Input value={slug} onChange={e => setSlug(e.target.value)} />
                    </div>
                    <div>
                        <Label>Description</Label>
                        <TextArea value={description} onChange={v => setDescription(v)} rows={4} />
                    </div>
                    <div>
                        <Label>Price</Label>
                        <Input type="number" value={price} onChange={e => setPrice(parseFloat(e.target.value))} />
                    </div>
                    <div className="flex items-center gap-4">
                        <Checkbox checked={isAvailable} onChange={setAvailable} label="Available" />
                    </div>
                    <div>
                        <Label>Status</Label>
                        <div className="flex gap-6">
                            <Radio id="status-active" name="status" value="active" checked={status === 'active'} onChange={() => setStatus('active')} label="Active" />
                            <Radio id="status-inactive" name="status" value="inactive" checked={status === 'inactive'} onChange={() => setStatus('inactive')} label="Inactive" />
                        </div>
                    </div>
                    <div>
                        <MultiSelect
                            label="Genres"
                            options={genreOptions}
                            defaultSelected={tags}
                            onChange={setTags}
                        />
                    </div>
                    <div>
                        <Label>Language</Label>
                        <Select options={langOptions} defaultValue={language} onChange={setLanguage} />
                    </div>
                    <div>
                        <Label>Thumbnail</Label>
                        <DropzoneComponent onFileSelected={(file) => {
                            setThumbnailFile(file);
                            if (file) {
                                // Generate preview URL
                                const previewUrl = URL.createObjectURL(file);
                                setThumbnailPreview(previewUrl);
                            } else {
                                setThumbnailPreview(null);
                            }
                        }} acceptedTypes={['image/jpeg', 'image/png', 'image/webp']} maxSize={2 * 1024 * 1024} />
                        {thumbnailPreview && (
                            <div className="mt-2 border border-gray-300 rounded-lg p-2 w-48">
                                <img src={thumbnailPreview} className="w-full h-auto rounded" />
                            </div>
                        )}
                    </div>
                </div>
            </ComponentCard>

            {/* Section B */}
            <ComponentCard title="Section B: Details">
                <div className="space-y-4">
                    <div>
                        <Label>Author</Label>
                        <Input value={author} onChange={e => setAuthor(e.target.value)} />
                    </div>
                    <div>
                        <Label>ISBN</Label>
                        <Input value={ISBN} onChange={e => setISBN(e.target.value)} />
                    </div>
                    <div>
                        <DatePicker
                            id="publication-date-picker"
                            label="Publication Date"
                            onChange={handleDateChange}
                            defaultDate={publicationDate ? new Date(publicationDate) : undefined}
                        />
                    </div>
                    <div>
                        <Label>Publisher</Label>
                        <Input value={publisher} onChange={e => setPublisher(e.target.value)} />
                    </div>
                    <div>
                        <Label>Edition</Label>
                        <Input value={edition} onChange={e => setEdition(e.target.value)} />
                    </div>
                </div>
            </ComponentCard>

            {/* Section C */}
            <ComponentCard title="Section C: Metadata">
                <div className="space-y-4">
                    <div>
                        <Label>Page Count</Label>
                        <Input type="number" value={pageCount} onChange={e => setPageCount(parseInt(e.target.value, 10))} />
                    </div>
                    <div>
                        <Label>File Format</Label>
                        <Input type="text" value={fileFormat} onChange={e => setFileFormat(e.target.value)} />
                    </div>
                    <div>
                        <Label>File Size</Label>
                        <Input type="text" value={`${(fileSize / 1024).toFixed(2)} MB`} disabled />
                    </div>
                    <div>
                        <Label>E-book File</Label>
                        <DropzoneComponent onFileSelected={(file) => {
                            setEbookFile(file);

                            if (file) {
                                // Set file size in KB
                                setFileSize(Math.round(file.size / 1024));

                                // Set file format (extract from MIME type or extension)
                                const extension = file.name.split('.').pop()?.toLowerCase() || '';
                                setFileFormat(extension);
                            }
                        }} acceptedTypes={['application/pdf', 'application/epub+zip']} maxSize={50 * 1024 * 1024} />

                        {ebookFile && (
                            <div className="mt-2">
                                <p className="text-sm">Ebook File:</p>
                                <p className="text-xs truncate">{ebookFile.name}</p>
                                <p className="text-xs text-gray-500">
                                    {(ebookFile.size / 1024 / 1024).toFixed(2)} MB
                                </p>
                            </div>
                        )}


                    </div>
                </div>
            </ComponentCard>

            {/* Actions */}
            <div className="flex justify-center gap-4">
                <Button variant="primary" onClick={handleSave} disabled={isUploading}>
                    {isUploading
                        ? `Uploading ${currentUpload} ${uploadProgress}%`
                        : 'Save Changes'
                    }
                </Button>
                <Button variant="destruction" onClick={handleDelete}>Delete</Button>
            </div>

            {(message || error) && (
                <Alert
                    variant={error ? 'error' : 'info'}
                    title={error ? 'Error' : 'Note'}
                    message={error || message!}
                />
            )}
        </div>
    );
}