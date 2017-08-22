var path = require("path");
var childProcess = require("child_process");

var request = require("request");

var nodeModulesPath = "node_modules";
var casperPath = nodeModulesPath + "/casperjs/bin/casperjs";
var scriptPath = "src/casperjs/get-code.js";

const secret = "jGMRgjD0xW1cA954aOovMkg";
const tenant_id = "b0f1cd48-ac42-4ade-b682-2abe03f208e4";
const app_id = "021cbe17-3ba9-4e00-b5ad-e81d1e91e3fe";

// store refresh/access token, don't login everytim
// list and retire separate
// retire by email

//call casper script with callback which takes err, stdout and stderr
module.exports = {
	getCode: (callback) => {
		childProcess.execFile(casperPath, [scriptPath], callback);
	},

	getAccessToken: (code, callback) => {
		request({
			url: `https://login.microsoftonline.com/common/oauth2/v2.0/token`,
			method: "POST",
			headers: {
				"content-type": "application/x-www-form-urlencoded"
			},
			body: `client_id=${app_id}&scope=DeviceManagementManagedDevices.ReadWrite.All%20DeviceManagementManagedDevices.PrivilegedOperations.All&code=${code}&redirect_uri=http%3A%2F%2Flocalhost%3A1234&grant_type=authorization_code&client_secret=${secret}`
		}, callback);
	},

	getDeviceList: (access_token, callback) => {
		request({
			url: "https://graph.microsoft.com/beta/managedDevices/",
			method: "GET",
			headers: {
				"Accept": "application/json",
				"Authorization": `Bearer ${access_token}`
			}
		}, callback);
	},

	retireById: (access_token, device_id) => {
		request({
			url: `https://graph.microsoft.com/beta/managedDevices/${device_id}/retire`,
			method: "POST",
			headers: {
				"content-length": 0,
				"Accept": "application/json",
				"Authorization": `Bearer ${access_token}`
			}
		}, (e,r,b) => {
			console.log(e,r,b);
		});
	}
};

