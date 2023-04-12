// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import photos from '@/mock/photos.json';
import { ImageType } from '@/types';
import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ImageType[]>
) {
  res.status(200).json(photos as ImageType[]);
}
