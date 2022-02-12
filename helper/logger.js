const { createLogger, transports, format } = require("winston");
require('winston-mongodb');
const logger = createLogger({
	transports: [
		new transports.File({
			filename: "info.log",
			level: "info",
			format: format.combine(format.timestamp(), format.json()),
		}),
		new transports.MongoDB({
			level: "error",
			db: `mongodb+srv://admin:1234@changelog.vdeda.mongodb.net/changes?retryWrites=true&w=majority`,
			options: {
				useUnifiedTopology: true
			},
			collection: "log",
			format: format.combine(format.timestamp(), format.json())
		})
	]
});

module.exports = logger;