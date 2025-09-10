export default function EcommerceMetrics({ data }) {
  // Safely extract data with fallbacks
  const overview = data?.overview || {
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0
  };
  
  const today = data?.today || {
    orders: 0,
    revenue: 0,
    userGrowth: 0
  };
  
  const monthly = data?.monthly || {
    revenue: 0
  };

  const metrics = [
    {
      title: 'Total Verified Users',
      value: overview.totalUsers.toLocaleString(),
      change: today.userGrowth > 0 ? `+${today.userGrowth}%` : `${today.userGrowth}%`,
      changeType: today.userGrowth > 0 ? 'success' : 'error',
      icon: 'group'
    },
    {
      title: 'Total Products',
      value: overview.totalProducts.toLocaleString(),
      icon: 'inventory_2'
    },
    {
      title: 'Total Orders',
      value: overview.totalOrders.toLocaleString(),
    
      changeType: today.orders > 0 ? 'success' : 'error',
      icon: 'shopping_cart'
    },
    {
      title: 'Total Revenue',
      value: `$${overview.totalRevenue.toLocaleString()}`,
      icon: 'attach_money'
    }
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4 md:gap-6">
      {metrics.map((metric, index) => (
        <div key={index} className="rounded-2xl border bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
          <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
            <span className="material-icons text-gray-800 dark:text-white/90">
              {metric.icon}
            </span>
          </div>

          <div className="flex items-end justify-between mt-5">
            <div>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {metric.title}
              </span>
              <h4 className="mt-2 font-bold text-gray-800 text-xl dark:text-white/90">
                {metric.value}
              </h4>
            </div>
            
            {metric.change && (
              <span className={`text-sm font-medium ${
                metric.changeType === 'success' 
                  ? 'text-green-500' 
                  : 'text-red-500'
              }`}>
                {metric.change}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}