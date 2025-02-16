import { StateCreator, create } from "zustand";
import { Dayjs } from "dayjs";
import {
  MapFiltersState,
  TransportType,
  Zone,
} from "@/app/lib/types/mapFilters";

export const initialMapFiltersState = {
  selectedZones: [],
  selectedTransport: null,
  selectedDate: null,
  currentStep: 0,
  showMultiStepForm: false,
  maptilerMapId: null,
};

export const stateCreator: StateCreator<MapFiltersState> = (set) => ({
  ...initialMapFiltersState,
  actions: {
    setSelectedZones: (zone: Zone) =>
      set((state) => {
        const isZoneSelected = state.selectedZones.includes(zone);
        return {
          selectedZones: isZoneSelected
            ? state.selectedZones.filter((z) => z !== zone)
            : [...state.selectedZones, zone],
        };
      }),
    setSelectedTransport: (transport: TransportType) =>
      set({ selectedTransport: transport }),
    setSelectedDate: (date: Dayjs | null) => set({ selectedDate: date }),
    setCurrentStep: (step: number) => set({ currentStep: step }),
    setShowMultiStepForm: (value: boolean) => set({ showMultiStepForm: value }),
    setMaptilerMapId: (mapId: string) => set({ maptilerMapId: mapId }),
    clearMapFilters: () => set(initialMapFiltersState),
  },
});

export const useMapFilters = create<MapFiltersState>()(stateCreator);

// GETTERS
export const useMapFiltersSelectedZones = () =>
  useMapFilters((state) => state.selectedZones);

export const useMapFiltersSelectedTransport = () =>
  useMapFilters((state) => state.selectedTransport);

export const useMaptilerMapId = () =>
  useMapFilters((state) => {
    switch (state.selectedTransport) {
      case TransportType.CAR:
        return "streets-v2";
      case TransportType.OUTDOOR:
        return state?.maptilerMapId || "outdoor-v2";
      default:
        return "landscape";
    }
  });

export const useMapFiltersSelectedDate = () =>
  useMapFilters((state) => state.selectedDate);

export const useMapFiltersActions = () =>
  useMapFilters((state) => state.actions);

export const useMapFiltersCurrentStep = () =>
  useMapFilters((state) => state.currentStep);

export const useMapFiltersShowMultiStepForm = () =>
  useMapFilters((state) => state.showMultiStepForm);
