// file: frontend/src/pages/admin/adminLayout/AppSidebar.tsx
import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { usePermissions } from "../../../hooks/usePermission"; // Correct import
import { useSidebar } from "../adminUI/SidebarContext";

// Define a type for NavItem that includes the Google Fonts icon name
type NavItem = {
  name: string;
  iconName: string; 
  path?: string;
  permission?: string;
  subItems?: { name: string; path: string; permission?: string; pro?: boolean; new?: boolean }[];
};

const navItems: NavItem[] = [
  {
    iconName: "dashboard",
    name: "Dashboard",
    path: "/admin",
    permission: "dashboard",
  },
  {
    iconName: "edit",
    name: "Edit User Profile",
    path: "/admin/manage-users",
    permission: "manageUsers",
  },
  {
    iconName: "lock_person",
    name: "User Permissions", 
    path: "/admin/user-permissions",
    permission: "userPermissions",
  },
  {
    name: "Manage Products",
    iconName: "assignment",
    subItems: [
      { name: "Add E-books", path: "/admin/addebooks", pro: false, permission: "addEbooks" },
      { name: "Edit Ebooks", path: "/admin/editebooks", pro: false, permission: "editEbooks" },
      { name: "Add Premium Accounts", path: "/admin/addPremiumAccount", pro: false, permission: "addPremiumAccount" },
      { name: "Add Premium Code & Edit Premium Accounts", path: "/admin/addPremiumCodes", pro: false, permission: "addPremiumCodes" },
    ],
  },
];

