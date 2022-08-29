// assets
import { ChromeOutlined, QuestionOutlined, CalendarOutlined, TableOutlined } from '@ant-design/icons';

// icons
const icons = {
    ChromeOutlined,
    QuestionOutlined,
    CalendarOutlined,
    TableOutlined
};

// ==============================|| MENU ITEMS - SAMPLE PAGE & DOCUMENTATION ||============================== //

const schedule = {
    id: 'schedule',
    title: 'Lịch làm việc',
    type: 'group',
    children: [
        {
            id: 'schedule',
            title: 'Xem lịch làm việc',
            type: 'item',
            url: '/schedule/show',
            icon: icons.CalendarOutlined
        },
        {
            id: 'table',
            title: 'Đăng ký lịch làm việc',
            type: 'item',
            url: '/schedule/table',
            icon: icons.TableOutlined
        }
    ]
};

export default schedule;
