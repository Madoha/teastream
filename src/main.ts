import { ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import cookieParser from 'cookie-parser'
import session from 'express-session'

import { CoreModule } from './core/core.module'
import { RedisService } from './core/redis/redis.service'
import { StringValue, ms } from './shared/utils/ms.util'
import { parseBoolean } from './shared/utils/parse-boolean.util'
import { RedisStore } from 'connect-redis'

async function bootstrap() {
	const app = await NestFactory.create(CoreModule)

	const config = app.get(ConfigService)
	const redis = app.get(RedisService)

	app.use(cookieParser(config.getOrThrow<string>('COOKIES_SECRET')));

	app.useGlobalPipes(
		new ValidationPipe({
			transform: true,
		}),
	)

	app.use(
		// eslint-disable-next-line @typescript-eslint/no-unsafe-call
		session({
			secret: config.getOrThrow<string>('SESSION_SECRET'),
			name: config.getOrThrow<string>('SESSION_NAME'),
			resave: false,
			saveUninitialized: false,
			cookie: {
				domain: config.getOrThrow<string>('SESSION_COOKIE_DOMAIN'),
				maxAge: ms(config.getOrThrow<StringValue>('SESSION_COOKIE_MAX_AGE')),
				secure: config.getOrThrow<boolean>('SESSION_COOKIE_SECURE'),
				httpOnly: parseBoolean(
					config.getOrThrow<string>('SESSION_COOKIE_HTTP_ONLY'),
				),
				sameSite: config.getOrThrow<'lax' | 'strict' | 'none'>(
					'SESSION_COOKIE_SAME_SITE',
				),
			},
			store: new RedisStore({
				client: redis,
				prefix: config.getOrThrow<string>('SESSION_REDIS_PREFIX'),
			}),
		}),
	)

	app.enableCors({
		origin: config.getOrThrow<string>('ALLOWED_ORIGINS').split(','),
		credentials: true,
		exposedHeaders: ['set-Cookie'],
	})

	const port = config.getOrThrow<number>('APPLICATION_PORT')
	await app.listen(port)
}
void bootstrap()
