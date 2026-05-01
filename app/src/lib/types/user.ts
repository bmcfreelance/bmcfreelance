export type UserRole = 'admin' | 'employee' | 'client';
export type UserStatus = 'active' | 'inactive' | 'pending';

export type User = {
	id: string;
	name: string;
	email: string;
	emailVerified: boolean;
	image: string | null; // ← "image" not "avatar" — matches your schema
	phone: string | null;
	address: string | null;
	role: UserRole;
	status: UserStatus;
	createdAt: Date;
	updatedAt: Date;
};
