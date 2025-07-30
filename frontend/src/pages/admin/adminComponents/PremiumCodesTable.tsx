//frontend/src/pages/admin/adminComponents/PremiumCodesTable.tsx
import { useEffect, useState } from 'react';
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

  const fetchCodes = async () => {
    if (!productId) return;
    setLoading(true);
    try {
      const api = axios.create({ baseURL: 'http://localhost:5000/api' });
      const { data } = await api.get(`/premium/codes/product/${productId}`);
      setCodes(data);
      setError(null);
    } catch (err) {
      setError('Failed to load codes');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const api = axios.create({ baseURL: 'http://localhost:5000/api' });
      await api.delete(`/premium/codes/${id}`);
      setCodes((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      console.error('Delete failed', err);
    }
  };

  useEffect(() => {
    fetchCodes();
  }, [productId]);

  if (!productId) return null;
  if (loading) return <p className="p-4">Loading codes...</p>;
  if (error) return <p className="p-4 text-red-600">{error}</p>;

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <Table>
          <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
            <TableRow>
              <TableCell isHeader className="px-5 py-3 font-medium text-start text-theme-xs text-gray-500">Code</TableCell>
              <TableCell isHeader className="px-5 py-3 font-medium text-start text-theme-xs text-gray-500">Assigned</TableCell>
              <TableCell isHeader className="px-5 py-3 font-medium text-start text-theme-xs text-gray-500">Actions</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {codes.map((code) => (
              <TableRow key={code._id}>
                <TableCell className="px-5 py-4 sm:px-6 text-start">{code.code}</TableCell>
                <TableCell className="px-5 py-4 sm:px-6 text-start">
                  <Badge color={code.isAssigned ? 'warning' : 'success'}>
                    {code.isAssigned ? 'Assigned' : 'Available'}
                  </Badge>
                </TableCell>
                <TableCell className="px-5 py-4 sm:px-6 text-start">
                  {code.isAssigned && (
                    <Button variant="destruction" size="sm" onClick={() => handleDelete(code._id)}>
                      Delete
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}