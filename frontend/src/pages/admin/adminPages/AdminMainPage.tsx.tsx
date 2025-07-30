// src/pages/admin/adminPages/AdminMainPage.tsx

// Remove BrowserRouter import, as it will be handled by App.jsx
import { Routes, Route } from "react-router-dom"; // Use react-router-dom
import { ScrollToTop } from "../adminUI/ScrollToTop"; // Adjust path relative to AdminMainPage.tsx
import Dashboard from "./Dashboard"; // Renamed from Home to avoid confusion with main app's Home
import AppLayout from "../adminLayout/AppLayout"; // Adjust path relative to AdminMainPage.tsx
import AdminAddProduct from "./AdminAddProduct"; // Import the new Add Product page
import AdminAddPremiumAccount from "./AdminAddPremiumAccount";
import AdminAddPremiumAccountCodes from "./AdminAddPremiumCode";

// Import all your admin-specific components (placeholders)
// import UserProfiles from "../../UserProfiles"; // Assuming these are in a 'pages' or 'adminPages' folder
// import Calendar from "../../Calendar";
// import Blank from "../../Blank";
// import FormElements from "../../FormElements";
// import BasicTables from "../../BasicTables";
// import Alerts from "../../Alerts";
// import Avatars from "../../Avatars";
// import Badges from "../../Badges";
// import Buttons from "../../Buttons";
// import Images from "../../Images";
// import Videos from "../../Videos";
// import LineChart from "../../LineChart";
// import BarChart from "../../BarChart";
// Note: SignIn and SignUp will be moved to App.jsx as they are typically top-level auth routes.
// Note: NotFound will be handled globally in App.jsx.

export default function AdminMainPage() {
  return (
    <>
      <ScrollToTop /> {/* Keep ScrollToTop here if it's specific to admin pages */}
      <Routes>
        {/*
          IMPORTANT: These paths are now relative to the parent route where AdminMainPage is rendered.
          If AdminMainPage is mounted at /admin, then:
          - <Route index element={<Dashboard />} /> will be for /admin
          - <Route path="/profile" ... /> will be for /admin/profile
        */}
        <Route element={<AppLayout />}>
          {/* Dashboard for admin, accessed at /admin */}
          <Route index element={<Dashboard />} />
          <Route path="/Add-ebooks" element={<AdminAddProduct />} />
          <Route path="/Add-premiumAccount" element={<AdminAddPremiumAccount/>} />
          <Route path="/Add-premiumCodes" element={<AdminAddPremiumAccountCodes/>}/>

          {/* Other Admin Pages */}
          {/* 
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/blank" element={<Blank />} /> */}

          {/* Forms */}
          {/* <Route path="/form-elements" element={<FormElements />} /> */}

          {/* Tables */}
          {/* <Route path="/basic-tables" element={<BasicTables />} /> */}

          {/* UI Elements */}
          {/* <Route path="/alerts" element={<Alerts />} />
          <Route path="/avatars" element={<Avatars />} />
          <Route path="/badge" element={<Badges />} />
          <Route path="/buttons" element={<Buttons />} />
          <Route path="/images" element={<Images />} />
          <Route path="/videos" element={<Videos />} /> */}

          {/* Charts */}
          {/* <Route path="/line-chart" element={<LineChart />} />
          <Route path="/bar-chart" element={<BarChart />} /> */}
        </Route>

        {/*
          Removed Auth Layout and Fallback Route from here.
          SignIn, SignUp, and 404 should be handled at the top-level in App.jsx.
          This prevents conflicts and ensures a single 404 page for the entire app.
        */}
      </Routes>
    </>
  );
}