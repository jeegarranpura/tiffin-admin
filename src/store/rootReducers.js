import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "../features/AuthContainer/authSlice";
import planReducer from "../features/PlanContainer/PlanSlice";
import customerReducer from "../features/CustomerContainer/CustomerSlice";
import routeReducer from "../features/RouteContainer/RouteSlice";
import packingReducer from "../features/PackingContainer/PackingSlice";
import subscribeReducer from "../features/SubscribeContainer/SubscribeSlice";
import dashboardReducer from "../features/DashboardContainer/DashboardSlice";
import reportReducer from "../features/ReportContainer/ReportSlice";
import userReducer from "../features/UserContainer/UserSlice";

const rootReducer = combineReducers({
    auth: authReducer,
    plan: planReducer,
    customer: customerReducer,
    route: routeReducer,
    packing: packingReducer,
    subscribe: subscribeReducer,
    dashboard: dashboardReducer,
    report: reportReducer,
    user: userReducer,
})

export default rootReducer