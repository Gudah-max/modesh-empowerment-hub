import { pageMetadata } from '@/lib/metadata';
import { galleryItems } from '@/lib/content/gallery';
import '../training.css';
import '../institution.css';
import { GalleryView } from '@/components/GalleryView';

export const metadata = pageMetadata('/gallery', 'Gallery', 'Explore photographs of baking, decorated cakes and activities at Modesh Empowerment Hub.');

export default function GalleryPage() {
  return <GalleryView items={galleryItems} />;
}
