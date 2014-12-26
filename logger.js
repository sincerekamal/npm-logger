/*  Logger Utility */
/* This library helps for advanced logging */
/* Configuration can also can be done */

/* Get the Configuration from server configuration */

/** For best practices, we will be using this service, instead of console.log
  * @example logger.log("loglevel", "logcategory", logmsg, [logmsgs][..])
  *  @param {loglevels} - all, none, log, debug, info, warning, error
  *   logLevels have this precedence
  *  		log - error, warning, debug, info, log
			debug - error, warning, info, log
			info - error, warning, info
			warning - error, warning
			error - error
  *
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

logger._levels = ["all", "log", "debug", "info", "warning", "error", "none"];
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
		if (arguments[0] == "error") {
			_color = "red";
			_style = "bold";
			logger._error.apply(logger, arguments);
		}
		else if (arguments[0] == "warning") {
			_color = "yellow";
			_style = "reset";
			logger._warn.apply(logger, arguments);
		}
		else if (arguments[0] == "debug") {
			_color = "cyan";
			_style = "reset";
			logger._debug.apply(logger, arguments);
		}
		else if (arguments[0] == "info") {
			_color = "magenta";
			_style = "reset";
			logger._info.apply(logger, arguments);
		}
		else if (arguments[0] == "log") {
			_color = "grey";
			_style = "bold";
			logger._log.apply(logger, arguments);
		}
	}
}

logger._jsonStringify = function(obj) {
		var jsonString = "";
		try {
			jsonString = JSON.stringify(arguments);
		}
		catch(err) {
			jsonString = "Failed to stringify. Debuging in this browser is not recommended";
		}
		return jsonString;
};

logger._error = function () {
	if (console.error['apply']) {
		console.error.apply(console, getFormattedParams(arguments));
	} else {
		console.error(logger._jsonStringify(arguments));
	}
};

logger._log = function () {
	if (console.log['apply']) {
		console.log.apply(console, getFormattedParams(arguments));
	} else {
		console.log(logger._jsonStringify(arguments));
	}
};

logger._warn = function () {
	if (console.warn['apply']) {
		console.warn.apply(console, getFormattedParams(arguments));
	} else {
		console.warn(logger._jsonStringify(arguments));
	}
};

logger._info = function () {
	if (!console.info)
		console.info = console.log;
	if (console.info['apply']) {
		console.info.apply(console, getFormattedParams(arguments));
	} else {
		console.info(logger._jsonStringify(arguments));
	}
};

logger._debug = function () {
	if (!console.debug)
		console.debug = console.log;
	if (console.debug['apply']) {
		console.debug.apply(console, getFormattedParams(arguments));
	} else {
		console.debug(logger._jsonStringify(arguments));
	}
};


logger.enable(logConfig.enableLog); // Don't show logs if configuration prohibits
logger.setlogTypes(logConfig.logTypes);

module.exports = logger;