//file: frontend/src/pages/admin/adminPages/Dashboard.tsx

import EcommerceMetrics from "../adminComponents/EcommerceMetrics";
import MonthlySalesChart from "../adminComponents/MonthlySalesChart";
import RecentOrders from "../adminComponents/RecentOrders";
import DemographicCard from "../adminComponents/DemographicCard";


export default function AdminDashboard() {
  return (
    <>
      <div className="grid grid-cols-12 gap-4 md:gap-6">
        <div className="col-span-12 space-y-6 xl:col-span-12">
          <EcommerceMetrics />

          <MonthlySalesChart />
        </div>

        <div className="col-span-12 xl:col-span-5">
          <DemographicCard />
        </div>

        <div className="col-span-12 xl:col-span-7">
          <RecentOrders />
        </div>
      </div>
    </>
  );
}
