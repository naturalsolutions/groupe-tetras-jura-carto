"use client";

import "maplibre-gl/dist/maplibre-gl.css";
import * as React from "react";
import { useRef, useCallback } from "react";
import Map, {
  NavigationControl,
  GeolocateControl,
  Source,
  Layer,
  MapRef,
} from "react-map-gl/maplibre";
import { useViewState, useMapStoreActions } from "@/app/lib/stores/mapStore";
import ControlPanel from "@/app/components/control-panel";

export default function MapPage() {
  const mapRef = useRef<MapRef | null>(null);
  const viewState = useViewState();
  const { setViewState } = useMapStoreActions();

  const IGNSource = {
    type: "raster",
    tiles: [
      `https://data.geopf.fr/wms-r/wms?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&BBOX={bbox-epsg-3857}&CRS=EPSG:3857&WIDTH=663&HEIGHT=836&LAYERS=GEOGRAPHICALGRIDSYSTEMS.PLANIGNV2&STYLES=&FORMAT=image/jpeg&DPI=96&MAP_RESOLUTION=96&FORMAT_OPTIONS=dpi:96`,
    ],
    tileSize: 256,
  };

  const onSelectZone = useCallback(
    ({
      longitude,
      latitude,
      zoom,
    }: {
      longitude: number;
      latitude: number;
      zoom: number;
    }) => {
      mapRef.current?.flyTo({
        center: [longitude, latitude],
        duration: 2000,
        zoom: zoom,
      });
    },
    []
  );

  return (
    <div style={{ position: "fixed", top: 0, bottom: 0, left: 0, right: 0 }}>
      <Map
        ref={mapRef}
        {...viewState}
        onMove={(evt) => setViewState(evt.viewState)}
        style={{ width: "100%", height: "100%" }}
        // mapStyle={`https://api.maptiler.com/maps/streets/style.json?key=${process.env.NEXT_PUBLIC_MAPTILER_API_KEY}`}
        interactiveLayerIds={["appb-zones-layer"]}
      >
        <Source id="ign-source" {...IGNSource} type="raster">
          <Layer
            id="ign-layer"
            type="raster"
            source="ign-source"
            paint={{ "raster-opacity": 1.0 }}
          />
        </Source>

        <ControlPanel onSelectZone={onSelectZone} />
        <NavigationControl position="top-right" />
        <GeolocateControl position="top-right" />
      </Map>
    </div>
  );
}