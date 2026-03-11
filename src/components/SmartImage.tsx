import React, { useState, useEffect } from 'react';
import { resolveAssetPath } from '../utils/assets';

interface SmartImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    src: string;
    fallbackExtensions?: string[];
}

export const SmartImage: React.FC<SmartImageProps> = ({
    src: initialSrc,
    fallbackExtensions = ['.jpg', '.png', '.webp', '.jpeg', '.avif', '.JPG', '.PNG', '.WEBP', '.JPEG', '.AVIF'],
    className,
    alt = "",
    ...props
}) => {
    const [currentSrc, setCurrentSrc] = useState(() => initialSrc ? resolveAssetPath(initialSrc) : '');
    const [triedExtensions, setTriedExtensions] = useState<string[]>([]);
    const [isFailed, setIsFailed] = useState(!initialSrc);

    // Reset when initialSrc changes
    useEffect(() => {
        setIsFailed(!initialSrc);
        if (initialSrc) {
            setCurrentSrc(resolveAssetPath(initialSrc));
        }
        setTriedExtensions([]);
    }, [initialSrc]);

    const handleError = () => {
        // Get the base path without extension
        const lastDotIndex = currentSrc.lastIndexOf('.');
        if (lastDotIndex === -1) {
            setIsFailed(true);
            return;
        }

        const base = currentSrc.substring(0, lastDotIndex);
        const currentExt = currentSrc.substring(lastDotIndex);

        // Find next extension that hasn't been tried (must be case-sensitive)
        const nextExt = fallbackExtensions.find(ext =>
            ext !== currentExt && !triedExtensions.includes(ext)
        );

        if (nextExt) {
            setTriedExtensions(prev => [...prev, currentExt]);
            setCurrentSrc(`${base}${nextExt}`);
        } else {
            setIsFailed(true);
        }
    };

    if (isFailed) {
        // Fallback to a placeholder or empty div if all failed
        return (
            <div className={`flex items-center justify-center bg-white/5 ${className}`}>
                <span className="text-[10px] text-white/20 uppercase tracking-widest font-bold">No Image</span>
            </div>
        );
    }

    return (
        <img
            src={currentSrc}
            alt={alt}
            className={className}
            onError={handleError}
            {...props}
        />
    );
};
