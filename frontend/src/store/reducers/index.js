// third-party
import { combineReducers } from 'redux';

// project import
import menu from './menu';
import alert from './alert';

// ==============================|| COMBINE REDUCERS ||============================== //

const reducers = combineReducers({ menu, alert });

export default reducers;
