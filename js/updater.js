/*global $, air, DOMParser */
// Inspired by http://www.insideria.com/2008/03/air-api-performing-updates-in-1.html and modified
var updater = function () {
	var applicationName = "Memory-";
	var applicationVersion = 0;
	var latestVersion = 0;
	var latestVersionCheckUrl = "http://www.robertnyman.com/memory/versioning.xml";
	var updateAvailable = null;
	var updateAvailableDialog = null;
	var releaseNotes = null;
	var releaseNotesText = "";
	var updaterUrl = "http://memory-air.googlecode.com/files/Memory-";
	var stream = null;
	var updateFile = null;
	
	var getApplicationVersion = function () {
		var appXML = air.NativeApplication.nativeApplication.applicationDescriptor;
		var xmlObject = (new DOMParser()).parseFromString(appXML, "text/xml");
		applicationVersion = parseFloat(xmlObject.getElementsByTagName('version')[0].firstChild.nodeValue);
	};
	
	var getLatestVersion = function () {
		$(document).ajax({
			url : "http://www.robertnyman.com/memory/versioning.xml",
			responseType : "xml",
			callback : function (response) {
				var releaseNotesNode = response.getElementsByTagName("releasenotes")[0];
				if (typeof releaseNotesNode === "object" && releaseNotesNode.firstChild) {
					releaseNotesText = releaseNotesNode.firstChild.nodeValue.replace(/BREAK/, "<br>");
				}
				var latestVersionNode = response.getElementsByTagName("latestversion")[0];
				if (typeof latestVersionNode === "object" && latestVersionNode.firstChild) {
					latestVersion = parseFloat(latestVersionNode.firstChild.nodeValue, 10);
					compareVersions();
				}
			}
		});
	};
	
	var compareVersions = function () {
		if (applicationVersion > 0 && latestVersion > 0 && latestVersion > applicationVersion) {
			releaseNotes.replaceContent(releaseNotesText);
			$("#update-application").addEvent("click", function () {
				initUpdateApplication();
			});
			$("#cancel-update").addEvent("click", function () {
				updateAvailable.setStyle("display", "none");
				updateAvailableDialog.setStyle("display", "none");
			});
			updateAvailable.setStyle("display", "block");
			updateAvailableDialog.setStyle("display", "block");
		}
	};
	
	var initUpdateApplication = function () {
		$("#update-buttons").setStyle("display", "none");
		stream = new air.URLStream();
		stream.addEventListener(air.ProgressEvent.PROGRESS, updatingStatus);
		stream.addEventListener(air.Event.COMPLETE, updateApplication);
		stream.load( new air.URLRequest(updaterUrl + latestVersion + ".air"));
	};
	
	var updatingStatus = function (e) {
		var percentage = Math.round((e.bytesLoaded / e.bytesTotal) * 100);
		releaseNotes.replaceContent(percentage + "%");
	};
	
	updateApplication = function () {
		var ba = new air.ByteArray();
		stream.readBytes(ba, 0, stream.bytesAvailable);
		updateFile = air.File.applicationStorageDirectory.resolvePath("Memory.air");
		fileStream = new air.FileStream();
		fileStream.addEventListener( air.Event.CLOSE, installUpdate );
		fileStream.openAsync(updateFile, air.FileMode.WRITE);
		fileStream.writeBytes(ba, 0, ba.length);
	 	fileStream.close();
	};
	
	var installUpdate = function () {
		var updater = new air.Updater();
		updater.update(updateFile, latestVersion.toString());
	};
	
	return {
		init : function () {
			updateAvailableDialog = $$("update-available-dialog");
			if (updateAvailableDialog) {
				updateAvailable = $("#update-available");
				releaseNotes = $("#release-notes");
				getApplicationVersion();
				getLatestVersion();
			}
		}
	};
}();
updater.init();