// frontend/src/pages/admin/adminUI/Table.tsx
import React, { ReactNode, HTMLAttributes } from "react";

// Props for Table
interface TableProps {
  children: ReactNode; // Table content (thead, tbody, etc.)
  className?: string;  // Optional className for styling
}

// Props for TableHeader
interface TableHeaderProps {
  children: ReactNode;
  className?: string;
}

// Props for TableBody
interface TableBodyProps {
  children: ReactNode;
  className?: string;
}

// Props for TableRow (extends HTMLAttributes to allow click handlers, etc.)
interface TableRowProps extends HTMLAttributes<HTMLTableRowElement> {
  children: ReactNode; // Cells (th or td)
  className?: string;  // Optional className for styling
}

// Props for TableCell
interface TableCellProps extends React.HTMLAttributes<HTMLTableCellElement> {
  children: ReactNode; // Cell content
  isHeader?: boolean;  // If true, renders as <th>, otherwise <td>
  className?: string;  // Optional className for styling
}

// Table Component
type TableFC = React.FC<TableProps>;
export const Table: TableFC = ({ children, className = "" }) => (
  <table className={`min-w-full ${className}`}>{children}</table>
);

// TableHeader Component
type TableHeaderFC = React.FC<TableHeaderProps>;
export const TableHeader: TableHeaderFC = ({ children, className = "" }) => (
  <thead className={className}>{children}</thead>
);

// TableBody Component
type TableBodyFC = React.FC<TableBodyProps>;
export const TableBody: TableBodyFC = ({ children, className = "" }) => (
  <tbody className={className}>{children}</tbody>
);

// TableRow Component
export const TableRow = React.forwardRef<HTMLTableRowElement, TableRowProps>(
  ({ children, className = "", ...rest }, ref) => (
    <tr ref={ref} className={className} {...rest}>
      {children}
    </tr>
  )
);

// TableCell Component
type TableCellFC = React.FC<TableCellProps>;
export const TableCell: TableCellFC = ({ children, isHeader = false, className = "", ...rest }) => {
  const Tag = isHeader ? 'th' : 'td';
  return (
    <Tag className={className} {...rest}>
      {children}
    </Tag>
  );
};