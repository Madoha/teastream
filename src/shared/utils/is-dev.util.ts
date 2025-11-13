import { ConfigService } from '@nestjs/config';
import 'dotenv/config';

export function isDev(configService: ConfigService): boolean {
  return configService.get<string>('NODE_ENV') === 'development';
}

export const IS_DEV_ENV = process.env.NODE_ENV === 'development';