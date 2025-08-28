// frontend/src/pages/admin/adminPages/AdminUserPermissionsPage.tsx
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import ComponentCard from '../adminComponents/ComponentCard.tsx';
import PageBreadcrumb from '../adminComponents/PageBreadCrumb.tsx';
import Alert from '../adminUI/Alert.tsx';
import Button from '../adminUI/Button.tsx';

const API_URL = 'http://localhost:5000/api/permissions';
const config = { withCredentials: true };

interface Employee {
  _id: string;
  name: string;
  email: string;
  role: string;
  allowedPages: string[];
  availablePages: string[];
}

const PAGE_LABELS: { [key: string]: string } = {
  dashboard: 'Dashboard',
  addEbooks: 'Add E-books',
  editEbooks: 'Edit E-books', 
  addPremiumAccount: 'Add Premium Account',
  addPremiumCodes: 'Add Premium Codes',
  manageUsers: 'Manage Users',
  userPermissions: 'User Permissions',
  
};

const AdminUserPermissionsPage: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [alert, setAlert] = useState<{ variant: 'success' | 'error'; title: string; message: string } | null>(null);
  const [initialPermissions, setInitialPermissions] = useState<string[]>([]);
  const [userPermissionsChanged, setUserPermissionsChanged] = useState(false);

  const fetchEmployees = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_URL}/employees`, config);
      setEmployees(response.data.employees);
    } catch (err) {
      console.error('Failed to fetch employees:', err);
      setError('Failed to fetch employee data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleEmployeeSelect = (employee: Employee) => {
    setSelectedEmployee(employee);
    setInitialPermissions(employee.allowedPages);
    setUserPermissionsChanged(false);
    setAlert(null);
  };

  const handlePageToggle = (pageName: string) => {
    if (!selectedEmployee) return;

    const currentPages = selectedEmployee.allowedPages;
    const newPages = currentPages.includes(pageName)
      ? currentPages.filter(p => p !== pageName)
      : [...currentPages, pageName];
    
    // Check if the 'userPermissions' page has been toggled
    const hasUserPermissionsChanged = newPages.includes('userPermissions') !== initialPermissions.includes('userPermissions');
    setUserPermissionsChanged(hasUserPermissionsChanged);

    setSelectedEmployee({
      ...selectedEmployee,
      allowedPages: newPages
    });
  };

  const handleSavePermissions = async () => {
    if (!selectedEmployee) return;
    
    setSaving(true);
    try {
      await axios.put(
        `${API_URL}/employees/${selectedEmployee._id}`, 
        { allowedPages: selectedEmployee.allowedPages }, 
        config
      );
      
      setEmployees(employees.map(emp => 
        emp._id === selectedEmployee._id ? selectedEmployee : emp
      ));
      
      setAlert({ 
        variant: 'success', 
        title: 'Success!', 
        message: 'Employee permissions updated successfully.' 
      });
      setUserPermissionsChanged(false);
    } catch (err) {
      console.error('Failed to update permissions:', err);
      setAlert({ 
        variant: 'error', 
        title: 'Error!', 
        message: 'Failed to update permissions. Please try again.' 
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-600">
        Loading employees...
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
      <PageBreadcrumb pageTitle="User Permissions" />
      
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
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Employee List */}
          <ComponentCard title="Employees">
            <div className="space-y-2">
              {employees.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No employees found.</p>
              ) : (
                employees.map((employee) => (
                  <div
                    key={employee._id}
                    onClick={() => handleEmployeeSelect(employee)}
                    className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                      selectedEmployee?._id === employee._id
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-950'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800'
                    }`}
                  >
                    <div className="font-medium text-gray-900 dark:text-white">
                      {employee.name}
                    </div>
                    <div className="text-sm text-gray-500">{employee.email}</div>
                    <div className="text-xs text-gray-400 mt-1">
                      {employee.allowedPages.length} pages allowed
                    </div>
                  </div>
                ))
              )}
            </div>
          </ComponentCard>

          {/* Permission Settings */}
          <ComponentCard title="Page Permissions">
            {selectedEmployee ? (
              <div className="space-y-4">
                <div className="border-b border-gray-200 dark:border-gray-700 pb-3">
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    {selectedEmployee.name}
                  </h3>
                  <p className="text-sm text-gray-500">{selectedEmployee.email}</p>
                </div>
                
                <div className="space-y-3">
                  {selectedEmployee.availablePages.map((pageName) => {
                    const isAllowed = selectedEmployee.allowedPages.includes(pageName);
                    const isUserPermissions = pageName === 'userPermissions';
                    
                    return (
                      <div
                        key={pageName}
                        className={`flex items-center justify-between p-3 rounded-lg border ${
                          isUserPermissions ? 'bg-red-100 dark:bg-gray-800' : 'bg-white dark:bg-gray-900'
                        }`}
                      >
                        <div className="flex-1">
                          <div className="font-medium text-gray-900 dark:text-white">
                            {PAGE_LABELS[pageName] || pageName}
                          </div>
                          {isUserPermissions && (
                            <div className="text-xs text-red-500">
                                This page is for owners, but can be managed.
                            </div>
                          )}
                        </div>
                        
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={isAllowed}
                            onChange={() => handlePageToggle(pageName)}
                            className="sr-only peer"
                          />
                          <div className={`w-11 h-6 rounded-full peer transition-colors ${
                              isAllowed 
                                ? 'bg-blue-600' 
                                : 'bg-gray-200 peer-focus:ring-4 peer-focus:ring-blue-300'
                          }`}>
                            <div className={`absolute top-[2px] left-[2px] bg-white rounded-full h-5 w-5 transition-transform ${
                              isAllowed ? 'translate-x-5' : 'translate-x-0'
                            }`}></div>
                          </div>
                        </label>
                      </div>
                    );
                  })}
                </div>
                
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <Button 
                    onClick={handleSavePermissions}
                    disabled={saving}
                    className={`w-full transition-colors ${
                      userPermissionsChanged
                        ? 'bg-red-600 hover:bg-red-700 text-white' 
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                  >
                    {saving ? 'Saving...' : 'Save Permissions'}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-gray-500 italic text-center py-20">
                Select an employee to manage their permissions.
              </div>
            )}
          </ComponentCard>
        </div>
      </div>
    </div>
  );
};

export default AdminUserPermissionsPage;