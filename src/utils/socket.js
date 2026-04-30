import { io } from "socket.io-client";
import { BASE_URL } from "../config/server-config";

let socket;

export const initiateSocketConnection = (token) => {
	socket = io(BASE_URL, {
		auth: {
			token,
		},
	});
	console.log(`Connecting socket...`);
};

export const disconnectSocket = () => {
	console.log("Disconnecting socket...");
	if (socket) socket.disconnect();
};

export const subscribeToGlobalTracking = (cb) => {
	if (!socket) return (true);
	socket.on("delivery-location-changed", (data) => {
		console.log("Global tracking update received!");
		return cb(null, data);
	});
};

export const subscribeToRouteTracking = (routeId, cb) => {
	if (!socket) return;

	// Join the route room
	socket.emit("join-route", routeId);
	console.log(`[Socket] Emitted join-route for: ${routeId}`);

	// Remove any existing listeners to avoid duplicates
	socket.off("update-location");
	socket.off("stop-reached");

	socket.on("update-location", (data) => {
		console.log("[Socket] update-location received on web:", data);
		return cb(null, { type: 'update-location', ...data });
	});

	socket.on("stop-reached", (data) => {
		console.log("[Socket] stop-reached received on web:", data);
		return cb(null, { type: 'stop-reached', ...data });
	});
};

export const getSocket = () => socket;
