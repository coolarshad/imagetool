"""
Tool-specific SEO / AEO content for the ten ToolPages.

Applied to existing pages by `python manage.py update_tool_content`.
Every claim here must match what static/js/editor.js actually does —
update both together.
"""

PRIVACY_FAQ = (
    "Are my images uploaded to a server?",
    "<p>No. ImageToolLab loads your file into your browser's memory and edits it with the "
    "HTML5 Canvas API on your own device. Nothing is sent to our server, so there is no "
    "upload wait and no copy of your photo stored anywhere. You can even disconnect from "
    "the internet after the page loads and the tool keeps working.</p>",
)


def step(n, title, description):
    return ("step", {"step_number": f"{n:02d}", "title": title, "description": description})


def faq(question, answer):
    return ("faq", {"question": question, "answer": answer})


def rich(html):
    return ("rich_text", html)


def tip(title, html):
    return ("callout", {"type": "tip", "title": title, "text": html})


def table(caption, headers, rows):
    return ("table", {"caption": caption, "headers": headers, "rows": rows})


# Every URL below was checked to resolve (HTTP 200) on 2026-11-23.
SOURCE_LINKS = {
    "mdn_formats": ("MDN: Image file type and format guide", "https://developer.mozilla.org/en-US/docs/Web/Media/Guides/Formats/Image_types"),
    "mdn_toblob": ("MDN: HTMLCanvasElement.toBlob()", "https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toBlob"),
    "mdn_smoothing": ("MDN: imageSmoothingQuality", "https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/imageSmoothingQuality"),
    "mdn_rotate": ("MDN: CanvasRenderingContext2D.rotate()", "https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/rotate"),
    "mdn_scale": ("MDN: CanvasRenderingContext2D.scale()", "https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/scale"),
    "wiki_mirror": ("Wikipedia: Mirror image", "https://en.wikipedia.org/wiki/Mirror_image"),
    "mdn_imagedata": ("MDN: getImageData()", "https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/getImageData"),
    "webdev_format": ("web.dev: Choose the right image format", "https://web.dev/articles/choose-the-right-image-format"),
    "webdev_webp": ("web.dev: Use WebP images", "https://web.dev/articles/serve-images-webp"),
    "webdev_compress": ("web.dev: Use Imagemin to compress images", "https://web.dev/articles/use-imagemin-to-compress-images"),
    "webp": ("Google for Developers: WebP", "https://developers.google.com/speed/webp"),
    "webp_study": ("Google: WebP compression study", "https://developers.google.com/speed/webp/docs/webp_study"),
    "png_spec": ("W3C: PNG specification", "https://www.w3.org/TR/png-3/"),
    "apple_heif": ("Apple Support: Using HEIF or HEVC media on Apple devices", "https://support.apple.com/en-us/116944"),
    "youtube_thumb": ("YouTube Help: Add custom thumbnails", "https://support.google.com/youtube/answer/72431"),
    "ogp": ("The Open Graph protocol", "https://ogp.me/"),
    "wiki_exif": ("Wikipedia: Exif", "https://en.wikipedia.org/wiki/Exif"),
    "wiki_scaling": ("Wikipedia: Image scaling", "https://en.wikipedia.org/wiki/Image_scaling"),
    "wiki_crop": ("Wikipedia: Cropping (image)", "https://en.wikipedia.org/wiki/Cropping_(image)"),
    "wiki_thirds": ("Wikipedia: Rule of thirds", "https://en.wikipedia.org/wiki/Rule_of_thirds"),
    "wiki_compression": ("Wikipedia: Image compression", "https://en.wikipedia.org/wiki/Image_compression"),
    "wiki_pixelization": ("Wikipedia: Pixelization", "https://en.wikipedia.org/wiki/Pixelization"),
    "wiki_watermark": ("Wikipedia: Digital watermarking", "https://en.wikipedia.org/wiki/Digital_watermarking"),
    "wiki_grayscale": ("Wikipedia: Grayscale", "https://en.wikipedia.org/wiki/Grayscale"),
    "copyright_faq": ("U.S. Copyright Office: Copyright FAQ", "https://www.copyright.gov/help/faq/faq-general.html"),
    "eff_ssd": ("EFF: Surveillance Self-Defense", "https://ssd.eff.org/"),
}


def sources(*keys):
    items = "".join(
        f'<li><a href="{SOURCE_LINKS[k][1]}" rel="noopener" target="_blank">{SOURCE_LINKS[k][0]}</a></li>'
        for k in keys
    )
    return rich(f"<h2>Sources and further reading</h2><ul>{items}</ul>")


