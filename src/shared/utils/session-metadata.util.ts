import type { Request } from 'express'
import { lookup } from 'geoip-lite'
import type { SessionMetadata } from '../types/session-metadata.types'
import DeviceDetector from 'device-detector-js'
import { IS_DEV_ENV } from './is-dev.util'

export function getSessionMetadata(
	req: Request,
	userAgent: string,
): SessionMetadata {
	const rawIp = IS_DEV_ENV
		? '5.34.109.157'
		: Array.isArray(req.headers['cf-connecting-ip'])
			? req.headers['cf-connecting-ip'][0]
			: req.headers['cf-connecting-ip'] ||
				(typeof req.headers['x-forwarded-for'] === 'string'
					? req.headers['x-forwarded-for'].split(',')[0]
					: req.ip)

  const ip = rawIp ? rawIp : '5.34.109.157';

  const location = lookup(ip);

  const device = new DeviceDetector().parse(userAgent);

	return {
    location: {
      country: location?.country || 'unknown',
      city: location?.city || 'unknown',
      latitude: location?.ll[0] || 0,
      longitude: location?.ll[1] || 0,
    },
    device: {
      browser: device?.client?.name || 'unknown',
      os: device?.os?.name || 'unknown',
      type: device?.device?.type || 'unknown'
    },
    ip
  }
}
