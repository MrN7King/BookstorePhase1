import { Switch } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import React, { useEffect, useState } from 'react';
import Button from '../adminUI/Button.tsx';
import { Dropdown } from '../adminUI/Dropdown.tsx';
import { DropdownItem } from '../adminUI/DropdownItem.tsx';
import Label from './FormElements/Label.tsx';
import InputField from './input/InputField.tsx';

interface User {
  _id: string;
  name: string;
  email: string;
  role: 'customer' | 'employee' | 'owner' | 'guest';
  status: 'active' | 'inactive';
  lastLogin?: string;
}

interface UserEditFormProps {
  user: User;
  onSave: (updatedUser: User) => void;
  onDelete: (userId: string) => void;
}

const DropdownMenu: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="p-1">{children}</div>
);

const UserEditForm: React.FC<UserEditFormProps> = ({
  user,
  onSave,
  onDelete,
}) => {
  const [formData, setFormData] = useState<User>({
    ...user,
  });
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const isGuestUser = user.role === 'guest';

  useEffect(() => {
    setFormData(user);
  }, [user]);

  // Dynamically set roles based on user's current role
  // This logic is crucial to prevent role changes for guest users and
  // to ensure other roles cannot become guests.
  const roles = isGuestUser ? ['guest'] : ['customer', 'employee', 'owner'];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleStatusToggle = () => {
    // A guest user cannot have their status toggled
    if (isGuestUser) return;
    setFormData((prevData) => ({
      ...prevData,
      status: prevData.status === 'active' ? 'inactive' : 'active',
    }));
  };

  const handleRoleSelect = (role: User['role']) => {
    // A guest user cannot have their role changed
    if (isGuestUser) return;
    setFormData(prevData => ({ ...prevData, role }));
    setIsRoleDropdownOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleDeleteClick = () => {
    onDelete(user._id);
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 bg-white ">
      <h2 className="text-xl font-bold mb-4">Editing User: {user.name}</h2>
      
      <div className="mb-4">
        <Label htmlFor="name">Name</Label>
        <InputField
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          type="text"
        />
      </div>
      <div className="mb-4">
        <Label htmlFor="email">Email</Label>
        <InputField
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          type="email"
        />
      </div>

      <div className="mb-4 relative">
        <Label htmlFor="role">Role</Label>
        <Button
          type="button"
          variant="outline"
          onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
          className="w-full justify-between"
          endIcon={<ChevronDownIcon className="h-5 w-5" />}
          disabled={isGuestUser}
        >
          <div className="flex-grow text-left">
            {formData.role.charAt(0).toUpperCase() + formData.role.slice(1)}
          </div>
        </Button>
        <Dropdown isOpen={isRoleDropdownOpen} onClose={() => setIsRoleDropdownOpen(false)} className="w-full">
          <DropdownMenu>
            {roles.map((role) => (
              <DropdownItem
                key={role}
                tag="button"
                onClick={() => handleRoleSelect(role as User['role'])}
              >
                {role.charAt(0).toUpperCase() + role.slice(1)}
              </DropdownItem>
            ))}
          </DropdownMenu>
        </Dropdown>
      </div>

      <div className="mb-4 flex items-center justify-between">
        <Label>Account Status: {formData.status.toUpperCase()}</Label>
        <Switch
          checked={formData.status === 'active'}
          onChange={handleStatusToggle}
          className={`${
            formData.status === 'active' ? 'bg-blue-600' : 'bg-gray-200'
          } relative inline-flex h-6 w-11 items-center rounded-full`}
          disabled={isGuestUser}
        >
          <span
            className={`${
              formData.status === 'active' ? 'translate-x-6' : 'translate-x-1'
            } inline-block h-4 w-4 transform rounded-full bg-white transition`}
          />
        </Switch>
      </div>
      
      {user.lastLogin && (
        <div className="mb-4 text-sm text-gray-500">
          Last Login: {new Date(user.lastLogin).toLocaleString()}
        </div>
      )}

      <div className="mt-6 flex flex-col sm:flex-row gap-4">
        <Button type="submit">Save Changes</Button>
        <Button type="button" onClick={handleDeleteClick}>
          Delete User
        </Button>
      </div>

      <div className="mt-8 pt-4 border-t border-gray-200">
        <h3 className="text-lg font-semibold">Account History</h3>
        <p className="text-sm text-gray-500">
          History log will be displayed here.
        </p>
      </div>
    </form>
  );
};

export default UserEditForm;