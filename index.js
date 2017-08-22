var MS = require("./src/index.js"); 

MS.getCode((err, code, _) => {
	if (err !== undefined) {
		console.log(err);
		//return err;
	}
	MS.getAccessToken(code, (err, _, body) => {
		if (err !== undefined) {
			console.log(err);
			//return err;
		}
		console.log(body)
		const accessToken = JSON.parse(body).access_token;
		
		MS.getDeviceList(accessToken, (err, _, body) => {
			if (err !== undefined) {
				console.log(err);
				//return err;
			}
			console.log(body);
			const devices = JSON.parse(body).value;
			// literally takes the first thing on the list. 
			const deviceId = devices[0].id;
			MS.retireById(accessToken, deviceId);
		});
	});
});

