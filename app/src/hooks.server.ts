export const prerender = true;
export const trailingSlash = 'always';

export const handleHttpError = ({ status, path }: { status: number; path: string }) => {
	// Ignore 404s for favicon and apple-touch-icon
	if (status === 404 && (path.includes('favicon.ico') || path.includes('apple-touch-icon'))) {
		return;
	}
};
