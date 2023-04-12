import { ImageType } from "@/types";
import { StateCreator } from "zustand";

export interface PhotoSlice {
  isLoading: boolean;
  isModalOpen: boolean;
  modalType: string,
  photos: ImageType[];
  selectedId: number;
  fetchPhotos: () => void;
  setSelectedId: (id: number) => void;
  getSelectedPhotoUrl: () => string;
  getSelectedPhotoRequest: () => string;
  updatePhoto: (dataUrl: string) => void;
  updateRequest: (request: string) => void;
  openModal: (isOpen: boolean, type: string) => void;
}

export const createPhotoSlice: StateCreator<PhotoSlice> = (set, get) => ({
  isLoading: true,
  isModalOpen: false,
  modalType: "edit",
  selectedId: -1,
  photos: [] as ImageType[],
  fetchPhotos: async () => {
    const res = await fetch("/api/photos");
    const photos = await res.json();
    set({ isLoading: false, photos: photos });
  },
  setSelectedId: (id: number) => {
    set({ selectedId: id });
  },
  getSelectedPhotoUrl: () => {
    const selectedId = get().selectedId;
    if (selectedId == -1) {
      return "";
    }
    const photos = get().photos;
    const photo = photos[selectedId - 1];
    return photo.src;
  },
  getSelectedPhotoRequest: () => {
    const selectedId = get().selectedId;
    if (selectedId == -1) {
      return "";
    }
    const photos = get().photos;
    const photo = photos[selectedId - 1];
    return photo.request;
  },
  openModal: (isOpen: boolean, type: string) => {
    set({ isModalOpen: isOpen, modalType: type });
  },
  updatePhoto: (dataUrl: string) => {
    const index = get().selectedId - 1;
    const photos = [...get().photos];
    photos[index].src = dataUrl;
    set({photos: photos});
  },
  updateRequest: (request: string) => {
    const index = get().selectedId - 1;
    const photos = [...get().photos];
    photos[index].request = request;
    set({photos: photos});
  }
});