TOOL_CONTENT = {
    # ------------------------------------------------------------------ resize
    "resize": {
        "search_description": "Resize images to exact pixel sizes or by percentage (10-300%) with aspect ratio lock. Free, no upload needed - your photo never leaves your browser.",
        "steps": [
            step(1, "Open your image", "Drop a JPG, PNG or WebP file onto the page or click to browse. It opens instantly because nothing is uploaded."),
            step(2, "Set the new size", "Type a width or height in pixels, or drag the scale slider between 10% and 300%. Keep \"Lock Aspect Ratio\" on to avoid stretching."),
            step(3, "Apply and check", "Click Apply Resize to see the result. Use Undo if the size isn't right - the editor keeps your last 20 steps."),
            step(4, "Download", "Save the resized image to your device in its original format."),
        ],
        "faqs": [
            faq("How do I resize an image without stretching it?",
                "<p>Keep <b>Lock Aspect Ratio</b> switched on, then change only the width or the height. "
                "The other side is calculated automatically from the original proportions, so circles stay "
                "round and faces don't look squashed.</p>"),
            faq("What size should an Instagram post be?",
                "<p>Use 1080 x 1350 px for a portrait (4:5) post, 1080 x 1080 px for a square post and "
                "1080 x 1920 px for Stories and Reels. Crop to the right shape first, then resize the width to 1080 px.</p>"),
            faq("Does making an image bigger reduce quality?",
                "<p>Yes, enlarging always adds pixels that weren't in the original, so the result looks softer. "
                "The resizer uses the browser's high-quality smoothing to keep it as clean as possible, but for "
                "the sharpest result scale up no more than about 150-200%.</p>"),
            faq("Can I resize by percentage instead of pixels?",
                "<p>Yes. Drag the <b>Scale Percentage</b> slider anywhere from 10% to 300%. 50% halves both the width "
                "and the height, which cuts the pixel count - and usually the file size - to roughly a quarter.</p>"),
            faq("Will resizing reduce the file size?",
                "<p>Shrinking the dimensions is the most effective way to cut file size, because fewer pixels means less "
                "data. If you need an even smaller file, run the result through the "
                "<a href=\"/compress-image/\">Compress Image</a> tool afterwards.</p>"),
            faq(*PRIVACY_FAQ),
        ],
        "editorial": [
            rich(
                "<h2>What is image resizing?</h2>"
                "<p>Image resizing changes the pixel dimensions of a picture - for example from 4000 x 3000 px "
                "straight off a phone camera to 1200 x 900 px for a website. Shrinking an image removes pixels and "
                "makes the file lighter; enlarging it invents new pixels by interpolating between the existing ones.</p>"
                "<h2>Which size should I use?</h2>"
                "<p>Common target sizes for popular uses are in the table below.</p>"
            ),
            table(
                "Recommended image sizes by use",
                ["Use", "Size (px)", "Aspect ratio"],
                [
                    ["Instagram portrait post", "1080 x 1350", "4:5"],
                    ["Instagram square post", "1080 x 1080", "1:1"],
                    ["Instagram / TikTok Story or Reel", "1080 x 1920", "9:16"],
                    ["YouTube thumbnail", "1280 x 720", "16:9"],
                    ["Link preview (Open Graph)", "1200 x 630", "1.91:1"],
                    ["Full-width website hero", "1920 wide", "varies"],
                    ["Blog body image or email", "800-1200 wide", "varies"],
                ],
            ),
            rich(
                "<p>If the target has a different shape from your photo, <a href=\"/crop-image/\">crop it</a> to that "
                "shape first and then resize, otherwise you'll get the right width but the wrong height.</p>"
                "<h2>How does this resizer keep images sharp?</h2>"
                "<p>The image is redrawn on an HTML5 canvas with the browser's high-quality smoothing turned on, which "
                "blends neighbouring pixels instead of simply dropping them. For big reductions this avoids the jagged "
                "edges and moire patterns you get from naive nearest-neighbour scaling.</p>"
            ),
            tip("Pro tip", "<p>Resize <b>before</b> you compress. Halving the dimensions usually saves more bytes than any quality setting, and the image stays sharper.</p>"),
            sources("wiki_scaling", "mdn_smoothing", "youtube_thumb", "ogp"),
        ],
    },

    # -------------------------------------------------------------------- crop
    "crop": {
        "search_description": "Crop photos online by dragging a crop box over the area you want to keep. Free, fast and private - images are cropped in your browser, never uploaded.",
        "steps": [
            step(1, "Open your photo", "Drop an image onto the page or browse for a file. It opens straight away in the editor."),
            step(2, "Position the crop box", "Drag the box to move it and drag its edges or corners to resize it. Everything outside the box will be removed."),
            step(3, "Apply the crop", "Click Apply Crop. The crop is made at full resolution, not at the size you see on screen."),
            step(4, "Download", "Save the cropped image, or keep editing - resize it, add a watermark or strip its metadata."),
        ],
        "faqs": [
            faq("Does cropping reduce image quality?",
                "<p>No. Cropping only removes pixels from the edges; the pixels you keep are copied exactly. The crop "
                "is calculated against the original full-resolution image, so zooming the preview doesn't affect the result.</p>"),
            faq("How do I crop a photo for Instagram?",
                "<p>Shape the crop box so it's slightly taller than wide for a 4:5 portrait post, or square for a 1:1 post. "
                "Then use <a href=\"/resize-image/\">Resize Image</a> to set the width to 1080 px.</p>"),
            faq("What is the difference between cropping and resizing?",
                "<p>Cropping cuts away part of the picture and changes what's in the frame. Resizing keeps the whole "
                "picture but changes how many pixels it has. To fit a specific size like 1280 x 720, crop to the shape first, then resize.</p>"),
            faq("Can I crop on my phone?",
                "<p>Yes. The crop box supports touch, so you can drag and resize it with your finger on iPhone and "
                "Android browsers. Nothing needs to be installed.</p>"),
            faq("Can I undo a crop?",
                "<p>Yes. Use the Undo button to step back. The editor keeps up to 20 previous versions while the page is open.</p>"),
            faq(*PRIVACY_FAQ),
        ],
        "editorial": [
            rich(
                "<h2>What is cropping?</h2>"
                "<p>Cropping removes the outer parts of an image to improve the framing, focus attention on a subject or "
                "change the shape of the picture. It's the quickest way to cut out a distracting background, "
                "straighten up a composition or turn a landscape photo into a square profile picture.</p>"
                "<h2>When should you crop an image?</h2>"
                "<ul>"
                "<li><b>Profile pictures:</b> crop tightly around a face so it reads well at small sizes.</li>"
                "<li><b>Social posts:</b> most feeds favour square (1:1) or portrait (4:5) shapes over wide landscape photos.</li>"
                "<li><b>Screenshots:</b> remove browser bars, notifications and anything private before sharing.</li>"
                "<li><b>Product photos:</b> give every product image the same framing so a catalogue looks consistent.</li>"
                "</ul>"
                "<h2>Composition tips for a better crop</h2>"
                "<p>Place your subject roughly one third of the way in from an edge rather than dead centre (the "
                "rule of thirds). Leave a little space in the direction a person is looking or moving, and avoid "
                "cutting through joints such as wrists, knees or ankles.</p>"
            ),
            table(
                "Common crop shapes and where they're used",
                ["Aspect ratio", "Shape", "Typical use"],
                [
                    ["1:1", "Square", "Profile pictures, Instagram square posts, product thumbnails"],
                    ["4:5", "Tall portrait", "Instagram and Facebook feed posts"],
                    ["9:16", "Full-screen vertical", "Stories, Reels, TikTok, phone wallpapers"],
                    ["16:9", "Widescreen", "YouTube thumbnails, presentations, desktop wallpapers"],
                    ["3:2", "Classic photo", "Prints (6 x 4 in), most DSLR and mirrorless photos"],
                    ["4:3", "Standard", "Many phone cameras, tablets, older displays"],
                ],
            ),
            tip("Pro tip", "<p>Crop first, then resize. If you resize first you throw away pixels you might want to keep after cropping.</p>"),
            sources("wiki_crop", "wiki_thirds", "youtube_thumb"),
        ],
    },

    # ---------------------------------------------------------------- compress
    "compress": {
        "search_description": "Compress JPG and WebP images with a quality slider and see the new file size instantly. Free and private - photos are compressed in your browser, not uploaded.",
        "steps": [
            step(1, "Open your image", "Drop a JPG, PNG or WebP file onto the page. It is read locally - no upload and no wait."),
            step(2, "Choose a quality level", "Drag the Quality slider (5-100%). 80% is the default and a good balance; 60-75% gives much smaller files."),
            step(3, "Compress and check the size", "Click Apply. The editor reports the new file size in KB so you can compare it with your target."),
            step(4, "Adjust or download", "Not small enough? Undo and try a lower quality, or resize the image first. Then download."),
        ],
        "faqs": [
            faq("What quality setting should I use for JPG?",
                "<p>For photos, 70-85% usually looks identical to the original on screen while cutting the file size "
                "substantially. Below about 60% you may start to see blocky artifacts around edges and in smooth skies.</p>"),
            faq("How do I compress an image to under 100 KB?",
                "<p>First <a href=\"/resize-image/\">resize</a> it - a 1200 px wide photo is far easier to get under 100 KB "
                "than a 4000 px one. Then compress at around 70%, check the reported size, and undo and lower the quality "
                "if it's still too big.</p>"),
            faq("Why did my PNG come out as WebP?",
                "<p>PNG is a lossless format with no quality setting, so a quality slider can't make it smaller. When "
                "you compress a PNG, the tool exports it as WebP, which supports quality-based compression and "
                "transparency and is usually far smaller.</p>"),
            faq("What is the difference between lossy and lossless compression?",
                "<p>Lossy compression (JPG, WebP) permanently discards detail the eye is unlikely to notice, giving "
                "very small files. Lossless compression (PNG) keeps every pixel exactly, so files stay larger. Photos suit "
                "lossy formats; logos, screenshots and text suit lossless ones.</p>"),
            faq("Can I compress the same image twice?",
                "<p>You can, but each lossy pass loses a little more detail. It's better to undo and compress the "
                "original once at a lower quality than to compress an already-compressed copy again.</p>"),
            faq(*PRIVACY_FAQ),
        ],
        "editorial": [
            rich(
                "<h2>What is image compression?</h2>"
                "<p>Image compression reduces a file's size in kilobytes without changing its pixel dimensions. Lossy "
                "formats such as JPG and WebP do this by simplifying fine detail and colour information the eye barely "
                "notices; the quality setting controls how aggressive that simplification is.</p>"
                "<h2>Why compress images?</h2>"
                "<ul>"
                "<li><b>Faster websites:</b> images are usually the heaviest part of a web page, and smaller files improve load time and Core Web Vitals.</li>"
                "<li><b>Upload limits:</b> many forms, job portals and government sites reject files over 100 KB, 200 KB or 1 MB.</li>"
                "<li><b>Email and messaging:</b> smaller attachments send faster and don't fill up mailboxes.</li>"
                "<li><b>Storage:</b> compressed photo libraries take a fraction of the space.</li>"
                "</ul>"
                "<h2>How much smaller will my image get?</h2>"
                "<p>It depends on the content. A busy photo with lots of texture compresses less than a simple image "
                "with large flat areas. As a rough guide, moving a phone photo from maximum quality to 75-80% often "
                "cuts its size by half or more with no visible difference at normal viewing size. The editor shows the "
                "exact output size after each compression, so you can experiment safely and undo.</p>"
                "<h2>Which format compresses best?</h2>"
                "<p>WebP generally produces smaller files than JPG at the same visual quality - Google's own "
                "compression study reports noticeably smaller files - and also supports transparency. JPG remains "
                "the most widely compatible choice for photos. Use the "
                "<a href=\"/convert-image/\">Convert Image</a> tool if you need to switch formats.</p>"
            ),
            table(
                "What the quality slider does for each format",
                ["Input format", "Compression", "Output from this tool", "Suggested quality"],
                [
                    ["JPG / JPEG", "Lossy", "JPG", "70-85% for photos"],
                    ["WebP", "Lossy (or lossless)", "WebP", "70-85% for photos"],
                    ["PNG", "Lossless - no quality setting", "WebP (so the slider can work)", "80-90% for graphics and screenshots"],
                ],
            ),
            tip("Pro tip", "<p>The biggest savings come from resizing. A photo resized from 4000 px to 1600 px wide has about one sixth of the pixels - compress it after that.</p>"),
            sources("webdev_compress", "webp_study", "mdn_toblob", "wiki_compression"),
        ],
    },

    # ----------------------------------------------------------------- convert
    "convert": {
        "search_description": "Convert images between PNG, JPG and WebP right in your browser. Free, no sign-up, no upload - pick a format, click convert and download.",
        "steps": [
            step(1, "Open your image", "Drop the file you want to convert onto the page. Anything your browser can display will open."),
            step(2, "Pick a target format", "Choose PNG for lossless quality and transparency, JPG for maximum compatibility, or WebP for the smallest files."),
            step(3, "Convert", "Click Apply. The image is re-encoded in the new format on your device."),
            step(4, "Download", "Save the converted file. The original on your device is untouched."),
        ],
        "faqs": [
            faq("Should I use JPG, PNG or WebP?",
                "<p>Use <b>JPG</b> for photos that need to open everywhere. Use <b>PNG</b> for logos, screenshots, text "
                "and anything with transparency. Use <b>WebP</b> for websites: it's usually smaller than both and supports "
                "transparency, and all modern browsers display it.</p>"),
            faq("How do I convert PNG to JPG?",
                "<p>Open the PNG, choose <b>JPG</b> as the target format and click Apply. Note that JPG has no "
                "transparency, so transparent areas will be filled with a solid colour.</p>"),
            faq("How do I convert WebP to JPG or PNG?",
                "<p>Open the WebP file, select JPG or PNG and convert. This is handy when an app or upload form doesn't "
                "accept WebP yet.</p>"),
            faq("Can I convert to GIF or BMP?",
                "<p>Those options are listed, but browsers can only encode the formats they support. Most browsers "
                "reliably export PNG, JPG and WebP; if yours can't produce GIF or BMP you'll receive a PNG instead.</p>"),
            faq("Can I convert HEIC photos from my iPhone?",
                "<p>It depends on the browser. Safari on iPhone and Mac can open HEIC files, so you can convert them to "
                "JPG there. Other browsers generally can't read HEIC; in that case set your iPhone camera to "
                "\"Most Compatible\" or share the photo as JPG first.</p>"),
            faq(*PRIVACY_FAQ),
        ],
        "editorial": [
            rich(
                "<h2>What does converting an image do?</h2>"
                "<p>Converting re-encodes the same pixels in a different file format. The picture looks the same, but "
                "the format decides how the data is compressed, whether transparency is kept, and which apps can open it.</p>"
                "<h2>JPG vs PNG vs WebP at a glance</h2>"
            ),
            table(
                "JPG vs PNG vs WebP",
                ["Format", "Compression", "Transparency", "Best for", "Compatibility"],
                [
                    ["JPG / JPEG", "Lossy", "No", "Photos", "Opens everywhere"],
                    ["PNG", "Lossless", "Yes", "Logos, icons, screenshots, text", "Opens everywhere"],
                    ["WebP", "Lossy or lossless", "Yes", "Websites - usually the smallest file", "All current browsers; some older apps and upload forms reject it"],
                    ["HEIC / HEIF", "Lossy", "Yes", "iPhone camera photos", "Apple devices; limited elsewhere (can't be exported here)"],
                ],
            ),
            rich(
                "<h2>When should you convert?</h2>"
                "<ul>"
                "<li>A website or form only accepts JPG or PNG and your file is WebP.</li>"
                "<li>A PNG photo is several megabytes - converting it to JPG or WebP shrinks it dramatically.</li>"
                "<li>You need a transparent background - convert to PNG or WebP, never JPG.</li>"
                "<li>You're optimising a website - serve WebP to cut page weight.</li>"
                "</ul>"
            ),
            tip("Note", "<p>Converting a JPG to PNG won't restore detail that JPG compression already removed - it only makes the file bigger. Keep your originals.</p>"),
            sources("webdev_format", "mdn_formats", "webp", "png_spec", "apple_heif"),
        ],
    },

    # ------------------------------------------------------------------ rotate
    "rotate": {
        "search_description": "Rotate images by 90, 180 or 270 degrees, or straighten them to any angle from -180 to 180. Free and private - rotated in your browser, nothing uploaded.",
        "steps": [
            step(1, "Open your image", "Drop the sideways or tilted photo onto the page."),
            step(2, "Choose the rotation", "Click 90°, 180° or 270° for a quick turn, or drag the angle slider anywhere from -180° to +180° to straighten a tilted horizon."),
            step(3, "Apply", "Click Apply. The canvas grows to fit the rotated picture, so no corners are cut off."),
            step(4, "Download", "Save the rotated image, or crop away the empty corners first."),
        ],
        "faqs": [
            faq("How do I rotate a photo that is sideways?",
                "<p>Click <b>90°</b> to turn it a quarter turn clockwise, or <b>270°</b> to turn it a quarter turn "
                "the other way. Use 180° for an upside-down image.</p>"),
            faq("How do I straighten a tilted horizon?",
                "<p>Drag the angle slider a few degrees at a time - most crooked horizons are only 1-5° off. Then use "
                "<a href=\"/crop-image/\">Crop Image</a> to trim the angled edges.</p>"),
            faq("Why are there empty corners after rotating?",
                "<p>A picture rotated by an angle that isn't a multiple of 90° no longer fits a rectangle, so the "
                "canvas is enlarged to hold the whole image. The extra corners are transparent in PNG/WebP and filled "
                "in JPG. Crop them off for a clean result.</p>"),
            faq("Does rotating reduce image quality?",
                "<p>Rotations by exactly 90°, 180° or 270° just rearrange pixels. Other angles require resampling, "
                "which softens the image very slightly - generally not noticeable at normal viewing size.</p>"),
            faq("Why does my photo show sideways on some sites but not others?",
                "<p>Phones often save photos unrotated and add an EXIF \"orientation\" flag. Some apps read the flag, "
                "others ignore it. Rotating the pixels here and downloading the result fixes it everywhere.</p>"),
            faq(*PRIVACY_FAQ),
        ],
        "editorial": [
            rich(
                "<h2>What does rotating an image do?</h2>"
                "<p>Rotation turns the picture around its centre. Quarter turns (90°, 180°, 270°) fix photos taken with "
                "the phone held sideways or upside down. Small custom angles straighten horizons, buildings and "
                "scanned documents that went into the scanner at a slant.</p>"
                "<h2>Rotate vs flip: what's the difference?</h2>"
                "<p>Rotating turns the image like a steering wheel - text stays readable. Flipping creates a mirror "
                "image - text appears backwards. If you need a mirror effect, use the "
                "<a href=\"/mirror-image/\">Mirror Image</a> tool instead.</p>"
                "<h2>Tips for straightening photos</h2>"
                "<ul>"
                "<li>Line up a clear horizontal reference - the horizon, a table edge or a window frame.</li>"
                "<li>Make small adjustments; 1-3° is usually enough.</li>"
                "<li>Crop afterwards to remove the angled corners.</li>"
                "</ul>"
            ),
            sources("mdn_rotate", "wiki_exif"),
        ],
    },

    # ------------------------------------------------------------------ mirror
    "mirror": {
        "search_description": "Flip images horizontally or vertically in one click to fix mirrored selfies or create reflections. Free and private - no upload, it runs in your browser.",
        "steps": [
            step(1, "Open your image", "Drop the photo you want to flip onto the page."),
            step(2, "Flip horizontally or vertically", "Click Flip Horizontal to mirror left-to-right, or Flip Vertical to turn it upside-down like a reflection in water."),
            step(3, "Download", "Save the flipped image. Click the same button again to flip it back."),
        ],
        "faqs": [
            faq("Why are my selfies mirrored?",
                "<p>Many front cameras show and sometimes save a mirror image, because that's how you see yourself in a "
                "mirror. Text on your clothes or in the background then reads backwards. A horizontal flip fixes it.</p>"),
            faq("What is the difference between flipping horizontally and vertically?",
                "<p>A <b>horizontal</b> flip swaps left and right, like looking in a mirror. A <b>vertical</b> flip swaps "
                "top and bottom, like a reflection in a lake.</p>"),
            faq("Is flipping the same as rotating 180 degrees?",
                "<p>No. Rotating 180° turns the image upside down but text stays readable (just upside down). A vertical "
                "flip turns it upside down <i>and</i> mirrors it, so text reads backwards.</p>"),
            faq("Does flipping reduce quality?",
                "<p>No. Flipping only rearranges existing pixels, so no detail is lost.</p>"),
            faq(*PRIVACY_FAQ),
        ],
        "editorial": [
            rich(
                "<h2>What is a mirrored image?</h2>"
                "<p>A mirrored (or flipped) image is a reversed copy of the original along one axis. A horizontal flip "
                "produces exactly what you'd see in a mirror; a vertical flip produces a reflection like water.</p>"
                "<h2>Common reasons to flip an image</h2>"
                "<ul>"
                "<li><b>Fix selfies</b> so text and logos read the right way round.</li>"
                "<li><b>Improve composition</b> - make a person face into the page or toward your text instead of away from it.</li>"
                "<li><b>Design work</b> - create symmetrical patterns or matching left and right graphics.</li>"
                "<li><b>Printing transfers</b> - iron-on and some sublimation prints need a mirrored design.</li>"
                "</ul>"
            ),
            tip("Watch out", "<p>Flipping a photo with visible text, number plates or brand logos will make them read backwards - check before you publish.</p>"),
            sources("wiki_mirror", "mdn_scale"),
        ],
    },

    # --------------------------------------------------------------- watermark
    "watermark": {
        "search_description": "Add a text watermark to photos: set your text, opacity and one of five positions, then download. Free and private - your images are never uploaded.",
        "steps": [
            step(1, "Open your photo", "Drop the image you want to protect onto the page."),
            step(2, "Type your watermark", "Enter your name, brand, website or a copyright line such as \"© 2026 Your Name\"."),
            step(3, "Set opacity and position", "Choose 10-100% opacity and place the text bottom-right, bottom-left, top-right, top-left or centre."),
            step(4, "Apply and download", "Click Apply to stamp the text onto the image, then download your watermarked copy."),
        ],
        "faqs": [
            faq("What should my watermark say?",
                "<p>Keep it short: your name, brand or website, optionally with a copyright symbol and year "
                "(for example \"© 2026 Jane Doe Photography\"). Shorter text is less distracting and harder to crop around.</p>"),
            faq("What opacity is best for a watermark?",
                "<p>Around 30-60% is visible without overpowering the photo. Use a higher opacity in the centre if you're "
                "sending proofs to a client and want to discourage unauthorised use.</p>"),
            faq("Where should I place a watermark?",
                "<p>A corner is subtle and suits portfolios and social posts. The centre is much harder to crop out and "
                "is better for proofs and previews.</p>"),
            faq("How big is the watermark text?",
                "<p>The text size scales with the image - about 4.5% of its width - so it looks consistent on both "
                "small and large photos.</p>"),
            faq("Can I remove a watermark later?",
                "<p>Not from the downloaded file - the text becomes part of the pixels. Keep your original unwatermarked "
                "image; the tool never changes the file on your device.</p>"),
            faq(*PRIVACY_FAQ),
        ],
        "editorial": [
            rich(
                "<h2>What is a watermark?</h2>"
                "<p>A watermark is a visible mark - usually text or a logo - placed over an image to show who owns it "
                "and to discourage people from reusing it without credit. Photographers, designers, online sellers "
                "and content creators use watermarks on previews, portfolios and social posts.</p>"
                "<h2>Do watermarks stop image theft?</h2>"
                "<p>Not completely, but they help. A watermark makes it obvious who created the image, ensures you are "
                "credited when it gets shared, and makes commercial reuse less attractive. A large central watermark "
                "is far harder to remove than a small one in the corner.</p>"
                "<h2>Watermark best practices</h2>"
                "<ul>"
                "<li>Use the same wording and position on every image so your work is recognisable.</li>"
                "<li>Pick a position over detailed areas of the photo rather than plain sky, where it's easy to clone out.</li>"
                "<li>Always keep an unwatermarked original.</li>"
                "<li>Strip private EXIF data with <a href=\"/metadata-image/\">Clean Metadata</a> before you post publicly.</li>"
                "</ul>"
            ),
            sources("wiki_watermark", "copyright_faq"),
        ],
    },

    # ---------------------------------------------------------------- metadata
    "metadata": {
        "search_description": "Remove EXIF metadata, including GPS location, camera model and date taken, from photos before sharing. Free, in-browser and private - nothing is uploaded.",
        "steps": [
            step(1, "Open your photo", "Drop the photo onto the page. Its basic file details are shown in the panel."),
            step(2, "Strip the metadata", "Click Strip All Metadata. The image is redrawn pixel by pixel, which leaves every hidden tag behind."),
            step(3, "Download the clean copy", "Save the cleaned image and share that copy instead of the original."),
        ],
        "faqs": [
            faq("What is EXIF data?",
                "<p>EXIF (Exchangeable Image File Format) data is information your camera or phone hides inside a photo "
                "file: the date and time it was taken, the device make and model, camera settings and, if location was "
                "on, the GPS coordinates where you took it.</p>"),
            faq("Does removing EXIF remove the GPS location?",
                "<p>Yes. This tool exports only the image pixels, so GPS latitude and longitude, along with all other "
                "EXIF fields, are not carried over into the downloaded file.</p>"),
            faq("Do social networks remove metadata automatically?",
                "<p>Many large platforms strip some metadata on upload, but behaviour varies and changes over time, and "
                "email, cloud links, messaging apps and forums often send the original file unchanged. Cleaning the photo "
                "yourself is the only way to be sure.</p>"),
            faq("Will removing metadata change how my photo looks?",
                "<p>The pixels stay the same. Two side effects to know about: the colour profile is not kept, so "
                "wide-gamut photos may look very slightly different in some apps, and a re-saved JPG goes through one "
                "more round of compression.</p>"),
            faq("How can I check whether a photo has location data?",
                "<p>On Windows, right-click the file, choose Properties and open the Details tab. On a Mac, open it in "
                "Preview and choose Tools, then Show Inspector. On iPhone, swipe up on the photo in the Photos app to see its location.</p>"),
            faq(*PRIVACY_FAQ),
        ],
        "editorial": [
            rich(
                "<h2>What is image metadata?</h2>"
                "<p>Image metadata is text information stored inside a photo file alongside the picture itself. The most "
                "common type, EXIF, is written automatically by cameras and phones. You can't see it when you look at "
                "the photo, but anyone who downloads the original file can read it in seconds.</p>"
                "<h2>What can EXIF reveal about you?</h2>"
                "<ul>"
                "<li><b>GPS coordinates</b> - the exact place the photo was taken, often your home or workplace.</li>"
                "<li><b>Date and time</b> - when you were at that location.</li>"
                "<li><b>Device details</b> - phone or camera make and model, and sometimes the lens and serial number.</li>"
                "<li><b>Software</b> - which apps edited the image.</li>"
                "</ul>"
                "<h2>When should you strip metadata?</h2>"
                "<p>Before you post photos of your home, your children or anything you're selling online; before you send "
                "images to people you don't know; and before you publish images on a website. It's also good practice "
                "for journalists and anyone sharing sensitive documents.</p>"
                "<h2>Why cleaning photos in the browser is safer</h2>"
                "<p>Many online EXIF removers ask you to upload the very photo you're trying to protect. ImageToolLab "
                "reads the file and redraws it locally, so the original - GPS tags included - never leaves your device.</p>"
            ),
            sources("wiki_exif", "mdn_toblob", "eff_ssd"),
        ],
    },

    # ---------------------------------------------------------------- pixelate
    "pixelate": {
        "search_description": "Pixelate an image to hide faces, number plates or private details, or for a retro pixel-art look. Adjustable 2-60 px blocks. Free and private - no upload.",
        "steps": [
            step(1, "Open your image", "Drop the photo or screenshot onto the page."),
            step(2, "Choose the pixel size", "Drag the Pixel Size slider from 2 px (subtle) to 60 px (unreadable). Larger blocks hide more detail."),
            step(3, "Apply the effect", "Click Apply to pixelate the image. Undo and try another size if needed."),
            step(4, "Download", "Save the pixelated image."),
        ],
        "faqs": [
            faq("Does the tool pixelate the whole image or just one area?",
                "<p>It currently applies the effect to the whole image, which suits blurred previews, backgrounds and "
                "pixel-art styles. If only one corner holds private details, <a href=\"/crop-image/\">cropping</a> "
                "that part away is often the simplest fix.</p>"),
            faq("What pixel size hides text and faces?",
                "<p>Use a block size at least as tall as the text you want to hide - typically 20 px or more for "
                "screenshots and 30-60 px for faces in large photos. If you can still guess the content, go bigger.</p>"),
            faq("Can pixelation be reversed?",
                "<p>A pixelated download can't be \"un-pixelated\" because the detail is gone, but small block sizes can "
                "sometimes be guessed, especially for text. For truly sensitive information, use a large block size or "
                "crop the information out entirely.</p>"),
            faq("What is the difference between pixelating and blurring?",
                "<p>Pixelation replaces areas with flat coloured squares; blurring smears detail. Both hide information, "
                "but large pixel blocks are harder to reverse than a light blur.</p>"),
            faq("Can I use this to make pixel art?",
                "<p>Yes. A block size of 8-16 px gives a retro, 8-bit look that works well for avatars, game-style "
                "graphics and thumbnails.</p>"),
            faq(*PRIVACY_FAQ),
        ],
        "editorial": [
            rich(
                "<h2>What is pixelation?</h2>"
                "<p>Pixelation divides an image into square blocks and paints each block in a single average colour. "
                "Small blocks give a mosaic or retro look; large blocks make faces, text and numbers unrecognisable.</p>"
                "<h2>What should you pixelate before sharing?</h2>"
                "<ul>"
                "<li>Faces of people who haven't agreed to be shown, especially children.</li>"
                "<li>Vehicle number plates and house numbers.</li>"
                "<li>Names, email addresses, phone numbers and account numbers in screenshots.</li>"
                "<li>Boarding passes, tickets and ID cards - their barcodes can contain personal data.</li>"
                "</ul>"
                "<h2>Why redact images in your browser?</h2>"
                "<p>The whole point of censoring an image is to keep information private, so uploading the uncensored "
                "original to a third-party server defeats the purpose. Here the image is processed on your own device "
                "and only the pixelated result is saved.</p>"
            ),
            tip("Safety tip", "<p>For passwords, card numbers or ID documents, cropping the information out completely is safer than any pixelation.</p>"),
            sources("wiki_pixelization", "mdn_imagedata", "eff_ssd"),
        ],
    },

    # -------------------------------------------------------------- blackwhite
    "blackwhite": {
        "search_description": "Turn color photos black and white online. Choose smooth grayscale with an intensity slider or crisp high-contrast 1-bit. Free, private, no upload needed.",
        "steps": [
            step(1, "Open your photo", "Drop a colour image onto the page."),
            step(2, "Pick a mode", "Choose Grayscale for a natural black-and-white photo, or High Contrast (Binary) for pure black and white with no greys."),
            step(3, "Set the intensity", "In Grayscale mode, drag Intensity between 10% and 100%. Lower values keep a hint of the original colour."),
            step(4, "Apply and download", "Click Apply, check the result and download your monochrome image."),
        ],
        "faqs": [
            faq("What is the difference between grayscale and black and white?",
                "<p><b>Grayscale</b> uses up to 256 shades of grey between black and white and looks like a classic "
                "monochrome photo. <b>Binary</b> (1-bit) uses only pure black and pure white, which gives a stark, "
                "graphic look similar to a stamp or photocopy.</p>"),
            faq("What does the intensity slider do?",
                "<p>At 100% the photo is fully grey. Lower settings blend the grey version with the original colours, "
                "producing a muted, desaturated look.</p>"),
            faq("When should I use high-contrast binary mode?",
                "<p>Use it for scanned documents and signatures, line drawings, stencils, and logos that need to be "
                "printed in a single colour. It removes grey backgrounds and makes text crisp.</p>"),
            faq("Can I turn a black and white photo back into colour?",
                "<p>Not from the downloaded file - the colour information is removed. Keep the original, or use Undo "
                "while the editor is still open.</p>"),
            faq(*PRIVACY_FAQ),
        ],
        "editorial": [
            rich(
                "<h2>What is a black and white filter?</h2>"
                "<p>A black and white filter removes colour from a photo and keeps only brightness. The grayscale mode "
                "turns each pixel into a shade of grey; the binary mode goes further and makes each pixel either pure "
                "black or pure white, depending on whether it is darker or lighter than mid-grey.</p>"
                "<h2>Why convert a photo to black and white?</h2>"
                "<ul>"
                "<li><b>Timeless look:</b> monochrome draws attention to shape, light and expression rather than colour.</li>"
                "<li><b>Hide colour problems:</b> mixed lighting or strong colour casts disappear.</li>"
                "<li><b>Printing:</b> grayscale files print predictably on black-only printers.</li>"
                "<li><b>Documents:</b> binary mode cleans up scans, receipts and signatures.</li>"
                "</ul>"
                "<h2>Tips for better black and white photos</h2>"
                "<p>Pick images with strong contrast between light and dark areas, interesting textures or dramatic "
                "shadows. Flat, evenly lit scenes can look dull in grey - try binary mode for a bolder graphic effect.</p>"
            ),
            sources("wiki_grayscale", "mdn_imagedata"),
        ],
    },
}
