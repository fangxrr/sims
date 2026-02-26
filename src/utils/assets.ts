export const resolveAssetPath = (url: string | undefined): string => {
    if (!url) return '';

    // If it's already a full URL or starts with the base URL, return as is
    const base = import.meta.env.BASE_URL || '/';
    if (url.startsWith('http') || url.startsWith(base)) {
        return url;
    }

    // Normalize path: remove leading slash if present
    const normalizedPath = url.startsWith('/') ? url.substring(1) : url;

    // Ensure base ends with slash and append path
    const safeBase = base.endsWith('/') ? base : `${base}/`;
    return `${safeBase}${normalizedPath}`;
};
