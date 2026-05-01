// src/app.d.ts
declare global {
	namespace App {
		interface Locals {
			user?: {
				id: string;
				name: string;
				email: string;
				emailVerified: boolean;
				image: string | null;
				role: 'admin' | 'employee' | 'client';
				status: 'active' | 'inactive' | 'pending';
				phone: string | null;
				address: string | null;
				createdAt: Date;
				updatedAt: Date;
			};
			session?: {
				id: string;
				expiresAt: Date;
				token: string;
				userId: string;
				ipAddress: string | null;
				userAgent: string | null;
				createdAt: Date;
				updatedAt: Date;
			};
		}
	}
}

export {};
