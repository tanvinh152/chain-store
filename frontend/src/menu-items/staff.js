// assets
import { ChromeOutlined, QuestionOutlined, CalendarOutlined, TableOutlined } from '@ant-design/icons';
import DescriptionIcon from '@mui/icons-material/Description';

// icons
const icons = {
    ChromeOutlined,
    QuestionOutlined,
    CalendarOutlined,
    TableOutlined,
    DescriptionIcon
};

// ==============================|| MENU ITEMS - SAMPLE PAGE & DOCUMENTATION ||============================== //

const staff = {
    id: 'staff',
    title: 'Hóa đơn',
    type: 'group',
    children: [
        {
            id: 'bill',
            title: 'Quản lý hóa đơn',
            type: 'item',
            url: '/staff/bill',
            icon: icons.DescriptionIcon
        }
    ]
};

export default staff;
