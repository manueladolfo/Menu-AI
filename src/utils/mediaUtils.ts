/**
 * Utilidades para procesamiento multimedia en el navegador (fotos y vídeos).
 */

/**
 * Lee un archivo (foto o vídeo) y lo convierte a Base64.
 */
export function readFileAsBase64(file: File): Promise<{ base64: string; mimeType: string; name: string }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target?.result as string;
      resolve({
        base64,
        mimeType: file.type || 'image/jpeg',
        name: file.name,
      });
    };
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}

/**
 * Extrae fotogramas clave de un archivo de vídeo HTML5 usando canvas.
 * Devuelve un array de strings base64 (image/jpeg) optimizados para visión con IA.
 */
export async function extractVideoFrames(videoFile: File, frameCount: number = 4): Promise<string[]> {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    video.preload = 'metadata';
    video.muted = true;
    video.playsInline = true;
    const url = URL.createObjectURL(videoFile);
    video.src = url;

    // Timeout de seguridad en caso de que el codec no sea soportado por el navegador
    const timer = setTimeout(() => {
      URL.revokeObjectURL(url);
      reject(new Error('Tiempo de espera agotado al cargar el vídeo. Comprueba el formato del archivo.'));
    }, 15000);

    video.onloadedmetadata = async () => {
      try {
        const duration = video.duration;
        if (!duration || isNaN(duration)) {
          clearTimeout(timer);
          URL.revokeObjectURL(url);
          reject(new Error('No se pudo calcular la duración del vídeo.'));
          return;
        }

        const frames: string[] = [];
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        // Puntos porcentuales estratégicos (ingredientes, inicio elaboración, punto medio, emplatado final)
        const targetPercentages = [0.15, 0.45, 0.75, 0.92];
        const selectedPercentages = targetPercentages.slice(0, frameCount);

        // Limitar dimensiones para optimizar memoria, rapidez y tokens de la IA
        const maxDim = 800;
        let width = video.videoWidth || 640;
        let height = video.videoHeight || 360;
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }
        canvas.width = width;
        canvas.height = height;

        for (const pct of selectedPercentages) {
          const time = Math.max(0.1, Math.min(duration - 0.1, duration * pct));
          await new Promise<void>((resSeek) => {
            const onSeeked = () => {
              video.removeEventListener('seeked', onSeeked);
              if (ctx) {
                ctx.drawImage(video, 0, 0, width, height);
                const dataUrl = canvas.toDataURL('image/jpeg', 0.82);
                frames.push(dataUrl);
              }
              resSeek();
            };
            video.addEventListener('seeked', onSeeked);
            video.currentTime = time;
          });
        }

        clearTimeout(timer);
        URL.revokeObjectURL(url);
        resolve(frames);
      } catch (err) {
        clearTimeout(timer);
        URL.revokeObjectURL(url);
        reject(err);
      }
    };

    video.onerror = () => {
      clearTimeout(timer);
      URL.revokeObjectURL(url);
      reject(new Error('No se pudo procesar el vídeo. Asegúrate de que sea un archivo de vídeo válido (MP4, WebM o MOV).'));
    };
  });
}
