export type Tool = 'resize' | 'crop' | 'mirror' | 'rotate' | 'compress' | 'convert' | 'pixelate' | 'blackwhite' | 'watermark' | 'metadata';

export const TOOL_CONTENT: Record<Tool, { title: string, desc: string, benefits: string[] }> = {
  resize: {
    title: 'Resize Your Images Online',
    desc: 'Easily resize your images to any dimension or percentage. Perfect for social media, websites, and email attachments.',
    benefits: ['Maintain aspect ratio', 'Percentage-based scaling', 'High-quality resampling', 'Fast local processing']
  },
  crop: {
    title: 'Crop Images with Precision',
    desc: 'Remove unwanted areas and focus on what matters. Our intuitive cropping tool makes it easy to get the perfect frame.',
    benefits: ['Free-form cropping', 'Aspect ratio presets', 'Real-time preview', 'Lossless quality']
  },
  mirror: {
    title: 'Mirror and Flip Images',
    desc: 'Instantly flip your images horizontally or vertically. Create symmetrical designs or fix orientation issues in seconds.',
    benefits: ['Horizontal flip', 'Vertical flip', 'Instant preview', 'One-click application']
  },
  rotate: {
    title: 'Rotate Images to Any Angle',
    desc: 'Fix tilted photos or rotate images by 90°, 180°, or any custom angle using our precise rotation slider.',
    benefits: ['Slider-based control', 'Enlarge background option', '90°/180° quick buttons', 'No corner clipping']
  },
  compress: {
    title: 'Compress Images Without Quality Loss',
    desc: 'Reduce file size while maintaining visual clarity. Optimize your images for faster web loading and storage efficiency.',
    benefits: ['Target size in KB/MB', 'Quality-based compression', 'Bulk-ready processing', 'Browser-side optimization']
  },
  convert: {
    title: 'Convert Images to Any Format',
    desc: 'Switch between PNG, JPG, WEBP, BMP, GIF, and TIFF instantly. Ensure compatibility across all platforms and devices.',
    benefits: ['Supports 6+ formats', 'WEBP optimization', 'Fast batch conversion', 'Privacy-focused']
  },
  pixelate: {
    title: 'Pixelate Images for Privacy or Style',
    desc: 'Hide sensitive information or add a retro pixel-art effect to your photos with our adjustable pixelation tool.',
    benefits: ['Adjustable pixel size', 'Privacy protection', 'Creative effects', 'Real-time adjustment']
  },
  blackwhite: {
    title: 'Black and White Photo Filter',
    desc: 'Convert your color photos into stunning monochrome masterpieces. Choose between classic grayscale or high-contrast binary.',
    benefits: ['Grayscale intensity slider', 'Binary threshold control', 'Monochrome presets', 'Professional results']
  },
  watermark: {
    title: 'Add Watermark to Images',
    desc: 'Protect your creative work with custom text watermarks. Adjust opacity, size, and position for the perfect look.',
    benefits: ['Custom text overlay', 'Adjustable opacity', 'Flexible positioning', 'Real-time preview']
  },
  metadata: {
    title: 'Clean Image Metadata',
    desc: 'Remove hidden EXIF data like GPS coordinates and camera settings to protect your privacy before sharing.',
    benefits: ['Strip GPS data', 'Remove camera info', 'Privacy protection', 'One-click cleaning']
  }
};
