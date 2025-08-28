// frontend/src/pages/admin/components/ProtectedRoute.tsx
import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { usePermissions } from '../../../hooks/usePermission';

interface ProtectedRouteProps {
    permissionKey: string;
    children: ReactNode;
}

const ProtectedRoute = ({ permissionKey, children }: ProtectedRouteProps) => {
    const { permissions, role, loading } = usePermissions();

    if (loading) {
        // Show a loading state while fetching permissions
        return (
            <div className="flex items-center justify-center min-h-screen text-gray-600">
                Verifying permissions...
            </div>
        );
    }
    
    // Scenario 1: Customer or unauthorized access
    // If the user is a customer, or they are not an employee/owner, they cannot access any admin page.
    if (!role || role === 'customer') {
        return <Navigate to="/404" replace />;
    }

    // Scenario 2: Owner
    // Owners have full access to all pages without needing a specific permission check.
    if (role === 'owner') {
        return <>{children}</>;
    }

    // Scenario 3: Employee
    // Employees must have the specific permission for the page they are trying to access.
    if (role === 'employee' && !permissions.includes(permissionKey)) {
        return <Navigate to="/404" replace />;
    }

    // If all checks pass, render the protected component
    return <>{children}</>;
};

export default ProtectedRoute;