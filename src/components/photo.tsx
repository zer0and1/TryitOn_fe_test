import { useAppStore } from "@/store";
import { ImageType } from "@/types";
import { PencilSquareIcon, CloudArrowUpIcon } from "@heroicons/react/20/solid";
import Image from "next/image";

export default function Photo({ id, src, request }: ImageType) {
  const { setSelectedId, openModal } = useAppStore();

  const handleEdit = () => {
    setSelectedId(id);
    openModal(true, "edit");
  };

  const handleRequestEdit = () => {
    setSelectedId(id);
    openModal(true, "request");
  };

  return (
    <div>
      <div className="relative">
        <div className="relative h-72 w-full overflow-hidden rounded-lg">
          <Image
            fill
            src={src}
            alt={src}
            sizes="(max-width: 768px) 100vw,
              (max-width: 1200px) 50vw,
              33vw"
            className="h-full w-full object-cover object-center"
            priority
          />
        </div>
        <div className="absolute inset-x-0 top-0 flex h-72 items-end justify-end overflow-hidden rounded-lg p-4">
          <div
            aria-hidden="true"
            className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-black opacity-80"
          />
          <div className="flex items-center z-10">
            <span className="mr-1 font-semibold text-white">{request}</span>
            <span className="relative flex h-8 w-8 items-center justify-center rounded-full bg-black font-semibold text-white">
              <span>{id}</span>
            </span>
          </div>
        </div>
      </div>
      <div className="mt-2 flex justify-between space-x-2">
        <button
          type="button"
          onClick={handleEdit}
          className="inline-flex flex-1 items-center justify-center gap-x-2 rounded-lg bg-green-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
        >
          <PencilSquareIcon className="-ml-0.5 h-5 w-5" aria-hidden="true" />
          Edit
        </button>
        <button
          type="button"
          onClick={handleRequestEdit}
          className="inline-flex flex-1 items-center justify-center gap-x-2 rounded-lg bg-green-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
        >
          <CloudArrowUpIcon className="-ml-0.5 h-5 w-5" aria-hidden="true" />
          Request Edit
        </button>
      </div>
    </div>
  );
}