const othersItems: NavItem[] = [];

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const location = useLocation();

  // ❌ Incorrect Destructuring: const { allowedPages, loading, error } = usePermissions();
  // ✅ Correct Destructuring to match the hook's return type:
  const { permissions, hasPermission, loading } = usePermissions();

  const [openSubmenu, setOpenSubmenu] = useState<{
    type: "main" | "others";
    index: number;
  } | null>(null);
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>({});
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const isActive = useCallback(
    (path: string) => location.pathname === path,
    [location.pathname]
  );
 
  useEffect(() => {
    let submenuMatched = false;
    ["main", "others"].forEach((menuType) => {
      const items = menuType === "main" ? navItems : othersItems;
      items.forEach((nav, index) => {
        if (nav.subItems) {
          nav.subItems.forEach((subItem) => {
            if (isActive(subItem.path)) {
              setOpenSubmenu({
                type: menuType as "main" | "others",
                index,
              });
              submenuMatched = true;
            }
          });
        }
      });
    });

    if (!submenuMatched) {
      setOpenSubmenu(null);
    }
  }, [location, isActive]);

  useEffect(() => {
    if (openSubmenu !== null) {
      const key = `${openSubmenu.type}-${openSubmenu.index}`;
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prevHeights) => ({
          ...prevHeights,
          [key]: subMenuRefs.current[key]?.scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu]);

  const handleSubmenuToggle = (index: number, menuType: "main" | "others") => {
    setOpenSubmenu((prevOpenSubmenu) => {
      if (
        prevOpenSubmenu &&
        prevOpenSubmenu.type === menuType &&
        prevOpenSubmenu.index === index
      ) {
        return null;
      }
      return { type: menuType, index };
    });
  };

  const renderMenuItems = (items: NavItem[], menuType: "main" | "others") => (
    <ul className="flex flex-col gap-4">
      {items.map((nav, index) => {
        // Check if the main item itself has a permission
        if (nav.subItems) {
          // If it's a sub-menu, check if any of its sub-items are allowed
          const allowedSubItems = nav.subItems.filter(subItem => hasPermission(subItem.permission as string));
          if (allowedSubItems.length > 0) {
            return (
              <li key={nav.name}>
                <button
                  onClick={() => handleSubmenuToggle(index, menuType)}
                  className={`menu-item group ${openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? "menu-item-active"
                    : "menu-item-inactive"
                  } cursor-pointer ${!isExpanded && !isHovered
                    ? "lg:justify-center"
                    : "lg:justify-start"
                  }`}
                >
                  <span
                    className={`material-symbols-outlined menu-item-icon-size ${openSubmenu?.type === menuType && openSubmenu?.index === index
                        ? "menu-item-icon-active"
                        : "menu-item-icon-inactive"
                      }`}
                  >
                    {nav.iconName}
                  </span>
                  {(isExpanded || isHovered || isMobileOpen) && (
                    <span className="menu-item-text">{nav.name}</span>
                  )}
                  {(isExpanded || isHovered || isMobileOpen) && (
                    <span
                      className={`ml-auto w-5 h-5 transition-transform duration-200 material-symbols-outlined ${openSubmenu?.type === menuType &&
                        openSubmenu?.index === index
                        ? "rotate-180 text-brand-500"
                        : ""
                      }`}
                    >
                      expand_more
                    </span>
                  )}
                </button>
                {nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
                  <div
                    ref={(el) => {
                      subMenuRefs.current[`${menuType}-${index}`] = el;
                    }}
                    className="overflow-hidden transition-all duration-300"
                    style={{
                      height:
                        openSubmenu?.type === menuType && openSubmenu?.index === index
                          ? `${subMenuHeight[`${menuType}-${index}`]}px`
                          : "0px",
                    }}
                  >
                    <ul className="mt-2 space-y-1 ml-9">
                      {allowedSubItems.map((subItem) => (
                        <li key={subItem.name}>
                          <Link
                            to={subItem.path}
                            className={`menu-dropdown-item ${isActive(subItem.path)
                                ? "menu-dropdown-item-active"
                                : "menu-dropdown-item-inactive"
                              }`}
                          >
                            {subItem.name}
                            <span className="flex items-center gap-1 ml-auto">
                              {subItem.new && (
                                <span
                                  className={`ml-auto ${isActive(subItem.path)
                                      ? "menu-dropdown-badge-active"
                                      : "menu-dropdown-badge-inactive"
                                  } menu-dropdown-badge`}
                                >
                                  new
                                </span>
                              )}
                              {subItem.pro && (
                                <span
                                  className={`ml-auto ${isActive(subItem.path)
                                      ? "menu-dropdown-badge-active"
                                      : "menu-dropdown-badge-inactive"
                                  } menu-dropdown-badge`}
                                >
                                  pro
                                </span>
                              )}
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </li>
            );
          }
          return null;
        } else if (nav.permission && hasPermission(nav.permission)) {
          return (
            <li key={nav.name}>
              {nav.path && (
                <Link
                  to={nav.path}
                  className={`menu-item group ${isActive(nav.path) ? "menu-item-active" : "menu-item-inactive"
                    }`}
                >
                  <span
                    className={`material-symbols-outlined menu-item-icon-size ${isActive(nav.path)
                      ? "menu-item-icon-active"
                      : "menu-item-icon-inactive"
                    }`}
                  >
                    {nav.iconName}
                  </span>
                  {(isExpanded || isHovered || isMobileOpen) && (
                    <span className="menu-item-text">{nav.name}</span>
                  )}
                </Link>
              )}
            </li>
          );
        }
        return null; 
      })}
    </ul>
  );

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 
        ${isExpanded || isMobileOpen
          ? "w-[290px]"
          : isHovered
            ? "w-[290px]"
            : "w-[90px]"
        }
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`py-8 flex ${!isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
          }`}
      >
        <Link to="/">
          {(isExpanded || isHovered || isMobileOpen) ? (
            <span className="text-xl font-bold dark:text-white text-black">
              IBooj 
            </span>
          ) : (
            <span className="text-base font-semibold dark:text-white text-black">
              E
            </span>
          )}
        </Link>
      </div>
      <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
        <nav className="mb-6">
          <div className="flex flex-col gap-4">
            <div>
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${!isExpanded && !isHovered
                    ? "lg:justify-center"
                    : "justify-start"
                  }`}
              >
                {isExpanded || isHovered || isMobileOpen ? (
                  "Menu"
                ) : (
                  <span className="material-symbols-outlined size-6">more_horiz</span>
                )}
              </h2>
              {loading ? <p>Loading...</p> : renderMenuItems(navItems, "main")}
            </div>
            <div className="">
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${!isExpanded && !isHovered
                    ? "lg:justify-center"
                    : "justify-start"
                  }`}
              >
               
              </h2>
              {loading ? null : renderMenuItems(othersItems, "others")}
            </div>
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default AppSidebar;