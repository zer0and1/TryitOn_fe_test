import create from "zustand";
import { PhotoSlice, createPhotoSlice } from "./slices/photoSlice";

type StoreState = PhotoSlice;

export const useAppStore = create<StoreState>()((...data) => ({
  ...createPhotoSlice(...data),
}));
