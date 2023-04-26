interface Logger {
	/**
	 * The current log level of the logger
	 */
	logLevel: LOG_LEVELS;

	/**
	 * Logs on the trace level
	 */
	trace(...log: any[]): void;

	/**
	 * Logs on the debug level
	 */
	debug(...log: any[]): void;

	/**
	 * Logs on the info level
	 */
	info(...log: any[]): void;

	/**
	 * Logs on the warn level
	 */
	warn(...log: any[]): void;

	/**
	 * Logs on the error level
	 */
	error(...log: any[]): void;

	/**
	 * Logs on any level
	 */
	log(...log: any[]): void;
}

enum LOG_LEVELS {
	TRACE = -2,
	DEBUG = -1,
	INFO = 0,
	WARN = 1,
	ERROR = 2,
}

const log: Logger = {
	logLevel: LOG_LEVELS.DEBUG,

	trace(...log: any[]) {
		if (this.logLevel > LOG_LEVELS.TRACE) {
			return;
		}

		this.log('TRACE:', ...log);
	},

	debug(...log: any[]) {
		if (this.logLevel > LOG_LEVELS.DEBUG) {
			return;
		}

		this.log('DEBUG:', ...log);
	},

	info(...log: any[]) {
		if (this.logLevel > LOG_LEVELS.INFO) {
			return;
		}

		this.log('INFO:', ...log);
	},

	warn(...log: any[]) {
		if (this.logLevel > LOG_LEVELS.WARN) {
			return;
		}

		this.log('WARN:', ...log);
	},

	error(...log: any[]) {
		if (this.logLevel > LOG_LEVELS.ERROR) {
			return;
		}

		this.log('ERROR:', ...log);
	},

	log(...log: any[]) {
		console.log(...log);
	},
};

export { log };
