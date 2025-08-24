import React from 'react';
import { User } from '../adminPages/AdminUserEditPage.tsx';
import Badge from '../adminUI/Badge';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '../adminUI/Table';

interface UserTableProps {
  users: User[];
  onSelect: (user: User) => void;
  selectedUser: User | null;
}

export const UserTable: React.FC<UserTableProps> = ({ users, onSelect, selectedUser }) => {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white  dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <div className="max-h-[300px] overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-track]:bg-neutral-700 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500">
          <Table className="min-w-full">
            <TableHeader className="sticky top-0 z-10 bg-white dark:bg-white/[0.03] border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                {['Name', 'Email', 'Role', 'Status'].map((hdr) => (
                  <TableCell
                    key={hdr}
                    isHeader
                    className="px-6 py-3 font-medium text-gray-500 text-start text-sm dark:text-gray-400"
                  >
                    {hdr}
                  </TableCell>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {users.map(user => (
                <TableRow
                  key={user._id}
                  onClick={() => onSelect(user)}
                  className={`cursor-pointer hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors ${
                    selectedUser?._id === user._id ? 'bg-blue-50 dark:bg-blue-950' : ''
                  }`}
                >
                  <TableCell className="px-6 py-4 text-start">
                    {user.name}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-start">
                    {user.email}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-start">
                    <Badge
                      size="sm"
                      color={
                        user.role === 'owner' ? 'purple' :
                        user.role === 'employee' ? 'info' :
                        'primary'
                      }
                    >
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-6 py-4 text-start">
                    <Badge
                      size="sm"
                      color={user.status === 'active' ? 'success' : 'error'}
                    >
                      {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};