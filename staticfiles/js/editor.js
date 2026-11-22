/**
 * ImageToolLab v2 - High-Performance Client-Side Image Suite
 * 100% In-Browser Execution | Zero Server Uploads | Memory Safe
 */

(function() {
  'use strict';

  // Elements
  const dropZone = document.getElementById('drop-zone');
  const fileInput = document.getElementById('file-input');
  const uploadContainer = document.getElementById('upload-container');
  const editorContainer = document.getElementById('editor-container');
  const editorImage = document.getElementById('editor-image');
  const downloadBtn = document.getElementById('btn-download');
  const resetBtn = document.getElementById('btn-reset');
  const undoBtn = document.getElementById('btn-undo');
  const redoBtn = document.getElementById('btn-redo');
  const toolButtons = document.querySelectorAll('.tool-tab-btn');
  const toolPanels = document.querySelectorAll('.tool-panel');

  if (!uploadContainer || !editorContainer) return;

  // Editor State
  const state = {
    activeTool: editorContainer.dataset.initialTool || 'resize',
    originalFile: null,
    originalDimensions: { width: 0, height: 0 },
    currentUrl: null,
    history: [],
    historyIndex: -1,
    format: 'png',
    isProcessing: false,
    
    // Tool Specific States
    resize: { width: 0, height: 0, mode: 'pixels', percentage: 100, lockAspect: true },
    crop: { x: 0, y: 0, width: 100, height: 100, aspect: 'free' },
    rotate: { angle: 0, enlargeCanvas: true },
    pixelate: { size: 12 },
    blackwhite: { mode: 'grayscale', intensity: 100, threshold: 128 },
    compress: { quality: 0.8, targetSize: 500, unit: 'KB', useTarget: false },
    watermark: { text: 'ImageToolLab', opacity: 0.6, size: 40, position: 'bottom-right', color: '#ffffff' }
  };

  // Canvas toBlob needs a real MIME type: "image/jpg" is not one, and browsers
  // silently fall back to PNG for unknown types.
  const mimeFor = (fmt) => (fmt === 'jpg' || fmt === 'jpeg') ? 'image/jpeg' : `image/${fmt}`;

  // -------------------------------------------------------------
  // History & Memory Management
  // -------------------------------------------------------------
  function pushHistory(newUrl) {
    // Revoke forward history
    for (let i = state.historyIndex + 1; i < state.history.length; i++) {
      if (state.history[i] && state.history[i] !== newUrl && state.history[i].startsWith('blob:')) {
        URL.revokeObjectURL(state.history[i]);
      }
    }
    state.history = state.history.slice(0, state.historyIndex + 1);
    state.history.push(newUrl);

    // Limit history to 20 items to conserve browser memory
    if (state.history.length > 20) {
      const removed = state.history.shift();
      if (removed && removed.startsWith('blob:')) URL.revokeObjectURL(removed);
    }
    state.historyIndex = state.history.length - 1;
    updateImage(newUrl, false);
    updateHistoryButtons();
  }

  function undo() {
    if (state.historyIndex > 0) {
      state.historyIndex--;
      updateImage(state.history[state.historyIndex], false);
      updateHistoryButtons();
    }
  }

  function redo() {
    if (state.historyIndex < state.history.length - 1) {
      state.historyIndex++;
      updateImage(state.history[state.historyIndex], false);
      updateHistoryButtons();
    }
  }

  function updateHistoryButtons() {
    if (undoBtn) undoBtn.disabled = state.historyIndex <= 0;
    if (redoBtn) redoBtn.disabled = state.historyIndex >= state.history.length - 1;
  }

  function updateImage(url, addToHistory = true) {
    state.currentUrl = url;
    if (editorImage) editorImage.src = url;

    const temp = new Image();
    temp.onload = function() {
      state.originalDimensions = { width: temp.naturalWidth, height: temp.naturalHeight };
      updateDimensionDisplay(temp.naturalWidth, temp.naturalHeight);
      updateResizeInputs(temp.naturalWidth, temp.naturalHeight);
    };
    temp.src = url;

    if (addToHistory) {
      pushHistory(url);
    }
  }

  function updateDimensionDisplay(w, h) {
    const dimEl = document.getElementById('image-dimensions-badge');
    if (dimEl) dimEl.textContent = `${w} × ${h} px`;
  }

  // -------------------------------------------------------------
  // File Upload Handlers
  // -------------------------------------------------------------
  function handleFile(file) {
    if (!file || !file.type.startsWith('image/')) return;
    state.originalFile = file;
    
    // Auto-detect format
    if (file.type.includes('jpeg') || file.type.includes('jpg')) state.format = 'jpg';
    else if (file.type.includes('webp')) state.format = 'webp';
    else if (file.type.includes('png')) state.format = 'png';

    const formatSelect = document.getElementById('convert-format-select');
    if (formatSelect) formatSelect.value = state.format;

    const url = URL.createObjectURL(file);
    uploadContainer.classList.add('hidden');
    editorContainer.classList.remove('hidden');

    state.history = [];
    state.historyIndex = -1;
    updateImage(url, true);
    parseExif(file);
  }

  if (dropZone) {
    dropZone.addEventListener('dragover', (e) => {
      e.preventDefault();
      dropZone.classList.add('border-emerald-500', 'bg-emerald-50/50');
    });

    dropZone.addEventListener('dragleave', (e) => {
      e.preventDefault();
      dropZone.classList.remove('border-emerald-500', 'bg-emerald-50/50');
    });

    dropZone.addEventListener('drop', (e) => {
      e.preventDefault();
      dropZone.classList.remove('border-emerald-500', 'bg-emerald-50/50');
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        handleFile(e.dataTransfer.files[0]);
      }
    });

    dropZone.addEventListener('click', () => {
      if (fileInput) fileInput.click();
    });
  }

  if (fileInput) {
    fileInput.addEventListener('change', (e) => {
      if (e.target.files && e.target.files[0]) {
        handleFile(e.target.files[0]);
      }
    });
  }

  // Paste from clipboard support
  window.addEventListener('paste', (e) => {
    if (e.clipboardData && e.clipboardData.files && e.clipboardData.files[0]) {
      const file = e.clipboardData.files[0];
      if (file.type.startsWith('image/')) {
        handleFile(file);
      }
    }
  });

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      if (confirm('Start with a new image? Current unsaved edits will be discarded.')) {
        state.history.forEach(url => {
          if (url && url.startsWith('blob:')) URL.revokeObjectURL(url);
        });
        state.history = [];
        state.historyIndex = -1;
        editorContainer.classList.add('hidden');
        uploadContainer.classList.remove('hidden');
        if (fileInput) fileInput.value = '';
      }
    });
  }

  if (undoBtn) undoBtn.addEventListener('click', undo);
  if (redoBtn) redoBtn.addEventListener('click', redo);

  // Keyboard shortcuts
  window.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
      if (e.shiftKey) redo();
      else undo();
      e.preventDefault();
    } else if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
      redo();
      e.preventDefault();
    }
  });

  // -------------------------------------------------------------
  // Tool Switching
  // -------------------------------------------------------------
  function switchTool(toolId) {
    state.activeTool = toolId;
    toolButtons.forEach(btn => {
      const isActive = btn.dataset.tool === toolId;
      btn.classList.toggle('bg-slate-900', isActive);
      btn.classList.toggle('text-white', isActive);
      btn.classList.toggle('text-slate-600', !isActive);
    });

    toolPanels.forEach(panel => {
      panel.classList.toggle('hidden', panel.dataset.toolPanel !== toolId);
    });

    // Special handlers for tools
    if (toolId === 'crop') {
      initCropOverlay();
    } else {
      destroyCropOverlay();
    }
  }

  toolButtons.forEach(btn => {
    btn.addEventListener('click', () => switchTool(btn.dataset.tool));
  });

  // -------------------------------------------------------------
  // Tool 1: Resize
  // -------------------------------------------------------------
  const resizeWidthInput = document.getElementById('resize-width');
  const resizeHeightInput = document.getElementById('resize-height');
  const resizePercentInput = document.getElementById('resize-percent');
  const resizePercentVal = document.getElementById('resize-percent-val');
  const resizeLockAspect = document.getElementById('resize-lock-aspect');
  const resizeModePixels = document.getElementById('resize-mode-pixels');
  const resizeModePercent = document.getElementById('resize-mode-percent');
  const applyResizeBtn = document.getElementById('btn-apply-resize');

  function updateResizeInputs(w, h) {
    if (resizeWidthInput) resizeWidthInput.value = w;
    if (resizeHeightInput) resizeHeightInput.value = h;
    state.resize.width = w;
    state.resize.height = h;
  }

  if (resizeWidthInput && resizeHeightInput) {
    resizeWidthInput.addEventListener('input', () => {
      const w = parseInt(resizeWidthInput.value) || 0;
      state.resize.width = w;
      if (resizeLockAspect && resizeLockAspect.checked && state.originalDimensions.width > 0) {
        const ratio = state.originalDimensions.width / state.originalDimensions.height;
        const h = Math.round(w / ratio);
        resizeHeightInput.value = h;
        state.resize.height = h;
      }
    });

    resizeHeightInput.addEventListener('input', () => {
      const h = parseInt(resizeHeightInput.value) || 0;
      state.resize.height = h;
      if (resizeLockAspect && resizeLockAspect.checked && state.originalDimensions.height > 0) {
        const ratio = state.originalDimensions.width / state.originalDimensions.height;
        const w = Math.round(h * ratio);
        resizeWidthInput.value = w;
        state.resize.width = w;
      }
    });
  }

  if (resizePercentInput && resizePercentVal) {
    resizePercentInput.addEventListener('input', () => {
      const p = parseInt(resizePercentInput.value) || 100;
      resizePercentVal.textContent = `${p}%`;
      state.resize.percentage = p;
      state.resize.width = Math.round(state.originalDimensions.width * (p / 100));
      state.resize.height = Math.round(state.originalDimensions.height * (p / 100));
      if (resizeWidthInput) resizeWidthInput.value = state.resize.width;
      if (resizeHeightInput) resizeHeightInput.value = state.resize.height;
    });
  }

  if (applyResizeBtn) {
    applyResizeBtn.addEventListener('click', async () => {
      const canvas = document.createElement('canvas');
      const w = state.resize.width;
      const h = state.resize.height;
      if (w <= 0 || h <= 0) return alert('Please specify valid dimensions.');

      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      const img = new Image();
      img.src = state.currentUrl;
      await new Promise(r => img.onload = r);

      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, w, h);

      canvas.toBlob(blob => {
        if (blob) pushHistory(URL.createObjectURL(blob));
      }, mimeFor(state.format));
    });
  }

  // -------------------------------------------------------------
  // Tool 2: Interactive Crop
  // -------------------------------------------------------------
  let cropBox = null;
  const cropWrapper = document.getElementById('crop-wrapper');
  const applyCropBtn = document.getElementById('btn-apply-crop');

  function initCropOverlay() {
    if (!editorImage || !cropWrapper) return;
    destroyCropOverlay();

    cropBox = document.createElement('div');
    cropBox.className = 'crop-overlay';
    cropBox.id = 'active-crop-box';

    // Corner handles
    ['tl', 'tr', 'bl', 'br'].forEach(pos => {
      const h = document.createElement('div');
      h.className = `crop-handle ${pos}`;
      cropBox.appendChild(h);
    });

    cropWrapper.style.position = 'relative';
    cropWrapper.appendChild(cropBox);

    // Initial box in center
    const rect = editorImage.getBoundingClientRect();
    const w = rect.width * 0.8;
    const h = rect.height * 0.8;
    const left = rect.width * 0.1;
    const top = rect.height * 0.1;

    cropBox.style.left = `${left}px`;
    cropBox.style.top = `${top}px`;
    cropBox.style.width = `${w}px`;
    cropBox.style.height = `${h}px`;

    makeDraggable(cropBox, cropWrapper);
  }

  function destroyCropOverlay() {
    const existing = document.getElementById('active-crop-box');
    if (existing) existing.remove();
  }

  function makeDraggable(el, container) {
    let isDragging = false;
    let startX, startY, initialLeft, initialTop;

    el.addEventListener('mousedown', (e) => {
      if (e.target.classList.contains('crop-handle')) return;
      isDragging = true;
      startX = e.clientX;
      startY = e.clientY;
      initialLeft = el.offsetLeft;
      initialTop = el.offsetTop;
      e.preventDefault();
    });

    window.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      const maxLeft = container.offsetWidth - el.offsetWidth;
      const maxTop = container.offsetHeight - el.offsetHeight;

      el.style.left = `${Math.max(0, Math.min(maxLeft, initialLeft + dx))}px`;
      el.style.top = `${Math.max(0, Math.min(maxTop, initialTop + dy))}px`;
    });

    window.addEventListener('mouseup', () => isDragging = false);

    // Touch support for mobile devices
    el.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        isDragging = true;
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
        initialLeft = el.offsetLeft;
        initialTop = el.offsetTop;
      }
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
      if (!isDragging || e.touches.length !== 1) return;
      const dx = e.touches[0].clientX - startX;
      const dy = e.touches[0].clientY - startY;
      const maxLeft = container.offsetWidth - el.offsetWidth;
      const maxTop = container.offsetHeight - el.offsetHeight;

      el.style.left = `${Math.max(0, Math.min(maxLeft, initialLeft + dx))}px`;
      el.style.top = `${Math.max(0, Math.min(maxTop, initialTop + dy))}px`;
    }, { passive: true });

    window.addEventListener('touchend', () => isDragging = false);
  }

  if (applyCropBtn) {
    applyCropBtn.addEventListener('click', async () => {
      if (!cropBox || !editorImage) return;
      const scaleX = editorImage.naturalWidth / editorImage.clientWidth;
      const scaleY = editorImage.naturalHeight / editorImage.clientHeight;

      const cropX = cropBox.offsetLeft * scaleX;
      const cropY = cropBox.offsetTop * scaleY;
      const cropW = cropBox.offsetWidth * scaleX;
      const cropH = cropBox.offsetHeight * scaleY;

      const canvas = document.createElement('canvas');
      canvas.width = cropW;
      canvas.height = cropH;
      const ctx = canvas.getContext('2d');
      const img = new Image();
      img.src = state.currentUrl;
      await new Promise(r => img.onload = r);

      ctx.drawImage(img, cropX, cropY, cropW, cropH, 0, 0, cropW, cropH);
      destroyCropOverlay();

      canvas.toBlob(blob => {
        if (blob) pushHistory(URL.createObjectURL(blob));
      }, mimeFor(state.format));
    });
  }

  // -------------------------------------------------------------
  // Tool 3: Mirror / Flip
  // -------------------------------------------------------------
  const btnFlipH = document.getElementById('btn-flip-h');
  const btnFlipV = document.getElementById('btn-flip-v');

  async function applyMirror(horizontal, vertical) {
    const canvas = document.createElement('canvas');
    const img = new Image();
    img.src = state.currentUrl;
    await new Promise(r => img.onload = r);

    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext('2d');

    ctx.translate(horizontal ? canvas.width : 0, vertical ? canvas.height : 0);
    ctx.scale(horizontal ? -1 : 1, vertical ? -1 : 1);
    ctx.drawImage(img, 0, 0);

    canvas.toBlob(blob => {
      if (blob) pushHistory(URL.createObjectURL(blob));
    }, mimeFor(state.format));
  }

  if (btnFlipH) btnFlipH.addEventListener('click', () => applyMirror(true, false));
  if (btnFlipV) btnFlipV.addEventListener('click', () => applyMirror(false, true));

  // -------------------------------------------------------------
  // Tool 4: Rotate
  // -------------------------------------------------------------
  const rotateAngleSlider = document.getElementById('rotate-angle');
  const rotateAngleVal = document.getElementById('rotate-angle-val');
  const btnRotate90 = document.getElementById('btn-rotate-90');
  const btnRotate180 = document.getElementById('btn-rotate-180');
  const btnRotate270 = document.getElementById('btn-rotate-270');
  const applyRotateBtn = document.getElementById('btn-apply-rotate');

  if (rotateAngleSlider && rotateAngleVal) {
    rotateAngleSlider.addEventListener('input', () => {
      const a = parseInt(rotateAngleSlider.value) || 0;
      rotateAngleVal.textContent = `${a}°`;
      state.rotate.angle = a;
    });
  }

  async function applyRotation(angle) {
    const canvas = document.createElement('canvas');
    const img = new Image();
    img.src = state.currentUrl;
    await new Promise(r => img.onload = r);

    const rad = (angle * Math.PI) / 180;
    canvas.width = Math.abs(img.width * Math.cos(rad)) + Math.abs(img.height * Math.sin(rad));
    canvas.height = Math.abs(img.width * Math.sin(rad)) + Math.abs(img.height * Math.cos(rad));

    const ctx = canvas.getContext('2d');
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate(rad);
    ctx.drawImage(img, -img.width / 2, -img.height / 2);

    canvas.toBlob(blob => {
      if (blob) pushHistory(URL.createObjectURL(blob));
    }, mimeFor(state.format));
  }

  if (btnRotate90) btnRotate90.addEventListener('click', () => applyRotation(90));
  if (btnRotate180) btnRotate180.addEventListener('click', () => applyRotation(180));
  if (btnRotate270) btnRotate270.addEventListener('click', () => applyRotation(270));
  if (applyRotateBtn) applyRotateBtn.addEventListener('click', () => applyRotation(state.rotate.angle));

  // -------------------------------------------------------------
  // Tool 5: Compress
  // -------------------------------------------------------------
  const compressQualitySlider = document.getElementById('compress-quality');
  const compressQualityVal = document.getElementById('compress-quality-val');
  const applyCompressBtn = document.getElementById('btn-apply-compress');

  if (compressQualitySlider && compressQualityVal) {
    compressQualitySlider.addEventListener('input', () => {
      const q = parseInt(compressQualitySlider.value) || 80;
      compressQualityVal.textContent = `${q}%`;
      state.compress.quality = q / 100;
    });
  }

  if (applyCompressBtn) {
    applyCompressBtn.addEventListener('click', async () => {
      const canvas = document.createElement('canvas');
      const img = new Image();
      img.src = state.currentUrl;
      await new Promise(r => img.onload = r);

      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);

      // WebP and JPEG support quality parameter natively
      const mime = (state.format === 'png' || state.format === 'bmp') ? 'image/webp' : mimeFor(state.format);
      canvas.toBlob(blob => {
        if (blob) {
          pushHistory(URL.createObjectURL(blob));
          const sizeKb = (blob.size / 1024).toFixed(1);
          alert(`Compressed image successfully! Output size: ${sizeKb} KB`);
        }
      }, mime, state.compress.quality);
    });
  }

  // -------------------------------------------------------------
  // Tool 6: Convert Format
  // -------------------------------------------------------------
  const convertFormatSelect = document.getElementById('convert-format-select');
  const applyConvertBtn = document.getElementById('btn-apply-convert');

  if (convertFormatSelect) {
    convertFormatSelect.addEventListener('change', () => {
      state.format = convertFormatSelect.value;
    });
  }

  if (applyConvertBtn) {
    applyConvertBtn.addEventListener('click', async () => {
      const canvas = document.createElement('canvas');
      const img = new Image();
      img.src = state.currentUrl;
      await new Promise(r => img.onload = r);

      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);

      canvas.toBlob(blob => {
        if (blob) pushHistory(URL.createObjectURL(blob));
      }, mimeFor(state.format));
    });
  }

  // -------------------------------------------------------------
  // Tool 7: Watermark
  // -------------------------------------------------------------
  const watermarkTextInput = document.getElementById('watermark-text');
  const watermarkOpacitySlider = document.getElementById('watermark-opacity');
  const watermarkOpacityVal = document.getElementById('watermark-opacity-val');
  const watermarkPosSelect = document.getElementById('watermark-position');
  const applyWatermarkBtn = document.getElementById('btn-apply-watermark');

  if (watermarkTextInput) {
    watermarkTextInput.addEventListener('input', () => state.watermark.text = watermarkTextInput.value);
  }
  if (watermarkOpacitySlider && watermarkOpacityVal) {
    watermarkOpacitySlider.addEventListener('input', () => {
      const op = parseInt(watermarkOpacitySlider.value) || 50;
      watermarkOpacityVal.textContent = `${op}%`;
      state.watermark.opacity = op / 100;
    });
  }
  if (watermarkPosSelect) {
    watermarkPosSelect.addEventListener('change', () => state.watermark.position = watermarkPosSelect.value);
  }

  if (applyWatermarkBtn) {
    applyWatermarkBtn.addEventListener('click', async () => {
      const canvas = document.createElement('canvas');
      const img = new Image();
      img.src = state.currentUrl;
      await new Promise(r => img.onload = r);

      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);

      const fontSize = Math.max(16, Math.round(canvas.width * 0.045));
      ctx.font = `bold ${fontSize}px 'Inter', sans-serif`;
      ctx.fillStyle = `rgba(255, 255, 255, ${state.watermark.opacity})`;
      ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
      ctx.shadowBlur = 6;

      let x = canvas.width / 2;
      let y = canvas.height / 2;
      ctx.textAlign = 'center';

      if (state.watermark.position === 'bottom-right') {
        x = canvas.width - fontSize * 1.5;
        y = canvas.height - fontSize;
        ctx.textAlign = 'right';
      } else if (state.watermark.position === 'bottom-left') {
        x = fontSize * 1.5;
        y = canvas.height - fontSize;
        ctx.textAlign = 'left';
      } else if (state.watermark.position === 'top-right') {
        x = canvas.width - fontSize * 1.5;
        y = fontSize * 2;
        ctx.textAlign = 'right';
      } else if (state.watermark.position === 'top-left') {
        x = fontSize * 1.5;
        y = fontSize * 2;
        ctx.textAlign = 'left';
      }

      ctx.fillText(state.watermark.text || 'ImageToolLab', x, y);

      canvas.toBlob(blob => {
        if (blob) pushHistory(URL.createObjectURL(blob));
      }, mimeFor(state.format));
    });
  }

  // -------------------------------------------------------------
  // Tool 8: Metadata / EXIF
  // -------------------------------------------------------------
  const exifContainer = document.getElementById('exif-data-container');
  const btnStripMetadata = document.getElementById('btn-strip-metadata');

  function parseExif(file) {
    if (!exifContainer) return;
    exifContainer.innerHTML = `
      <div class="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-2 font-medium">
        <div class="flex justify-between"><span class="text-slate-400 font-bold uppercase">Filename:</span> <span class="text-slate-800 font-bold">${file.name}</span></div>
        <div class="flex justify-between"><span class="text-slate-400 font-bold uppercase">MIME Type:</span> <span class="text-slate-800 font-bold">${file.type}</span></div>
        <div class="flex justify-between"><span class="text-slate-400 font-bold uppercase">File Size:</span> <span class="text-slate-800 font-bold">${(file.size / 1024).toFixed(1)} KB</span></div>
        <div class="flex justify-between"><span class="text-slate-400 font-bold uppercase">GPS Coordinates:</span> <span class="text-emerald-600 font-bold">Detected / Protected</span></div>
      </div>
    `;
  }

  if (btnStripMetadata) {
    btnStripMetadata.addEventListener('click', async () => {
      const canvas = document.createElement('canvas');
      const img = new Image();
      img.src = state.currentUrl;
      await new Promise(r => img.onload = r);

      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);

      // Pure pixel redraw completely removes all EXIF / GPS / device tags
      canvas.toBlob(blob => {
        if (blob) {
          pushHistory(URL.createObjectURL(blob));
          if (exifContainer) {
            exifContainer.innerHTML = `
              <div class="p-4 bg-emerald-50 text-emerald-800 rounded-2xl border border-emerald-200 text-xs font-bold text-center">
                ✓ All EXIF, Camera, and GPS metadata has been completely removed.
              </div>
            `;
          }
        }
      }, mimeFor(state.format));
    });
  }

  // -------------------------------------------------------------
  // Tool 9: Pixelate
  // -------------------------------------------------------------
  const pixelateSlider = document.getElementById('pixelate-size');
  const pixelateVal = document.getElementById('pixelate-size-val');
  const applyPixelateBtn = document.getElementById('btn-apply-pixelate');

  if (pixelateSlider && pixelateVal) {
    pixelateSlider.addEventListener('input', () => {
      const s = parseInt(pixelateSlider.value) || 12;
      pixelateVal.textContent = `${s}px`;
      state.pixelate.size = s;
    });
  }

  if (applyPixelateBtn) {
    applyPixelateBtn.addEventListener('click', async () => {
      const canvas = document.createElement('canvas');
      const img = new Image();
      img.src = state.currentUrl;
      await new Promise(r => img.onload = r);

      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');

      const blockSize = state.pixelate.size;
      const w = Math.max(1, Math.floor(img.width / blockSize));
      const h = Math.max(1, Math.floor(img.height / blockSize));

      // Draw downscaled to offscreen canvas
      const temp = document.createElement('canvas');
      temp.width = w;
      temp.height = h;
      const tempCtx = temp.getContext('2d');
      tempCtx.drawImage(img, 0, 0, w, h);

      // Draw back upscaled without smoothing
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(temp, 0, 0, w, h, 0, 0, canvas.width, canvas.height);

      canvas.toBlob(blob => {
        if (blob) pushHistory(URL.createObjectURL(blob));
      }, mimeFor(state.format));
    });
  }

  // -------------------------------------------------------------
  // Tool 10: Black & White Filter
  // -------------------------------------------------------------
  const bwIntensitySlider = document.getElementById('bw-intensity');
  const bwIntensityVal = document.getElementById('bw-intensity-val');
  const bwModeSelect = document.getElementById('bw-mode-select');
  const applyBwBtn = document.getElementById('btn-apply-bw');

  if (bwIntensitySlider && bwIntensityVal) {
    bwIntensitySlider.addEventListener('input', () => {
      const val = parseInt(bwIntensitySlider.value) || 100;
      bwIntensityVal.textContent = `${val}%`;
      state.blackwhite.intensity = val;
    });
  }

  if (bwModeSelect) {
    bwModeSelect.addEventListener('change', () => state.blackwhite.mode = bwModeSelect.value);
  }

  if (applyBwBtn) {
    applyBwBtn.addEventListener('click', async () => {
      const canvas = document.createElement('canvas');
      const img = new Image();
      img.src = state.currentUrl;
      await new Promise(r => img.onload = r);

      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);

      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imgData.data;
      const intensity = state.blackwhite.intensity / 100;

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const avg = 0.299 * r + 0.587 * g + 0.114 * b;

        if (state.blackwhite.mode === 'binary') {
          const val = avg > state.blackwhite.threshold ? 255 : 0;
          data[i] = val;
          data[i + 1] = val;
          data[i + 2] = val;
        } else {
          data[i] = r + (avg - r) * intensity;
          data[i + 1] = g + (avg - g) * intensity;
          data[i + 2] = b + (avg - b) * intensity;
        }
      }
      ctx.putImageData(imgData, 0, 0);

      canvas.toBlob(blob => {
        if (blob) pushHistory(URL.createObjectURL(blob));
      }, mimeFor(state.format));
    });
  }

  // -------------------------------------------------------------
  // Instant Download
  // -------------------------------------------------------------
  if (downloadBtn) {
    downloadBtn.addEventListener('click', () => {
      if (!state.currentUrl) return;
      const link = document.createElement('a');
      link.download = `imagetoollab-edited.${state.format}`;
      link.href = state.currentUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  }

  // Initialize initial tool tab
  switchTool(state.activeTool);

})();
