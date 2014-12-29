/*  Logger Utility */
/* This library helps for advanced logging */
/* Configuration can also can be done */

/* Get the Configuration from server configuration */

/** For best practices, we will be using this service, instead of console.log
  * @example logger.log("loglevel", "logcategory", logmsg, [logmsgs][..])
  *  @param {logleve} - all, none, log, debug, info, warn, error
  *  @param {logTypes} - It is set in the config object, for example: mongo, sockets, etc.,
  *  @param {logmsg} - Message to be printed, string, object, array, int
  */

/** Configure this variable if you want to have your custom config */
var logConfig;
var colors = require('colors');

if ((typeof logConfig == 'undefined') || !logConfig.hasOwnProperty('enableLog')) {
	// Set the default log configuration, if it is not available globally
	logConfig = {
		enableLog: true,
		logTypes: {
			//all: true,
			none: false,
			sockets: "debug",
			app: "all"
		}
	};
}

var logger = {};
var _color = "cyan";
var _style = "underline";

logger._levels = ["all", "log", "debug", "info", "warn", "error", "none"];
logger.logTypes = {all: true, none: false};

var getTime = function () {
	var today = new Date();
	var datetime =  today.getDate() + "/" 
					+ (today.getMonth() + 1) + "/"
					+ today.getFullYear() + " "
					+ today.getHours() + ":"
					+ today.getMinutes() + ":"
					+ today.getSeconds(); 
	return datetime;
};

var getFormattedParams = function (args) {
	var params = [], i;
	params.push(colors.green("" + getTime() + " - "));
	params.push(colors[_style][_color]("[" + args[0] + "]"));
	params.push(colors.underline(args[1]));
	if (args && (args.length > 2)) {
		for (i = 2; i < args.length; i++) {
			params.push(args[i]);
		}
	}
	return params;
};
var _shouldLog = function (logger, level, category) {

	if (logger.logTypes["none"]) {
		return false;
	}

	if (logger.logTypes["all"]) {
		return true;
	}

	var askLevel = logger._levels.indexOf(level);
	var minLevel = logger._levels.indexOf(logger.logTypes[category]);

	if (askLevel == -1 || minLevel == -1) {
		return false;
	}

	if (askLevel >= minLevel) {
		return true;
	} else {
		return false;
	}
};

logger.getlogTypes = function() {
	return logger.logTypes;
};

logger.setlogTypes = function(logTypes) {
	logger.logTypes = logTypes;
};

logger.enable = function (enable) {
	logger.logTypes["none"] = ! enable;
};
logger.log = function () {
	if (_shouldLog(logger, arguments[0], arguments[1])) {
		switch (arguments[0]) {
			case 'error':
				_color = "red";
				_style = "bold";
				break;
			case 'warn':
				_color = "yellow";
				_style = "reset";
				break;
			case 'debug':
				console.debug = (!console.debug) ? console.log : console.debug;
				_color = "cyan";
				_style = "reset";
				break;
			case 'info':
				console.info = (!console.info) ? console.log : console.info;
				_color = "magenta";
				_style = "reset";
				break;
			case 'log':
				_color = "grey";
				_style = "bold";
				break;
			default:
				// If the level doesn't match with any of the above level
				// Change it to log level
				_color = "grey";
				_style = "bold";
				arguments[0] = 'log';

		}
		console[arguments[0]].apply(console, getFormattedParams(arguments));
	}
}


logger.enable(logConfig.enableLog); // Don't show logs if configuration prohibits
logger.setlogTypes(logConfig.logTypes);

module.exports = logger;