// project import
import Loadable from 'components/Loadable';
import MainLayout from 'layout/MainLayout';
import MinimalLayout from 'layout/MinimalLayout';
import { lazy } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import instance from '../../src/utils/AuthHelpers';
import ProtectedRoutes from './ProtectedRoutes';
import PublicRoutes from './PublicRoutes';

// Staff
const ScheduleStaffPage = Loadable(lazy(() => import('pages/extra-pages/schedule-staff/ScheduleStaff')));
const TableSchedulePage = Loadable(lazy(() => import('pages/extra-pages/schedule-staff/TableSchedule')));
const BillStaffPage = Loadable(lazy(() => import('pages/extra-pages/Bill')));

// manager
const ManagerCalendarPage = Loadable(lazy(() => import('pages/extra-pages/Calendar')));
const ManagerStaffPage = Loadable(lazy(() => import('pages/extra-pages/Staff')));
const ManagerDashBoard = Loadable(lazy(() => import('pages/dashboard')));
const ManagerCategoryPage = Loadable(lazy(() => import('pages/extra-pages/Category')));
const ManagerMerchandisePage = Loadable(lazy(() => import('pages/extra-pages/Merchandise')));
const ManagerSupplierPage = Loadable(lazy(() => import('pages/extra-pages/Supplier')));
const ManagerWareHousePage = Loadable(lazy(() => import('pages/extra-pages/Warehouse')));
const ManagerBillPage = Loadable(lazy(() => import('pages/extra-pages/Bill')));

// chain-manager
const ChainManagerStorePage = Loadable(lazy(() => import('pages/extra-pages/Store')));
const ChainManagerDashBoard = Loadable(lazy(() => import('pages/dashboard')));
const ChainManagerWareHousePage = Loadable(lazy(() => import('pages/extra-pages/Warehouse')));
const ChainManagerStaffPage = Loadable(lazy(() => import('pages/extra-pages/Staff')));
const ChainManagerMerchandisePage = Loadable(lazy(() => import('pages/extra-pages/Merchandise')));
const ChainManagerCategoryPage = Loadable(lazy(() => import('pages/extra-pages/Category')));
const ChainManagerSupplierPage = Loadable(lazy(() => import('pages/extra-pages/Supplier')));
const ChainManagerBillPage = Loadable(lazy(() => import('pages/extra-pages/Bill')));
const ChainManagerHistoryPage = Loadable(lazy(() => import('pages/extra-pages/History')));
// render - utilities
const Typography = Loadable(lazy(() => import('pages/components-overview/Typography')));
const Page404 = Loadable(lazy(() => import('pages/extra-pages/page404/Page404')));

const AuthLogin = Loadable(lazy(() => import('pages/authentication/Login')));
const AuthRegister = Loadable(lazy(() => import('pages/authentication/Register')));

// ==============================|| ROUTING RENDER ||============================== //

export default function ThemeRoutes() {
    // return useRoutes([MainRoutes, LoginRoutes]);
    let user = instance.getUserInfo();
    return (
        <Routes>
            <Route>
                <Route element={<MainLayout />}>
                    <Route path="*" element={<Page404 />} />
                    {/* <Route path="/" element={<DashboardDefault />}></Route> */}
                    <Route
                        path="/"
                        element={
                            <Navigate
                                to={user?.role === 0 ? 'schedule/show' : user?.role === 1 ? 'manager/dashboard' : 'chain-manager/dashboard'}
                            />
                        }
                    ></Route>
                    <Route element={<ProtectedRoutes roleRequired={0} />}>
                        <Route path="schedule">
                            <Route path="show" element={<ScheduleStaffPage />}></Route>
                            <Route path="table" element={<TableSchedulePage />}></Route>
                        </Route>
                        <Route path="staff">
                            <Route path="bill">
                                <Route path="" element={<BillStaffPage />}></Route>
                            </Route>
                        </Route>
                        <Route path="typography" element={<Typography />}></Route>
                    </Route>
                    <Route element={<ProtectedRoutes roleRequired={1} />}>
                        <Route path="manager">
                            <Route path="dashboard" element={<ManagerDashBoard />}></Route>
                            <Route path="staff" element={<ManagerStaffPage />}></Route>
                            <Route path="calendar" element={<ManagerCalendarPage />}></Route>
                            <Route path="warehouse" element={<ManagerWareHousePage />}></Route>
                            <Route path="merchandise" element={<ManagerMerchandisePage />}></Route>
                            <Route path="category" element={<ManagerCategoryPage />}></Route>
                            <Route path="supplier" element={<ManagerSupplierPage />}></Route>
                            <Route path="bill">
                                <Route path="" element={<ManagerBillPage />}></Route>
                            </Route>
                        </Route>
                    </Route>
                    <Route element={<ProtectedRoutes roleRequired={2} />}>
                        <Route path="chain-manager">
                            <Route path="dashboard" element={<ChainManagerDashBoard />}></Route>
                            <Route path="store" element={<ChainManagerStorePage />}></Route>
                            <Route path="warehouse" element={<ChainManagerWareHousePage />}></Route>
                            <Route path="merchandise" element={<ChainManagerMerchandisePage />}></Route>
                            <Route path="staff" element={<ChainManagerStaffPage />}></Route>
                            <Route path="bill">
                                <Route path="" element={<ChainManagerBillPage />}></Route>
                            </Route>
                            <Route path="supplier" element={<ChainManagerSupplierPage />}></Route>
                            <Route path="category" element={<ChainManagerCategoryPage />}></Route>
                            <Route path="history" element={<ChainManagerHistoryPage />}></Route>
                        </Route>
                    </Route>
                </Route>
            </Route>
            <Route element={<PublicRoutes />}>
                <Route element={<MinimalLayout />}>
                    <Route path="login" element={<AuthLogin />}></Route>
                    <Route path="register" element={<AuthRegister />}></Route>
                </Route>
            </Route>
        </Routes>
    );
}
