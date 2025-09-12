import React, { useState } from 'react';
import Badge from '../adminUI/Badge';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '../adminUI/Table';

export default function RecentOrders({ data }) {
  const [expandedOrder, setExpandedOrder] = useState(null);

  const toggleExpand = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="flex flex-col gap-2 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Recent Orders
          </h3>
        </div>
      </div>
      
      <div className="max-w-full overflow-x-auto">
        <div className="max-h-[400px] overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-track]:bg-neutral-700 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500">
          <Table className="min-w-full">
            <TableHeader className="sticky top-0 z-10 bg-white dark:bg-white/[0.03] border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                {['Email', 'Items', 'Total', 'Status', 'Date', 'Actions'].map((hdr) => (
                  <TableCell
                    key={hdr}
                    isHeader
                    className="px-4 py-2 font-medium text-gray-500 text-start text-xs dark:text-gray-400"
                  >
                    {hdr}
                  </TableCell>
                ))}
              </TableRow>
            </TableHeader>
            
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {data.map((order) => (
                <React.Fragment key={order._id}>
                  <TableRow
                    className={`cursor-pointer hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors ${
                      expandedOrder === order._id ? 'bg-blue-50 dark:bg-blue-950' : ''
                    }`}
                  >
                    <TableCell className="px-4 py-2 text-start text-sm">
                      {/* Show email instead of name */}
                      {order.userId?.email || order.email}
                    </TableCell>
                    <TableCell className="px-4 py-2 text-start text-sm">
                      {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                    </TableCell>
                    <TableCell className="px-4 py-2 text-start text-sm">
                      ${order.payment?.amount?.toFixed(2) || '0.00'}
                    </TableCell>
                    <TableCell className="px-4 py-2 text-start">
                      <Badge
                        size="sm"
                        color={
                          order.status === "completed" || order.status === "delivered"
                            ? "success"
                            : order.status === "pending" || order.status === "paid"
                              ? "warning"
                              : "error"
                        }
                      >
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-4 py-2 text-start text-sm">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="px-4 py-2 text-start">
                      <button
                        onClick={() => toggleExpand(order._id)}
                        className="text-blue-500 hover:text-blue-700 text-xs font-medium"
                      >
                        {expandedOrder === order._id ? 'Hide' : 'View'} Details
                      </button>
                    </TableCell>
                  </TableRow>
                  
                  {expandedOrder === order._id && (
                    <TableRow>
                      <TableCell colSpan={6} className="p-0">
                        <div className="px-4 py-2 bg-gray-50 dark:bg-neutral-900">
                          <h4 className="font-semibold mb-2 text-sm text-gray-800 dark:text-white/90">Order Items:</h4>
                          <div className="grid gap-2">
                            {order.items.map((item, index) => (
                              <div key={index} className="flex items-center justify-between p-2 border border-gray-200 dark:border-neutral-700 rounded-lg text-xs">
                                <div>
                                  <p className="font-medium text-gray-800 dark:text-white/90">{item.productSnapshot.name}</p>
                                  <p className="text-xs text-gray-500 dark:text-gray-400">
                                    {item.productSnapshot.category}
                                  </p>
                                </div>
                                <div className="text-right">
                                  <p className="text-xs text-gray-600 dark:text-gray-300">
                                    ${item.productSnapshot.price.toFixed(2)} x {item.quantity}
                                  </p>
                                  <p className="font-semibold text-gray-800 dark:text-white/90">
                                    ${(item.productSnapshot.price * item.quantity).toFixed(2)}
                                  </p>
                                </div>
                              </div>
                            ))}
                            <div className="flex justify-between items-center pt-2 border-t border-gray-200 dark:border-neutral-700 text-sm">
                              <p className="font-semibold text-gray-800 dark:text-white/90">Order Total:</p>
                              <p className="font-bold text-gray-800 dark:text-white/90">
                                ${order.payment?.amount?.toFixed(2) || '0.00'}
                              </p>
                            </div>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}