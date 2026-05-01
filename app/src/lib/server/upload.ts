import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

const UPLOAD_DIR = 'static/uploads/avatars';
const MAX_SIZE = 2 * 1024 * 1024; // 2MB
const ALLOWED = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

export async function saveAvatar(file: File): Promise<string> {
	if (!ALLOWED.includes(file.type)) {
		throw new Error('Invalid file type. Only JPEG, PNG, WebP and GIF allowed.');
	}
	if (file.size > MAX_SIZE) {
		throw new Error('File too large. Max 2MB.');
	}

	// Ensure upload dir exists
	if (!existsSync(UPLOAD_DIR)) {
		await mkdir(UPLOAD_DIR, { recursive: true });
	}

	const ext = file.name.split('.').pop() ?? 'jpg';
	const filename = `${crypto.randomUUID()}.${ext}`;
	const filepath = path.join(UPLOAD_DIR, filename);

	const buffer = Buffer.from(await file.arrayBuffer());
	await writeFile(filepath, buffer);

	// Return public URL path
	return `/uploads/avatars/${filename}`;
}

export async function deleteAvatar(imagePath: string | null) {
	if (!imagePath) return;
	try {
		const { unlink } = await import('fs/promises');
		await unlink(`static${imagePath}`);
	} catch {
		// File may not exist — ignore
	}
}
