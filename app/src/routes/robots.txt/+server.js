// src/routes/robots.txt/+server.js
export function GET() {
	return new Response(`User-agent: *\nAllow: /\nSitemap: https://mysite.com/sitemap.xml`, {
		headers: { 'Content-Type': 'text/plain' }
	});
}
