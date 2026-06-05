import InvariantError from '../../../exceptions/invariant-error.js';
import response from '../../../utils/response.js';
import path from 'path';
import fs from 'fs';
import logger from '../../../config/logger.js';
import RequestEntityTooLargeError from '../../../exceptions/request-entity-too-large.js';

export const UPLOAD_FOLDER = path.resolve(
  process.cwd(),
  'src/services/uploads/files/images'
);

if (!fs.existsSync(UPLOAD_FOLDER)) {
  fs.mkdirSync(UPLOAD_FOLDER, { recursive: true });
}

export const uploadImages = async (c) => {
  const body = await c.req.parseBody();
  const file = body.image;

  if (!file || !(file instanceof File)) {
    throw new InvariantError(
      'File tidak ditemukan atau format file tidak valid'
    );
  }

  if (file.size > 5 * 1024 * 1024) {
    throw new RequestEntityTooLargeError('Ukuran file melebihi batas 5MB');
  }

  if (!file.type.startsWith('image/')) {
    throw new InvariantError('Hanya file gambar yang diperbolehkan');
  }

  const ext = path.extname(file.name);
  const filename = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}${ext}`;

  const { SUPABASE_KEY, BUCKET_URL, BUCKET_NAME } = process.env;

  if (SUPABASE_KEY && BUCKET_URL) {
    try {
      const match = BUCKET_URL.match(
        /https:\/\/([^.]+)\.storage\.supabase\.co/
      );
      const projectRef = match ? match[1] : null;

      if (projectRef && BUCKET_NAME) {
        const baseUrl = `https://${projectRef}.supabase.co/storage/v1/object`;
        const uploadUrl = `${baseUrl}/${BUCKET_NAME}/${filename}`;
        const bytes = await file.arrayBuffer();

        const uploadRes = await fetch(uploadUrl, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${SUPABASE_KEY}`,
            apikey: SUPABASE_KEY,
            'Content-Type': file.type,
          },
          body: bytes,
        });

        if (uploadRes.ok) {
          const fileLocation = `${baseUrl}/public/${BUCKET_NAME}/${filename}`;
          return response(c, 201, 'Upload success (Supabase)', {
            fileLocation,
          });
        } else {
          const errText = await uploadRes.text();
          logger.error('Failed to upload to Supabase Storage:', errText);
        }
      }
    } catch (err) {
      logger.error('Error uploading to Supabase, falling back to local:', err);
    }
  }

  // local fallback
  const host = process.env.HOST;
  const port = process.env.PORT;
  const filepath = path.join(UPLOAD_FOLDER, filename);

  const bytes = await file.arrayBuffer();
  await Bun.write(filepath, bytes);

  const encodedFilename = encodeURIComponent(filename);
  const fileLocation = `http://${host}:${port}/uploads/${encodedFilename}`;

  return response(c, 201, 'Upload success (Local)', { fileLocation });
};
