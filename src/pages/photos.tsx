import Photo from "@/components/photo";
import { useAppStore } from "@/store";
import { useEffect } from "react";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import dynamic from "next/dynamic";

const Editor = dynamic(() => import("@/components/editor"), {
  ssr: false,
});

export default function Photos() {
  const { photos, fetchPhotos } = useAppStore();

  useEffect(() => {
    fetchPhotos();
  }, []);

  return (
    <div className="bg-white">
      <ToastContainer />
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <h2 className="text-2xl font-bold text-gray-900">Gallery</h2>
        <Editor />
        <div className="mt-8 grid grid-cols-1 gap-y-12 sm:grid-cols-2 sm:gap-x-6 lg:grid-cols-4 xl:gap-x-8">
          {photos.map((photo) => (
            <Photo key={photo.id} id={photo.id} src={photo.src} request={photo.request} />
          ))}
        </div>
      </div>
    </div>
  );
}
