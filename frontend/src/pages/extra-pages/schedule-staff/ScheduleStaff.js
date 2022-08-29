import React, { useEffect, useState } from 'react';

// project import
import MainCard from 'components/MainCard';

import { ViewState } from '@devexpress/dx-react-scheduler';
import { Appointments, DateNavigator, Scheduler, TodayButton, Toolbar, WeekView } from '@devexpress/dx-react-scheduler-material-ui';

import moment from 'moment';
import instance from 'utils/AuthHelpers';
import axios from '../../../utils/axios.config';

const ScheduleStaff = () => {
    const currentDate = moment().format('YYYY-MM-DD');
    const [schedulerData, setSchedulerData] = useState([]);
    const userInfo = instance.getUserInfo();
    const token = instance.getAccessToken();
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`/calendar?userId=${userInfo._id}`);
                setSchedulerData(response.map((date) => ({ startDate: date.startTime, endDate: date.endTime })));
            } catch (e) {
                console.log(e.message);
            }
        };
        fetchData();
    }, []);
    return (
        <MainCard>
            <Scheduler data={schedulerData}>
                <ViewState defaultCurrentDate={currentDate} />
                <WeekView startDayHour={6} endDayHour={22} cellDuration={60} />
                <Toolbar />
                <DateNavigator />
                <TodayButton />
                <Appointments />
            </Scheduler>
        </MainCard>
    );
};

export default ScheduleStaff;
