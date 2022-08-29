// project import
import pages from './pages';
import dashboard from './dashboard';
import utilities from './utilities';
import schedule from './schedule';
import instance from 'utils/AuthHelpers';

// ==============================|| MENU ITEMS ||============================== //

let menuItems = {
    items: [dashboard, schedule, utilities]
};

export default menuItems;
