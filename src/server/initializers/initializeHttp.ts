import https from "https";
import http, { Server } from "http";
import fs from "fs";
import path from "path";
import Logger from "../../services/logger";
const logger = new Logger("App", "#3FA34D");
import { connection } from "../../models";
import { port, isProduction, host } from "../../auxiliaries/server";
import { Application } from "express";

export default function initializeHttp(app: Application): Server {
	let server: Server;

	if (isProduction) server = http.createServer(app);
	else {
		// ? https://web.archive.org/web/20120203022122/http://www.silassewell.com/blog/2010/06/03/node-js-https-ssl-server-example/
		// ? https://stackoverflow.com/questions/10175812/how-to-create-a-self-signed-certificate-with-openssl
		/*
			openssl genrsa -out privatekey.pem 1024 
			openssl req -new -key privatekey.pem -out certrequest.csr 
			openssl x509 -req -in certrequest.csr -signkey privatekey.pem -out certificate.pem
		*/
		server = https.createServer(
			{
				key: fs.readFileSync(path.join(__dirname, "../keys/privatekey.pem")),
				cert: fs.readFileSync(path.join(__dirname, "../keys/certificate.pem")),
			},
			app
		);
	}

	server.listen(port, () => logger.info(`App listening on ${host}`));

	async function closeGracefully(signal: NodeJS.Signals): Promise<void> {
		logger.error("Shutting Down", signal);
		await connection.close();
		await server.close();
		logger.error("Shutted Down");
	}
	process.on("SIGINT", closeGracefully);
	return server;
}
