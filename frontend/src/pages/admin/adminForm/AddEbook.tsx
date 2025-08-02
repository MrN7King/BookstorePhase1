//file: frontend/src/pages/admin/adminForm/AddEbook.tsx
import { useState, useEffect } from "react";
import axios from "axios";
import ComponentCard from "../adminComponents/ComponentCard.tsx";
import Label from "./FormElements/Label.tsx";
import Input from "./input/InputField.tsx";
import Select from "./FormElements/Select.tsx";
import DatePicker from "./FormElements/date-picker.tsx";
import TextArea from "./input/TextArea.tsx";
import Radio from "./input/Radio.tsx";
import Checkbox from "./input/Checkbox.tsx";
import MultiSelect from "./input/MultiSelect.tsx";
import DropzoneComponent from "./FormElements/DropZone.tsx";
import FileSizeInput from "./input/FileSizeInput.tsx"; // Import the new FileSizeInput component
import Button from "../adminUI/Button.tsx";
import Alert from "../adminUI/Alert.tsx";



export default function AddEbook() {

  //thumbnail and ebook file upload
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [ebookFile, setEbookFile] = useState<File | null>(null);
  const [currentUpload, setCurrentUpload] = useState<'thumbnail' | 'ebook' | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [cancelToken] = useState(axios.CancelToken.source());


  const handleThumbnailSelected = (file: File) => {
    setThumbnailFile(file);
    setThumbnailPreview(URL.createObjectURL(file));
  };

  //section A
  const [genreOptions, setGenreOptions] = useState([
    { value: "1", text: "Fantasy" },
    { value: "2", text: "Sci-Fi" },
    { value: "3", text: "Mystery" },
    { value: "4", text: "Thriller" },
    { value: "5", text: "Biography" },
  ]);

  const langOptions = [
    { value: "English", label: "English" },
    { value: "Sinhala", label: "Sinhala" },
    { value: "Tamil", label: "Tamil" },
  ];

  const [genreValues, setGenreValues] = useState<string[]>(["1", "3"]);
  const [isAvailable, setIsAvailable] = useState(false);
  const [StatusValue, setStatusValue] = useState<string>("active");


  const handleRadioChange = (value: string) => {
    setStatusValue(value);
  };
  const [ebookName, setEbookName] = useState('');

  // state to track manual edits
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);

  useEffect(() => {
    if (ebookName && !slugManuallyEdited) {
      const generatedSlug = ebookName
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '') // Remove special chars
        .replace(/\s+/g, '-')          // Replace spaces with dashes
        .replace(/-+/g, '-')           // Remove duplicate dashes
        .trim();
      setSlug(generatedSlug);
    }
  }, [ebookName]);

  const [slug, setSlug] = useState('');
  const [ebookPrice, setEbookPrice] = useState<string>('');
  const [description, setDescription] = useState("");
  const [languageValue, setLanguageValue] = useState('');




  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSlug(e.target.value);
    setSlugManuallyEdited(true); // Flag manual edit
  };

  const handleLanguageChange = (value: string) => {
    setLanguageValue(value);
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEbookPrice(e.target.value);
  };


  //section B
  const [authorName, setAuthorName] = useState('');
  const [ebookISBN, setebookISBN] = useState('');
  const [publicationrName, setPublicationName] = useState('');
  const [ebookEdition, setEbookEdition] = useState('');
  const [ebookPageCount, setEbookPageCount] = useState<string>('');
  const [pubDate, setPubDate] = useState<string>('');

  // Update date handler
  const handleDateChange = (dates: Date[]) => {
    if (dates && dates.length > 0) {
      setPubDate(dates[0].toISOString());
    } else {
      setPubDate('');
    }
  };


  const handleEbookPageCount = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEbookPageCount(e.target.value);
  };

  //section C
  const FileFormatOptions = [
    { value: "PDF", label: "PDF" },
    { value: "EPUB", label: "EPUB" },
    { value: "MOBI", label: "MOBI" },
  ];

  //Handle submit
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  // useEffect hook
  useEffect(() => {
    const tokenSource = axios.CancelToken.source();

    return () => {
      if (isUploading || isSubmitting) {
        tokenSource.cancel('Operation canceled by the user');
      }
    };
  }, [isUploading, isSubmitting]);


  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSuccess(false);
    setError("");

    const tokenSource = axios.CancelToken.source();

    try {
      // Validate required files and fields
      if (!thumbnailFile) throw new Error('Thumbnail is required');
      if (!ebookFile) throw new Error('Ebook file is required');
      if (!ebookName.trim() || !slug.trim() || !ebookPrice.trim() || !authorName.trim()) {
        throw new Error('Please fill all required fields');
      }


      setIsUploading(true);
      setCurrentUpload('thumbnail');
      setUploadProgress(0); // Reset progress


      // Create Axios instance with common headers
      const api = axios.create({
        baseURL: 'http://localhost:5000/api'
      });

      // 1. Upload thumbnail to Cloudinary
      const thumbnailFormData = new FormData();
      thumbnailFormData.append('thumbnail', thumbnailFile);

      const thumbnailResponse = await api.post('/upload', thumbnailFormData, {
        cancelToken: tokenSource.token,
        onUploadProgress: (progressEvent) => {
          let percentCompleted = 0;
          if (progressEvent.total !== undefined && progressEvent.total > 0) {
            percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
          }
          setUploadProgress(percentCompleted);
        }
      });

      const thumbnailUrl = thumbnailResponse.data.url;
      const thumbnailPublicId = thumbnailResponse.data.public_id;

      setCurrentUpload('ebook');
      setUploadProgress(0);

      // 2. Upload ebook file to Backblaze B2
      const ebookFormData = new FormData();
      ebookFormData.append('ebook', ebookFile);

      const ebookUploadResponse = await api.post('/ebook-upload', ebookFormData, {
        cancelToken: tokenSource.token,
        onUploadProgress: (progressEvent) => {
          let percentCompleted = 0;
          if (progressEvent.total !== undefined && progressEvent.total > 0) {
            percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
          }
          setUploadProgress(percentCompleted);
        }
      }
      );

      const fileInfo = ebookUploadResponse.data.fileInfo;


      setCurrentUpload(null);

      // Prepare ebook data
      const fileSizeKB = Math.round(ebookFile.size / 1024);
      const fileFormat = ebookFile.name.split('.').pop()?.toUpperCase() || '';

      const tagLookup = {
        "1": "Fantasy",
        "2": "Sci-Fi",
        "3": "Mystery",
        "4": "Thriller",
        "5": "Biography"
      };

      const ebookData = {
        name: ebookName,
        slug,
        description,
        price: parseFloat(ebookPrice),
        isAvailable,
        status: StatusValue.toLowerCase(), // "active" or "inactive"
        tags: genreValues.map(val => tagLookup[val] || val),
        language: languageValue,
        thumbnailUrl,
        thumbnailPublicId,
        deliveryFormat: "email",
        fileInfo, // From Backblaze upload
        author: authorName,
        ISBN: ebookISBN,
        publicationDate: pubDate,
        publisher: publicationrName,
        edition: ebookEdition,
        metadata: {
          pageCount: parseInt(ebookPageCount) || 0,
          fileSize: fileSizeKB,
          fileFormat
        }
      };

      // 3. Create ebook record MongoDB
      const response = await api.post('/productEbook', ebookData, {
        cancelToken: tokenSource.token
      });

      if (response.status >= 200 && response.status < 300) {
        setSuccess(true);
        resetForm();
      } else {
        throw new Error(response.data.message || 'Failed to create ebook');
      }
    } catch (err) {

      if (axios.isCancel(err)) {
        console.log('Request canceled:', err.message);
        return;
      }

      let errorMessage = 'An error occurred while adding the ebook';

      if (axios.isAxiosError(err)) {
        // Handle Axios-specific errors
        if (err.response) {
          // Server responded with a status other than 2xx
          errorMessage = err.response.data.error ||
            err.response.data.message ||
            `Server error: ${err.response.status}`;
        } else if (err.request) {
          // Request was made but no response received
          errorMessage = 'No response from server. Please check your connection.';
        } else {
          // Something happened in setting up the request
          errorMessage = `Request error: ${err.message}`;
        }
      } else if (err instanceof Error) {
        // Generic JavaScript error
        errorMessage = err.message;
      }

      setError(errorMessage);
      setIsUploading(false);
      setCurrentUpload(null);
    } finally {
      setIsSubmitting(false);
      setIsUploading(false);
    }
  };

  // Reset form after successful submission
  const resetForm = () => {
    setIsUploading(false);
    setCurrentUpload(null);
    setUploadProgress(0);
    setEbookName('');
    setSlug('');
    setSlugManuallyEdited(false);
    setDescription('');
    setEbookPrice('');
    setStatusValue('active'); // Changed to 'active'
    setIsAvailable(false);
    setGenreValues([]);
    setLanguageValue('');
    setAuthorName('');
    setebookISBN('');
    setPublicationName('');
    setEbookEdition('');
    setEbookPageCount('');
    setThumbnailFile(null);
    setEbookFile(null);
    setPubDate('');

    if (thumbnailPreview) {
      URL.revokeObjectURL(thumbnailPreview);
      setThumbnailPreview(null);
    }
  };


  return (
    <>
      <ComponentCard title="Section A: Basic Product Info">
        <div className="space-y-6">
          <div>
            <Label htmlFor="ebookName">Input E-book Name</Label>
            <Input value={ebookName} type="text" id="ebookName" placeholder="Harry potter" onChange={(e) => setEbookName(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="slug">Edit Slug</Label>
            <Input value={slug} type="text" id="slug" placeholder="slug will be auto generated but still editable" onChange={handleSlugChange} />
          </div>
          <div>
            <Label>Description</Label>
            <TextArea
              value={description}
              onChange={(value) => setDescription(value)}
              placeholder="Enter book description"
              rows={6}
            />
          </div>
          <div>
            <Label htmlFor="ebookPrice">Input E-book Price</Label>
            <Input
              type="number" // Set type to number
              id="ebookPrice"
              placeholder="Enter only numbers"
              min="0.01" // Set minimum value as a string
              step={0.01} // Set step value
              value={ebookPrice}
              onChange={handlePriceChange}
            />
          </div>

          <div>
            <Label htmlFor="ebookName">Status</Label>

            <div className="flex flex-wrap items-center gap-8">
              <Radio
                id="radio1"
                name="group1"
                value="active"
                checked={StatusValue === "active"}
                onChange={() => handleRadioChange("active")}
                label="Active"
              />
              <Radio
                id="radio2"
                name="group1"
                value="inactive"
                checked={StatusValue === "inactive"}
                onChange={() => handleRadioChange("inactive")}
                label="InActive"
              />

            </div>
          </div>

          <div className="flex items-center gap-4">
            <Label htmlFor="ebookPrice">Edit Availability :</Label>
            <div className="flex items-center gap-3">
              <Checkbox checked={isAvailable} onChange={setIsAvailable} />
              <span className="block text-sm font-medium text-gray-700 dark:text-gray-400">
                IsAvailable
              </span>
            </div>
          </div>

          <div>
            <MultiSelect
              label="Select Genre"
              options={genreOptions}
              defaultSelected={["1", "3"]}
              onChange={(selectedValues) => {
                setGenreValues(selectedValues);
              }}
            />

            <p className="sr-only">
              Selected Values: {genreValues.join(", ")}
            </p>
          </div>

          <div>
            <Label>Select Language</Label>
            <Select
              options={langOptions}
              placeholder="Select a Language"
              onChange={handleLanguageChange}
              className="dark:bg-dark-900"
            />
          </div>

          <div>
            <Label>Upload Book Thumbnail</Label>
            <DropzoneComponent
              onFileSelected={handleThumbnailSelected}
              acceptedTypes={['image/jpeg', 'image/png', 'image/webp']}
              maxSize={2 * 1024 * 1024} // 2MB
              label="Drag & Drop your PNG, JPG, WebP Book Thumbnail Here" />


            {thumbnailPreview && (
              <div className="mt-2 border border-gray-300 rounded-lg p-2 w-48">
                <img src={thumbnailPreview} alt="Thumbnail preview" className="w-full h-auto rounded" />
              </div>
            )}
          </div>

        </div>
      </ComponentCard>

      <ComponentCard title="Section B: E‑book Details">
        <div className="space-y-6">
          <div>
            <Label htmlFor="ebookAuthorName">Input Author Name</Label>
            <Input value={authorName} type="text" id="authorName" placeholder="J.K.Rowling" onChange={(e) => setAuthorName(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="ebookISBN">Input e-book ISBN</Label>
            <Input value={ebookISBN} type="text" id="ebookISBN" placeholder="ISBN" onChange={(e) => setebookISBN(e.target.value)} />
          </div>
          <div>
            <DatePicker
              id="date-picker"
              label="Select Publication Date"
              placeholder="Select a date"
              onChange={handleDateChange}
            />
          </div>
          <div>
            <Label htmlFor="ebookPublicationName">Input Publisher Name</Label>
            <Input value={publicationrName} type="text" id="publicationName" placeholder="Publisher Name" onChange={(e) => setPublicationName(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="ebookEdition">Input Ebook Edition</Label>
            <Input value={ebookEdition} type="text" id="ebookEdition" placeholder="Ebook Edition" onChange={(e) => setEbookEdition(e.target.value)} />
          </div>
        </div>
      </ComponentCard>

      <ComponentCard title="Section C: Metadata">
        <div className="space-y-6">
          <div>
            <Label htmlFor="ebookPageCount">Input Ebook Page Count</Label>
            <Input
              type="number" // Set type to number
              id="ebookPageCount"
              placeholder="Enter Ebook Page Count"
              min="1" // Set minimum value as a string
              step={1} // Set step value
              value={ebookPageCount}
              onChange={handleEbookPageCount}
            />
          </div>
        </div>
      </ComponentCard>

      <ComponentCard title="Section D: Delivery">
        <div className="space-y-6">
          <div>
            <Label htmlFor="deliveryFormat">Delivery Format</Label>
            <Input value={"Email"} type="text" id="deliveryFormat" placeholder="Email" disabled />
          </div>
          <div>
            <Label>Upload Ebook File</Label>
            <DropzoneComponent
              onFileSelected={setEbookFile}
              acceptedTypes={['application/pdf', 'application/epub+zip']}
              maxSize={50 * 1024 * 1024} // 50MB
              label="Drag & Drop your PDF, EPUB, MOBI Ebook File Here"
            />
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



      <div className=" rounded-2xl border border-gray-200 bg-white px-4 py-4 dark:border-gray-800 dark:bg-white/[0.03] ">

        {isUploading && (
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
              <div
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              {currentUpload === 'thumbnail'
                ? `Uploading thumbnail: ${uploadProgress}%`
                : `Uploading ebook: ${uploadProgress}%`}
            </p>
            {uploadProgress === 100 && (
              <p className="text-sm text-gray-500 mt-1">
                Finalizing upload, please wait...
              </p>
            )}
          </div>
        )}


        <div className="flex items-center justify-center gap-5">
          <Button
            size="md"
            variant="primary"
            onClick={handleSubmit}
            disabled={isSubmitting || isUploading}
          >
            {isUploading ? `Uploading ${currentUpload}... (${uploadProgress}%)`
              : isSubmitting ? 'Creating ebook...'
                : 'Add E-book'}

          </Button>

          {success && (
            <Alert variant="success" title="Success" message="E-book added successfully!" />
          )}

          {error && (
            <Alert variant="error" title="Error" message={error} />
          )}
        </div>
      </div>

    </>
  );
}