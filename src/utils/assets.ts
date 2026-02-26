export const resolveAssetPath = (url: string | undefined): string => {
    if (!url) return '';
    // If it's an absolute path from root, prepend the Vite base URL
    if (url.startsWith('/') && !url.startsWith(import.meta.env.BASE_URL)) {
        const base = import.meta.env.BASE_URL;
        const normalizedUrl = url.substring(1);
        return `${base}${base.endsWith('/') ? '' : '/'}${normalizedUrl}`;
    }
    return url;
};
