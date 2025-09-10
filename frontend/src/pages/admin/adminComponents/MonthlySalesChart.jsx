import { useState } from "react";
import ReactApexChart from "react-apexcharts";

export default function MonthlySalesChart({ data }) {
  // Ensure we always have 12 months (fill missing with 0)
  const monthNames = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  const now = new Date();
  const last12Months = Array.from({ length: 12 }).map((_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (11 - i), 1);
    return {
      key: `${d.getFullYear()}-${String(d.getMonth()).padStart(2, "0")}`,
      label: `${monthNames[d.getMonth()]} '${d.getFullYear().toString().slice(2)}`
    };
  });

  // Map backend data into lookup
  const dataMap = {};
  if (Array.isArray(data)) {
    data.forEach(item => {
      const date = new Date(item.date);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      dataMap[key] = item.orders || 0;
    });
  }

  // Build chart series with 12 months
  const chartCategories = last12Months.map(m => m.label);
  const chartValues = last12Months.map(m => dataMap[m.key] || 0);

  // Calculate total orders
  const totalOrders = chartValues.reduce((sum, val) => sum + val, 0);

  const options = {
    colors: ["#465fff"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "bar",
      height: 180,
      toolbar: { show: false },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "45%",
        borderRadius: 5,
        borderRadiusApplication: "end",
      },
    },
    dataLabels: { enabled: false },
    stroke: { show: true, width: 4, colors: ["transparent"] },
    xaxis: {
      categories: chartCategories,
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: {
        style: { fontSize: "11px" }
      }
    },
    legend: { show: false },
    yaxis: {
      title: {
        text: "Number of Orders",
        style: { fontSize: "12px", color: "#465fff" }
      },
      labels: {
        formatter: val => val.toFixed(0)
      }
    },
    grid: {
      yaxis: { lines: { show: true } }
    },
    fill: { opacity: 1 },
    tooltip: {
      x: { show: false },
      y: {
        formatter: val => val.toFixed(0),
      },
    },
  };

  const series = [
    { name: "Orders", data: chartValues }
  ];

  const [isOpen, setIsOpen] = useState(false);

  function toggleDropdown() {
    setIsOpen(!isOpen);
  }
  function closeDropdown() {
    setIsOpen(false);
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Monthly Orders
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Total Orders (12 months): {totalOrders.toLocaleString()}
          </p>
        </div>
      
      </div>

      <div className="max-w-full overflow-x-auto custom-scrollbar">
        <div className="-ml-5 min-w-[650px] xl:min-w-full pl-2">
          <ReactApexChart
            options={options}
            series={series}
            type="bar"
            height={300}
          />
        </div>
      </div>
    </div>
  );
}
