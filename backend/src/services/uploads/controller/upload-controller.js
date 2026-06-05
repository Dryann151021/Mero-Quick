import ClientError from '../../../exceptions/client-error.js';
import response from '../../../utils/response.js';
import path from 'path';
import fs from 'fs';

export const UPLOAD_FOLDER = path.resolve(
  process.cwd(),
  'src/services/uploads/files/images'
);

if (!fs.existsSync(UPLOAD_FOLDER)) {
  fs.mkdirSync(UPLOAD_FOLDER, { recursive: true });
}

export const uploadImages = async (c) => {
  const body = await c.req.parseBody();
  const file = body.image; // Expecting field name 'image'

  if (!file || !(file instanceof File)) {
    throw new ClientError('No file uploaded or invalid file format');
  }

  // Limit file size to 5MB
  if (file.size > 5 * 1024 * 1024) {
    throw new ClientError('File size exceeds 5MB limit');
  }

  // Limit type to image
  if (!file.type.startsWith('image/')) {
    throw new ClientError('Only image files are allowed');
  }

  const host = process.env.HOST || 'localhost';
  const port = process.env.PORT || 3000;

  const ext = path.extname(file.name);
  const filename = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}${ext}`;
  const filepath = path.join(UPLOAD_FOLDER, filename);

  const bytes = await file.arrayBuffer();
  await Bun.write(filepath, bytes);

  const encodedFilename = encodeURIComponent(filename);
  const fileLocation = `http://${host}:${port}/uploads/${encodedFilename}`;

  return response(c, 201, 'Upload success', { fileLocation });
};
