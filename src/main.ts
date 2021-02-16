import 'reflect-metadata'

import { argv, prelude, mlog } from './core/libs/utils'
import Server from './Server'
import dotenv from 'dotenv'
import * as Sentry from '@sentry/node'
import * as Tracing from '@sentry/tracing'

const main = async (): Promise<void> => {
	try {
		prelude()

		dotenv.config()

		const port = argv[0] || (process.env.PORT as string)
		const host = argv[1] || (process.env.HOST as string)
		
		Sentry.init({
			dsn: "https://58222b8132464820a76c7d51d3e9b463@o524740.ingest.sentry.io/5637637",
			tracesSampleRate: 1.0,
		});

		const transaction = Sentry.startTransaction({
			op: "Serveur",
			name: "Api",
		});


		const server = new Server(host, parseInt(port, 10))
		await server.run()
	} catch (err) {
		mlog(err.message, 'error')
		process.exit(-1)
	}
}

main()
