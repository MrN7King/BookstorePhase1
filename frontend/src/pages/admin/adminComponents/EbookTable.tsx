//frontend/src/pages/admin/adminComponents/EbookTable.tsx
import {
    useEffect,
    useState,
    forwardRef,
    useImperativeHandle,
    useRef,
} from 'react';
import axios from 'axios';
import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableCell,
} from '../adminUI/Table';
import Badge from '../adminUI/Badge';

export interface EbookProduct {
    _id: string;
    name: string;
    slug: string;
    price: number;
    isAvailable: boolean;
    status: 'active' | 'inactive';
    tags: string[];
    language?: string;
    author: string;
    publicationDate?: string;
}

export interface EbooksTableProps {
    onSelect: (product: EbookProduct) => void;
}

export interface EbooksTableRef {
    refresh: () => void;
}

const EbooksTable = forwardRef<EbooksTableRef, EbooksTableProps>(
    ({ onSelect }, ref) => {
        const [ebooks, setEbooks] = useState<EbookProduct[]>([]);
        const [loading, setLoading] = useState(false);
        const [error, setError] = useState<string | null>(null);
        const [page, setPage] = useState(1);
        const [hasMore, setHasMore] = useState(true);

        const scrollContainerRef = useRef<HTMLDivElement>(null);

        const fetchEbooks = async (pageNum = 1) => {
            setLoading(true);
            try {
                const api = axios.create({ baseURL: 'http://localhost:5000/api' });
                const { data } = await api.get(`/productEbook?page=${pageNum}&limit=20`);
                if (pageNum === 1) {
                    setEbooks(data.products);
                } else {
                    setEbooks((prev) => [...prev, ...data.products]);
                }
                setHasMore(pageNum < data.totalPages);
                setError(null);
            } catch (err) {
                setError('Failed to load eBooks');
            } finally {
                setLoading(false);
            }
        };

        useImperativeHandle(ref, () => ({
            refresh: () => {
                setPage(1);
                fetchEbooks(1);
            },
        }));

        useEffect(() => {
            fetchEbooks(page);
        }, [page]);

        useEffect(() => {
            const container = scrollContainerRef.current;
            if (!container) return;

            const handleScroll = () => {
                if (loading || !hasMore) return;
                const { scrollTop, scrollHeight, clientHeight } = container;
                if (scrollTop + clientHeight >= scrollHeight - 50) {
                    setPage((prev) => prev + 1);
                }
            };

            container.addEventListener('scroll', handleScroll);
            return () => container.removeEventListener('scroll', handleScroll);
        }, [loading, hasMore]);

        if (error) return <p className="p-4 text-red-600">{error}</p>;

        return (
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
                <div className="max-w-full overflow-x-auto">
                    <div
                        ref={scrollContainerRef}
                        className="max-h-[300px] overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-track]:bg-neutral-700 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500"
                    >
                        <Table>
                            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                                <TableRow>
                                    {['ID', 'Name', 'Author', 'Language', 'Price', 'Status'].map((hdr) => (
                                        <TableCell
                                            key={hdr}
                                            isHeader
                                            className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                        >
                                            {hdr}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHeader>
                            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                                {ebooks.map((ebook) => (
                                    <TableRow
                                        key={ebook._id}
                                        className="cursor-pointer hover:bg-gray-50"
                                        onClick={() => onSelect(ebook)}
                                    >
                                        <TableCell className="px-5 py-4 sm:px-6 text-start">
                                            {ebook._id.slice(-6)}
                                        </TableCell>
                                        <TableCell className="px-5 py-4 sm:px-6 text-start">{ebook.name}</TableCell>
                                        <TableCell className="px-5 py-4 sm:px-6 text-start">{ebook.author}</TableCell>
                                        <TableCell className="px-5 py-4 sm:px-6 text-start">{ebook.language || '-'}</TableCell>
                                        <TableCell className="px-5 py-4 sm:px-6 text-start">
                                            ${ebook.price.toFixed(2)}
                                        </TableCell>
                                        <TableCell className="px-5 py-4 sm:px-6 text-start">
                                            <Badge
                                                size="sm"
                                                color={ebook.status === 'active' ? 'success' : 'error'}
                                            >
                                                {ebook.status.charAt(0).toUpperCase() + ebook.status.slice(1)}
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                ))}

                                {loading && (
                                    <TableRow>
                                        <TableCell colSpan={6} className="p-4 text-center">
                                            Loading...
                                        </TableCell>
                                    </TableRow>
                                )}

                                {!hasMore && !loading && (
                                    <TableRow>
                                        <TableCell colSpan={6} className="p-4 text-center text-gray-500">
                                            All Ebooks Loaded
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </div>
        );
    }
);

export default EbooksTable;