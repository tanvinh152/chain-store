// assets
import { DashboardOutlined, UserOutlined, ShopOutlined, CalendarOutlined, ShoppingOutlined } from '@ant-design/icons';
import InventoryIcon from '@mui/icons-material/Inventory';
import WarehouseIcon from '@mui/icons-material/Warehouse';
import GridViewIcon from '@mui/icons-material/GridView';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import DescriptionIcon from '@mui/icons-material/Description';
// icons
const icons = {
    DashboardOutlined,
    UserOutlined,
    ShopOutlined,
    InventoryIcon,
    CalendarOutlined,
    WarehouseIcon,
    GridViewIcon,
    ShoppingOutlined,
    LocalShippingIcon,
    DescriptionIcon
};

// ==============================|| MENU ITEMS - DASHBOARD ||============================== //

const admin = {
    id: 'group-admin',
    title: 'Quản lý',
    type: 'group',
    children: [
        {
            id: 'dashboard',
            title: 'Doanh thu',
            type: 'item',
            url: '/manager/dashboard',
            icon: icons.DashboardOutlined,
            breadcrumbs: false
        },
        {
            id: 'staff',
            title: 'Nhân viên',
            type: 'item',
            url: '/manager/staff',
            icon: icons.UserOutlined,
            breadcrumbs: false
        },
        {
            id: 'calendar',
            title: 'Lịch làm việc',
            type: 'item',
            url: '/manager/calendar',
            icon: icons.CalendarOutlined,
            breadcrumbs: false
        },
        {
            id: 'warehouse',
            title: 'Kho',
            type: 'item',
            url: '/manager/warehouse',
            icon: icons.WarehouseIcon,
            breadcrumbs: false
        },
        {
            id: 'category',
            title: 'Loại hàng hóa',
            type: 'item',
            url: '/manager/category',
            icon: icons.GridViewIcon,
            breadcrumbs: false
        },
        {
            id: 'merchandise',
            title: 'Hàng hóa',
            type: 'item',
            url: '/manager/merchandise',
            icon: icons.ShoppingOutlined,
            breadcrumbs: false
        },
        {
            id: 'supplier',
            title: 'Nhà cung cấp',
            type: 'item',
            url: '/manager/supplier',
            icon: icons.LocalShippingIcon,
            breadcrumbs: false
        },
        {
            id: 'bill',
            title: 'Hóa đơn',
            type: 'item',
            url: '/manager/bill',
            icon: icons.DescriptionIcon,
            breadcrumbs: false
        }
    ]
};

export default admin;
