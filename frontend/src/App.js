// project import
import Routes from 'routes';
import ThemeCustomization from 'themes';
import ScrollTop from 'components/ScrollTop';
import SessionTimeout from 'components/SessionTimeout';
import instance from 'utils/AuthHelpers';
import moment from 'moment';
import 'moment/locale/vi';
// ==============================|| APP - THEME, ROUTER, LOCAL  ||============================== //
const token = instance.getAccessToken();
moment.locale();
const App = () => (
    <ThemeCustomization>
        <ScrollTop>
            <Routes />
        </ScrollTop>
        {token && <SessionTimeout />}
    </ThemeCustomization>
);

export default App;
