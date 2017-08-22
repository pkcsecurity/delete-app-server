var path = require("path");
var childProcess = require("child_process");

var request = require("request");

var nodeModulesPath = "node_modules";
var casperPath = nodeModulesPath + "/casperjs/bin/casperjs";
var scriptPath = "src/casperjs/get-code.js";

const secret = "jGMRgjD0xW1cA954aOovMkg";
const tenantId = "b0f1cd48-ac42-4ade-b682-2abe03f208e4";
const appId = "021cbe17-3ba9-4e00-b5ad-e81d1e91e3fe";

// store refresh/access token, don't login everytime
// retire by email

module.exports = {
	//call casper script with callback which takes err, stdout and stderr
	getCode: (callback) => {
		childProcess.execFile(casperPath, [scriptPath], callback);
	},

	// gets access and refresh token using code from admin/service account login
	getAccessToken: (code, callback) => {
		request({
			url: `https://login.microsoftonline.com/common/oauth2/v2.0/token`,
			method: "POST",
			headers: {
				"content-type": "application/x-www-form-urlencoded"
			},
			body: `client_id=${appId}&scope=DeviceManagementManagedDevices.ReadWrite.All%20DeviceManagementManagedDevices.PrivilegedOperations.All&code=${code}&redirect_uri=http%3A%2F%2Flocalhost%3A1234&grant_type=authorization_code&client_secret=${secret}`
		}, callback);
	},

	// gets list of devices in the organization
	getDeviceList: (accessToken, callback) => {
		request({
			url: "https://graph.microsoft.com/beta/managedDevices/",
			method: "GET",
			headers: {
				"Accept": "application/json",
				"Authorization": `Bearer ${accessToken}`
			}
		}, callback);
	},
	
	// retires the device with this id
	retireById: (accessToken, deviceId) => {
		request({
			url: `https://graph.microsoft.com/beta/managedDevices/${deviceId}/retire`,
			method: "POST",
			headers: {
				"content-length": 0,
				"Accept": "application/json",
				"Authorization": `Bearer ${accessToken}`
			}
		}, (e,r,b) => {
			console.log(e,r,b);
		});
	}
};

