import { type SessionMetadata } from './session-metadata.types';
import 'express-session';

declare module 'express-session' {
	interface SessionData {
		userId?: string;
		createdAt?: string | Date;
		metadata: SessionMetadata;
	}
}
