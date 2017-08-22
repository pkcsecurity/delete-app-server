const tenant_id = "b0f1cd48-ac42-4ade-b682-2abe03f208e4";
const app_id = "021cbe17-3ba9-4e00-b5ad-e81d1e91e3fe";

var start = "https://login.microsoftonline.com/" + tenant_id + "/oauth2/v2.0/authorize?" +
						 "client_id=" + app_id + 
						 "&response_type=code"+
						 "&redirect_uri=http%3A%2F%2Flocalhost%3A1234"+
						 "&response_mode=query"+
						 "&scope=offline_access%20DeviceManagementManagedDevices.ReadWrite.All%20DeviceManagementManagedDevices.PrivilegedOperations.All&state=12345";

var casper = require("casper").create({
	//logLevel: "debug",
	//verbose: true,
	pageSettings: {
		loadImages: false,
		loadPlugins: false
	},
	// on the return url prints only the code
	onResourceRequested: function(c, r) {
		if (r.url.slice(0,21) === "http://localhost:1234")
			console.log(r.url.slice(28).split("&")[0]);
	}
});

casper.options.viewportSize = {width: 1024, height: 720};

casper.start(start);

// This relies on the specific login from the above, may end up going away in which case you'll have to refigure this out.
casper.then(function(){
	this.evaluate(function() {
		document.getElementById("cred_userid_inputtext").value = "ajoo@pkcsecurity.onmicrosoft.com";
		document.getElementById("cred_password_inputtext").value = "ZtCNoaupUpVqEofoYaekFvh7";
		document.getElementById("credentials").submit();
	});
});

casper.then(function(){
	this.wait(5000);
	casper.capture("example.png");
});

casper.run();
