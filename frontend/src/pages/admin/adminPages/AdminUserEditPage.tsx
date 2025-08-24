import axios from 'axios';
import React, { useEffect, useState } from 'react';
import ComponentCard from '../adminComponents/ComponentCard.tsx';
import PageBreadcrumb from '../adminComponents/PageBreadCrumb.tsx';
import { UserTable } from '../adminComponents/UserTable.tsx';
import UserEditForm from '../adminForm/UserEditForm.tsx';
import Alert from '../adminUI/Alert.tsx';

const API_URL = 'http://localhost:5000/api/user';
const config = { withCredentials: true };

export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'customer' | 'employee' | 'owner';
  status: 'active' | 'inactive';
  lastLogin?: string;
}

const AdminUserEditPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [alert, setAlert] = useState<{ variant: 'success' | 'error'; title: string; message: string } | null>(null);
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] = useState(false);
  const [userToDeleteId, setUserToDeleteId] = useState<string | null>(null);

  const fetchUsersData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_URL}/all-users`, config);

      // Filter out unverified accounts before mapping
      const verifiedUsers = response.data.users.filter((user: any) => user.isAccountVerified);

      const fetchedUsers: User[] = verifiedUsers.map((user: any) => ({
        _id: user._id,
        name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'N/A',
        email: user.email,
        role: user.role,
        status: user.isAccountVerified ? 'active' : 'inactive',
        lastLogin: user.lastLogin,
      }));
      setUsers(fetchedUsers);
    } catch (err) {
      console.error("Failed to fetch user data:", err);
      setError("Failed to fetch user data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsersData();
  }, []);

  const handleSave = async (updatedUser: User) => {
    if (!selectedUser) return;

    // Check if a non-guest user is being deactivated
    if (updatedUser.status === 'inactive' && selectedUser.status === 'active') {
      console.log(`User ${updatedUser._id} is now inactive. Logging them out...`);
      // await axios.post(`${API_URL}/logout/${updatedUser._id}`, {}, config);
    }

    try {
      const [firstName, ...lastNameParts] = updatedUser.name.split(' ');
      const lastName = lastNameParts.join(' ');

      const payload = {
        firstName,
        lastName,
        email: updatedUser.email,
        role: updatedUser.role,
        isAccountVerified: updatedUser.status === 'active',
      };

      const response = await axios.put(`${API_URL}/${updatedUser._id}`, payload, config);

      const savedUser: User = {
        _id: response.data.user._id,
        name: `${response.data.user.firstName || ''} ${response.data.user.lastName || ''}`.trim() || 'N/A',
        email: response.data.user.email,
        role: response.data.user.role,
        status: response.data.user.isAccountVerified ? 'active' : 'inactive',
        lastLogin: response.data.user.lastLogin,
      };

      setUsers(users.map(u => u._id === savedUser._id ? savedUser : u));
      setSelectedUser(savedUser);
      setAlert({ variant: 'success', title: 'Success!', message: 'User updated successfully.' });
    } catch (error) {
      console.error('Failed to save user:', error);
      setAlert({ variant: 'error', title: 'Error!', message: 'Failed to save user. Please try again.' });
    }
  };

  const handleDelete = (id: string) => {
    setUserToDeleteId(id);
    setIsDeleteConfirmationOpen(true);
  };

  const handleCancelDelete = () => {
    setIsDeleteConfirmationOpen(false);
    setUserToDeleteId(null);
  };

  const handleConfirmDelete = async () => {
    if (!userToDeleteId) return;

    try {
      await axios.delete(`${API_URL}/${userToDeleteId}`, config);
      setUsers(users.filter(u => u._id !== userToDeleteId));
      setSelectedUser(null);
      setAlert({ variant: 'success', title: 'Success!', message: 'User deleted successfully.' });
      console.log('User deleted successfully!');
    } catch (error) {
      console.error('Failed to delete user:', error);
      setAlert({ variant: 'error', title: 'Error!', message: 'Failed to delete user. Please try again.' });
    } finally {
      setIsDeleteConfirmationOpen(false);
      setUserToDeleteId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-600">
        Loading user data...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-600">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="relative flex flex-col">
      <div>
        <PageBreadcrumb pageTitle="Edit Users" />
      </div>

      <div className="p-6 pt-0 flex flex-col gap-6">
        {alert && (
          <div className="mb-4">
            <Alert
              variant={alert.variant}
              title={alert.title}
              message={alert.message}
            />
          </div>
        )}
        <ComponentCard title="All Users">
          <UserTable
            users={users}
            onSelect={setSelectedUser}
            selectedUser={selectedUser}
          />
        </ComponentCard>
        <ComponentCard title="User Details">
          {selectedUser ? (
            <UserEditForm
              user={selectedUser}
              onSave={handleSave}
              onDelete={handleDelete}
            />
          ) : (
            <div className="text-gray-500 italic text-center py-20">
              Select a user from the table to view and edit their details.
            </div>
          )}
        </ComponentCard>
      </div>

      {isDeleteConfirmationOpen && (
        <div className="fixed inset-0 z-40 bg-black/40 flex items-center justify-center">
          <div className="relative z-50 w-96 rounded-xl bg-white p-6 text-center shadow-2xl border border-yellow-300">
            {/* Warning Icon */}
            <div className="flex justify-center mb-4">
              <svg
                className="w-12 h-12 text-yellow-500"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3m0 4h.01M21 21H3l9-18 9 18z"
                />
              </svg>
            </div>

            {/* Title */}
            <h3 className="mb-2 text-2xl font-bold text-yellow-600">Warning!</h3>

            {/* Message */}
            <p className="mb-6 text-gray-700">
              This action is permanent. Are you sure you want to delete this user?
            </p>

            {/* Buttons */}
            <div className="flex justify-center space-x-4">
              <button
                onClick={handleCancelDelete}
                className="rounded-md bg-gray-200 px-4 py-2 text-gray-800 font-medium transition-colors hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="rounded-md bg-yellow-500 px-4 py-2 text-white font-medium transition-colors hover:bg-yellow-600"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUserEditPage;