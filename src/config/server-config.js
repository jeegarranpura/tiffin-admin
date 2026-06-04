export const BASE_URL = import.meta.env.VITE_API_URL;

export const AUTH_REGISTER = `${BASE_URL}/api/auth/register`;
export const AUTH_LOGIN = `${BASE_URL}/api/auth/login`;
export const AUTH_FORGOT_PASSWORD = `${BASE_URL}/api/auth/forgot-password`;
export const AUTH_RESET_PASSWORD = `${BASE_URL}/api/auth/reset-password`;

// Plans
export const CREATE_PLAN = `${BASE_URL}/api/plans`;
export const GET_ALL_PLANS = `${BASE_URL}/api/plans`;
export const GET_PLAN_BY_ID = `${BASE_URL}/api/plans`;
export const UPDATE_PLAN = `${BASE_URL}/api/plans`;
export const DELETE_PLAN = `${BASE_URL}/api/plans`;

// customer 
export const CREATE_CUSTOMER = `${BASE_URL}/api/customers`;
export const GET_ALL_CUSTOMERS = `${BASE_URL}/api/customers`;
export const UPDATE_CUSTOMER = `${BASE_URL}/api/customers`;

// routes
export const CREATE_ROUTE = `${BASE_URL}/api/routes`;
export const GET_ALL_ROUTES = `${BASE_URL}/api/routes`;
export const UPDATE_ROUTE = `${BASE_URL}/api/routes`;
export const DELETE_ROUTE = `${BASE_URL}/api/routes`;
export const ASSIG_CUSTOMER = `${BASE_URL}/api/routes`;  // `${BASE_URL}/api/routes/:route_ID/assign-customers`;
export const GET_ROUTE_MAP_DATA = `${BASE_URL}/api/routes/`;  // {{baseUrl}}/api/routes/{{ROUTE_ID}}/map
export const UPDATE_ROUTE_STATUS = `${BASE_URL}/api/routes/update-route-status`;  // {{baseUrl}}/api/routes/{{ROUTE_ID}}/map

// packing
export const GET_ROUTE_ORDER_LST = `${BASE_URL}/api/packing/route-list/`  // `${BASE_URL}/api/packing/route-list/{ROUTE_id}`
export const UPDATE_ORDER_PACKED = `${BASE_URL}/api/packing/mark-packed/`  // `${BASE_URL}/api/packing/mark-packed/{ORDER_ID}`  
export const GENERATE_ORDER_NOW = `${BASE_URL}/api/packing/generate-daily-orders`
export const CANCEL_ORDER = `${BASE_URL}/api/packing/cancel-order/`  // `${BASE_URL}/api/packing/cancel-order/{ORDER_ID}`

// Delivery
export const START_DELIVERY = `${BASE_URL}/api/delivery/start/` // `${BASE_URL}/api/delivery/start/{ROUTE_ID}`
export const END_DELIVERY = `${BASE_URL}/api/delivery/complete/` // `${BASE_URL}/api/delivery/end/{ORDER_ID}`
export const AGENT_LOCATION = `${BASE_URL}/api/delivery/location/` // `${BASE_URL}/api/delivery/location/{ROUTE_ID}`

// Order
export const LIST_OF_ORDERS = `${BASE_URL}/api/orders`  // ${BASE_URL}/api/orders?date=2026-03-18&status=pending&mealTime=Lunch&customerId={{CUSTOMER_ID}}
export const ORDER_DETAILS = `${BASE_URL}/api/orders` // ${BASE_URL}/api/orders/{{ORDER_ID}}
export const ORDER_UPDATE_STATUS = `${BASE_URL}/api/orders/update-status` // `${BASE_URL}/api/orders/update-status/{ORDER_ID}`


// payment
export const CREATE_PAYMENT = `${BASE_URL}/api/payments`
export const ALL_PAYMENT = `${BASE_URL}/api/payments`
export const GET_CUSTOMER_PAYMENT = `${BASE_URL}/api/payments/customer/` // `${BASE_URL}/api/payments/customer/{CUSTOMER_ID}`
export const UPDATE_PAYMENT = `${BASE_URL}/api/payments/` // `${BASE_URL}/api/payments/{PAYMENT_ID}/status`

// report
export const ORDER_REPORT = `${BASE_URL}/api/reports/daily-delivery`;
export const CUSTOMER_REPORT = `${BASE_URL}/api/reports/customer-stats`;
export const PENDING_DELIVERIES = `${BASE_URL}/api/reports/pending-deliveries`;
export const EXPIRING_SUBSCRIPTIONS = `${BASE_URL}/api/reports/expiring-subscriptions`;
export const DASHBOARD_OVERVIEW = `${BASE_URL}/api/dashboard/overview`;

// New Reports
export const ACTIVE_CUSTOMERS_REPORT = `${BASE_URL}/api/reports/active-customers`;
export const NON_RENEWED_REPORT = `${BASE_URL}/api/reports/non-renewed-customers`;
export const UPCOMING_PAYMENTS_REPORT = `${BASE_URL}/api/reports/upcoming-payments`;
export const SEND_REMINDERS = `${BASE_URL}/api/reminders/send-upcoming-reminders`;



export const DELIVERY_AGENT_LIST = `${BASE_URL}/api/users/delivery-agents`;

// User Management
export const GET_ALL_USERS = `${BASE_URL}/api/users`;
export const CREATE_USER = `${BASE_URL}/api/users`;
export const UPDATE_USER = `${BASE_URL}/api/users/`; // append ID
export const DELETE_USER = `${BASE_URL}/api/users/`; // append ID

// Subscriptions
export const CREATE_SUBSCRIPTION = `${BASE_URL}/api/subscriptions`;
export const GET_ALL_SUBSCRIPTIONS = `${BASE_URL}/api/subscriptions`;
export const GET_CUSTOMER_SUBSCRIPTIONS = `${BASE_URL}/api/subscriptions/customer/`; // `${BASE_URL}/api/subscriptions/customer/{CUSTOMER_ID}`
export const UPDATE_SUBSCRIPTION = `${BASE_URL}/api/subscriptions/`; // `${BASE_URL}/api/subscriptions/{SUBSCRIPTION_ID}`
export const DELETE_SUBSCRIPTION = `${BASE_URL}/api/subscriptions/`; // `${BASE_URL}/api/subscriptions/{SUBSCRIPTION_ID}`
export const ADD_SUBSCRIPTION_SKIP = `${BASE_URL}/api/subscriptions/skip`;
export const GET_SUBSCRIPTION_SKIPS = `${BASE_URL}/api/subscriptions/skips`;

