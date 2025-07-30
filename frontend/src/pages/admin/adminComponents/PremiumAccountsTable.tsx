// File: frontend/src/pages/admin/adminComponents/PremiumAccountsTable.tsx
import { useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import axios from 'axios';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
} from '../adminUI/Table';
import Badge from '../adminUI/Badge';

export interface PremiumProduct {
  _id: string;
  name: string;
  slug: string;
  price: number;
  isAvailable: boolean;
  status: 'active' | 'inactive';
  tags: string[];
  platform: string;
  duration: string;
  licenseType: 'key' | 'login' | 'serial';
}

export interface PremiumAccountsTableProps {
  onSelect: (product: PremiumProduct) => void;
}

export interface PremiumAccountsTableRef {
  refresh: () => void;
}

const PremiumAccountsTable = forwardRef<PremiumAccountsTableRef, PremiumAccountsTableProps>(
  ({ onSelect }, ref) => {
    const [products, setProducts] = useState<PremiumProduct[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchProducts = async () => {
      setLoading(true);
      try {
        const api = axios.create({ baseURL: 'http://localhost:5000/api' });
        const { data } = await api.get<PremiumProduct[]>('/premium');
        setProducts(data);
        setError(null);
      } catch {
        setError('Failed to load premium products');
      } finally {
        setLoading(false);
      }
    };

    useImperativeHandle(ref, () => ({
      refresh: fetchProducts,
    }));

    useEffect(() => {
      fetchProducts();
    }, []);

    if (loading) return <p className="p-4">Loading...</p>;
    if (error) return <p className="p-4 text-red-600">{error}</p>;

    return (
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                {['ID', 'Name', 'Platform', 'Duration', 'Price', 'Status'].map(
                  (hdr) => (
                    <TableCell
                      key={hdr}
                      isHeader
                      className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                    >
                      {hdr}
                    </TableCell>
                  )
                )}
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {products.map((prod) => (
                <TableRow
                  key={prod._id}
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => onSelect(prod)}
                >
                  <TableCell className="px-5 py-4 sm:px-6 text-start">
                    {prod._id.slice(-6)}
                  </TableCell>
                  <TableCell className="px-5 py-4 sm:px-6 text-start">
                    {prod.name}
                  </TableCell>
                  <TableCell className="px-5 py-4 sm:px-6 text-start">
                    {prod.platform}
                  </TableCell>
                  <TableCell className="px-5 py-4 sm:px-6 text-start">
                    {prod.duration}
                  </TableCell>
                  <TableCell className="px-5 py-4 sm:px-6 text-start">
                    ${prod.price.toFixed(2)}
                  </TableCell>
                  <TableCell className="px-5 py-4 sm:px-6 text-start">
                    <Badge
                      size="sm"
                      color={prod.status === 'active' ? 'success' : 'error'}
                    >
                      {prod.status.charAt(0).toUpperCase() + prod.status.slice(1)}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  }
);

export default PremiumAccountsTable;