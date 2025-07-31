//frontend/src/pages/admin/adminComponents/PremiumCodesTable.tsx
import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableCell,
} from '../adminUI/Table';
import Badge from '../adminUI/Badge';
import Button from '../adminUI/Button';

export interface PremiumCode {
    _id: string;
    code: string;
    isAssigned: boolean;
}

interface PremiumCodesTableProps {
    productId: string | null;
}

export default function PremiumCodesTable({ productId }: PremiumCodesTableProps) {
    const [codes, setCodes] = useState<PremiumCode[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const fetchCodes = async (pageNum = 1) => {
        if (!productId) return;
        setLoading(true);
        try {
            const api = axios.create({ baseURL: 'http://localhost:5000/api' });
            const { data } = await api.get(`/premium/codes/product/${productId}?page=${pageNum}&limit=10`);
            if (pageNum === 1) {
                setCodes(data.codes);
            } else {
                setCodes(prev => [...prev, ...data.codes]);
            }
            setHasMore(pageNum < data.totalPages);
            setError(null);
        } catch (err) {
            setError('Failed to load codes');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (productId) {
            setCodes([]);
            setPage(1);
            fetchCodes(1);
        }
    }, [productId]);

    useEffect(() => {
        if (page !== 1) fetchCodes(page);
    }, [page]);

    // Scroll observer logic
    useEffect(() => {
        const container = scrollContainerRef.current;
        if (!container) return;

        const handleScroll = () => {
            if (loading || !hasMore) return;

            const { scrollTop, scrollHeight, clientHeight } = container;
            if (scrollTop + clientHeight >= scrollHeight - 50) {
                setPage(prev => prev + 1);
            }
        };

        container.addEventListener('scroll', handleScroll);
        return () => container.removeEventListener('scroll', handleScroll);
    }, [loading, hasMore]);

    const handleDelete = async (id: string) => {
        const confirmed = window.confirm('Are you sure you want to delete this code? This action cannot be undone.');
        if (!confirmed) return;

        try {
            const api = axios.create({ baseURL: 'http://localhost:5000/api' });
            await api.delete(`/premium/codes/${id}`);
            setCodes((prev) => prev.filter((c) => c._id !== id));
        } catch (err) {
            console.error('Delete failed', err);
            alert('Failed to delete the code. Please try again.');
        }
    };

    if (!productId) return null;
    if (error) return <p className="p-4 text-red-600">{error}</p>;

    return (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
            <div className="max-w-full overflow-x-auto">
                <div
                    className="max-h-[300px] overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-track]:bg-neutral-700 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500"
                    ref={scrollContainerRef}>
                    <Table>
                        <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                            <TableRow>
                                <TableCell isHeader className="px-5 py-3 font-medium text-start text-theme-xs text-gray-500">Code</TableCell>
                                <TableCell isHeader className="px-5 py-3 font-medium text-start text-theme-xs text-gray-500">Assigned</TableCell>
                                <TableCell isHeader className="px-5 py-3 font-medium text-start text-theme-xs text-gray-500">Actions</TableCell>
                            </TableRow>
                        </TableHeader>
                        <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                            {codes.map(code => (
                                <TableRow key={code._id}>
                                    <TableCell className="px-5 py-4 sm:px-6 text-start">{code.code}</TableCell>
                                    <TableCell className="px-5 py-4 sm:px-6 text-start">
                                        <Badge color={code.isAssigned ? 'warning' : 'success'}>
                                            {code.isAssigned ? 'Assigned' : 'Available'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="px-5 py-4 sm:px-6 text-start">
                                        <Button variant="lightDestruction" size="xs" onClick={() => handleDelete(code._id)}>
                                            Delete
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}

                            {loading && (
                                <TableRow>
                                    <TableCell colSpan={3} className="p-4 text-center">Loading...</TableCell>
                                </TableRow>
                            )}

                            {!hasMore && !loading && (
                                <TableRow>
                                    <TableCell colSpan={3} className="p-4 text-center text-gray-500">
                                        All codes loaded.
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