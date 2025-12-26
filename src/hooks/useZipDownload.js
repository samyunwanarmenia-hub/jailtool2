import { useState } from 'react';
import JSZip from 'jszip';

const ZIP_SIZE_BYTES = 15 * 1024 * 1024; // 15 МБ
const RANDOM_FILE_NAME = 'random.bin';

export const useZipDownload = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  
  const showToast = (message) => {
    if (window.showToast) {
      window.showToast(message);
    } else {
      console.log('[Toast]', message);
    }
  };

  const generateRandomBytes = (size) => {
    console.log(`[ZIP] Генерация ${size} байт случайных данных...`);
    const MAX_CHUNK_SIZE = 65536;
    const buffer = new Uint8Array(size);
    let offset = 0;
    const totalChunks = Math.ceil(size / MAX_CHUNK_SIZE);
    let currentChunk = 0;
    
    while (offset < size) {
      currentChunk++;
      const sliceSize = Math.min(MAX_CHUNK_SIZE, size - offset);
      const slice = crypto.getRandomValues(new Uint8Array(sliceSize));
      buffer.set(slice, offset);
      offset += sliceSize;
      
      if (currentChunk % Math.max(1, Math.floor(totalChunks / 10)) === 0) {
        const progress = Math.round((offset / size) * 100);
        console.log(`[ZIP] Прогресс генерации данных: ${progress}%`);
      }
    }
    
    console.log(`[ZIP] Генерация данных завершена: ${buffer.length} байт`);
    return buffer;
  };

  const buildZip = async () => {
    console.log('[ZIP] Начало создания архива...');
    showToast('Создаем архив...');

    const zip = new JSZip();
    console.log('[ZIP] Экземпляр JSZip создан');
    
    console.log('[ZIP] Начало генерации случайных данных...');
    showToast('Генерируем случайные данные...');
    const randomData = generateRandomBytes(ZIP_SIZE_BYTES);
    
    console.log('[ZIP] Добавление файлов в архив...');
    showToast('Упаковываем в ZIP...');
    zip.file(RANDOM_FILE_NAME, randomData);
    zip.file('meta.txt', [
      'ios 18 Jailbreak Tool - Client Generated Archive',
      `Generated at: ${new Date().toISOString()}`,
      `Size: ${ZIP_SIZE_BYTES} bytes`,
      `Random data file: ${RANDOM_FILE_NAME}`
    ].join('\n'));

    console.log('[ZIP] Генерация архива в Blob...');
    showToast('Финальная обработка...');
    const startTime = performance.now();
    const blob = await zip.generateAsync({
      type: 'blob',
      compression: 'DEFLATE',
      compressionOptions: { level: 6 }
    });
    const endTime = performance.now();
    console.log(`[ZIP] Архив создан за ${(endTime - startTime).toFixed(2)}мс, размер: ${blob.size} байт`);
    
    return blob;
  };

  const downloadBlob = (blob, filename) => {
    console.log(`[ZIP] Начало скачивания файла: ${filename}, размер: ${blob.size} байт`);
    const url = URL.createObjectURL(blob);
    const tempLink = document.createElement('a');
    tempLink.href = url;
    tempLink.download = filename;
    tempLink.style.display = 'none';
    document.body.appendChild(tempLink);
    console.log('[ZIP] Клик по временной ссылке для скачивания...');
    tempLink.click();
    
    setTimeout(() => {
      document.body.removeChild(tempLink);
      URL.revokeObjectURL(url);
      console.log('[ZIP] Временная ссылка удалена');
    }, 100);
  };

  const handleDownload = async (e) => {
    e.preventDefault();
    console.log('[ZIP] Клик по кнопке скачивания');
    
    if (isGenerating) {
      console.warn('[ZIP] Кнопка уже заблокирована, игнорируем клик');
      return;
    }
    
    setIsGenerating(true);

    try {
      showToast('Начинаем генерацию архива 15 МБ...');
      const blob = await buildZip();
      downloadBlob(blob, 'ios_18_jailbreak_tool.ipa');
      showToast('Архив готов! Скачивание началось.');
      console.log('[ZIP] Успешно: архив создан и скачивание началось');
    } catch (error) {
      const errorMsg = error.message || 'Не удалось создать архив';
      console.error('[ZIP] Ошибка при создании архива:', error);
      console.error('[ZIP] Стек ошибки:', error.stack);
      showToast('Ошибка: ' + errorMsg);
    } finally {
      setIsGenerating(false);
      console.log('[ZIP] Кнопка разблокирована');
    }
  };

  return { handleDownload, isGenerating };
};