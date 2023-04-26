import winston from 'winston';

const winstonLogger = winston.createLogger({
	level: 'debug',
	format: winston.format.timestamp(),
	defaultMeta: { service: 'pizza-service' },
	transports: [
		new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
		new winston.transports.File({ filename: 'logs/combined.log' }),
	],
});

export { winstonLogger };
