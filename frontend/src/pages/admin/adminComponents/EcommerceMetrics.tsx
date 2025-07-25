import Badge from "../adminUI/Badge";

export default function EcommerceMetrics() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
      {/* Customers */}
      <div className="rounded-2xl border bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <span className="material-icons text-gray-800 dark:text-white/90">
            group
          </span>
        </div>

        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Customers
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              3,782
            </h4>
          </div>
          <Badge color="success">
            <span className="material-icons text-green-600 align-middle">
              arrow_upward
            </span>
            11.01%
          </Badge>
        </div>
      </div>

      {/* Orders */}
      <div className="rounded-2xl border bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <span className="material-icons text-gray-800 dark:text-white/90">
            inventory_2
          </span>
        </div>

        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Orders
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              5,359
            </h4>
          </div>
          <Badge color="error">
            <span className="material-icons text-red-600 align-middle">
              arrow_downward
            </span>
            9.05%
          </Badge>
        </div>
      </div>
    </div>
  );
}
// This component displays two cards: one for Customers and one for Orders.