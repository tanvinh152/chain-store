// assets
import { DashboardOutlined, UserOutlined, ShopOutlined, CalendarOutlined, ShoppingOutlined } from '@ant-design/icons';
import InventoryIcon from '@mui/icons-material/Inventory';
import WarehouseIcon from '@mui/icons-material/Warehouse';
import GridViewIcon from '@mui/icons-material/GridView';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import DescriptionIcon from '@mui/icons-material/Description';
import HistoryIcon from '@mui/icons-material/History';

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
    DescriptionIcon,
    HistoryIcon
};

// ==============================|| MENU ITEMS - DASHBOARD ||============================== //

const chainManager = {
    id: 'group-chain-manager',
    title: 'Quản lý',
    type: 'group',
    children: [
        {
            id: 'dashboard',
            title: 'Doanh thu',
            type: 'item',
            url: '/chain-manager/dashboard',
            icon: icons.DashboardOutlined,
            breadcrumbs: false
        },
        {
            id: 'store',
            title: 'Cửa hàng',
            type: 'item',
            url: '/chain-manager/store',
            icon: icons.ShopOutlined,
            breadcrumbs: false
        },
        {
            id: 'staff',
            title: 'Nhân viên',
            type: 'item',
            url: '/chain-manager/staff',
            icon: icons.UserOutlined,
            breadcrumbs: false
        },
        {
            id: 'merchandise',
            title: 'Hàng hóa',
            type: 'item',
            url: '/chain-manager/merchandise',
            icon: icons.ShoppingOutlined,
            breadcrumbs: false
        },
        {
            id: 'category',
            title: 'Loại hàng hóa',
            type: 'item',
            url: '/chain-manager/category',
            icon: icons.GridViewIcon,
            breadcrumbs: false
        },
        {
            id: 'supplier',
            title: 'Nhà cung cấp',
            type: 'item',
            url: '/chain-manager/supplier',
            icon: icons.LocalShippingIcon,
            breadcrumbs: false
        },
        {
            id: 'warehouse',
            title: 'Kho',
            type: 'item',
            url: '/chain-manager/warehouse',
            icon: icons.WarehouseIcon,
            breadcrumbs: false
        },
        {
            id: 'bill',
            title: 'Hóa đơn',
            type: 'item',
            url: '/chain-manager/bill',
            icon: icons.DescriptionIcon,
            breadcrumbs: false
        },
        {
            id: 'history',
            title: 'Theo dõi hoạt động nhân viên',
            type: 'item',
            url: '/chain-manager/history',
            icon: icons.HistoryIcon,
            breadcrumbs: false
        }
    ]
};

export default chainManager;
