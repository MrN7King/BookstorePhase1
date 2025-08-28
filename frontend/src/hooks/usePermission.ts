// frontend/src/hooks/usePermissions.ts
import axios from 'axios';
import { useEffect, useState } from 'react';

export const usePermissions = () => {
  const [permissions, setPermissions] = useState<string[]>([]);
  const [role, setRole] = useState<string>(''); // NEW: Add state for user role
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/permissions/my-permissions', {
          withCredentials: true,
        });
             
        setPermissions(response.data.allowedPages || []);
        setRole(response.data.role); // NEW: Set the role from the response
      } catch (error) {
        console.error('Failed to fetch permissions:', error);
        setPermissions([]);
        setRole(''); // Clear role on error
      } finally {
        setLoading(false);
      }
    };

    fetchPermissions();
  }, []);

  const hasPermission = (pageName: string) => permissions.includes(pageName);
  
  return { permissions, hasPermission, loading, role }; // NEW: Return role
};