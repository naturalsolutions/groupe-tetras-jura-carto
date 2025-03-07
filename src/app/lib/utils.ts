import {
  AuthorizedPathProperties,
  AuthorizedPathsCollection,
  GeoJSONFeature,
} from "@/app/lib/types/GeoJSON";
import { Zone } from "./types/mapFilters";
import dayjs, { Dayjs } from "dayjs";
import { bbox } from "@turf/bbox";
import { FeatureCollection, Geometry } from "geojson";
import { GeoJSONFeatureProperties } from "@/app/lib/types/generics";
import { IAPPBZone } from "@/app/lib/types/GeoJSON";

/**
 * Filters GeoJSON features based on transport mode, zones, and date
 * @param geojsonData The input GeoJSON data
 * @param modeTransport The transport mode to filter by
 * @param zoneNames The zones to filter by
 * @param selectedDate The selected date to filter by
 * @returns Filtered GeoJSON containing only features matching the criteria
 */
export function filterAuthorizedPathsData(
  geojsonData: AuthorizedPathsCollection,
  modeTransport: string | null,
  zoneNames: Zone[],
  selectedDate: string | null
): AuthorizedPathsCollection {
  if (!geojsonData || !geojsonData.features)
    return { type: "FeatureCollection", features: [] };

  const isTransportActive = modeTransport !== null;
  // const isZoneActive = zoneNames.length > 0;
  const isDateActive = selectedDate !== null;

  let selectedDay: number, selectedMonth: number;
  if (isDateActive && selectedDate) {
    const date = dayjs(selectedDate);
    selectedDay = date.date();
    selectedMonth = date.month() + 1;
  }

  // const zoneSet = new Set(zoneNames);

  return {
    type: "FeatureCollection",
    features: geojsonData.features.filter(
      (
        feature: GeoJSONFeature<
          AuthorizedPathProperties,
          { type: "LineString"; coordinates: [number, number][] }
        >
      ) => {
        if (isTransportActive) {
          const featureTransport = feature.properties.mode_transport;
          if (
            featureTransport !== modeTransport &&
            featureTransport !== "all"
          ) {
            return false;
          }
        }
        // if (isZoneActive && !zoneSet.has(feature.properties.zone_names as Zone))
          // return false;

        if (isDateActive) {
          const { Période_autorisation } = feature.properties;
          if (Période_autorisation) {
            return isDateInPeriod(
              selectedDay,
              selectedMonth,
              Période_autorisation
            );
          }
        }

        return true;
      }
    ),
  };
}

function isDateInPeriod(day: number, month: number, period: string): boolean {
  // Convert period to lowercase
  const periodLower = period.toLowerCase();

  // check if period is between 15/12 - 14/05
  if (periodLower.includes("du 15/12 au 14/05")) {
    return (
      (month === 12 && day >= 15) || // Du 15 au 31 décembre
      (month >= 1 && month <= 4) || // De janvier à avril
      (month === 5 && day <= 14) // Du 1er au 14 mai
    );
  }
  // check if period is between 15/12 - 30/06
  if (periodLower.includes("du 15/12 au 30/06")) {
    return (
      (month === 12 && day >= 15) ||
      (month >= 1 && month <= 5) ||
      (month === 6 && day <= 30)
    );
  }

  // check if period is between 15/05 - 30/06
  if (periodLower.includes("du 15/05 au 30/06")) {
    return (month === 5 && day >= 15) || month === 6; // Du 15 au 31 mai ou tout le mois de juin
  }

  // check if period is between 15/12 - 01 sunday of march
  if (periodLower.includes("du 15/12 au 1er dimanche de mars")) {
    if (month === 12 && day >= 15) return true; // Du 15 au 31 décembre
    if (month === 1 || month === 2) return true; // Janvier et février complets
    if (month === 3) {
      // Calculer le premier dimanche de mars pour l'année en cours
      const year = new Date().getFullYear();
      const firstDayOfMarch = new Date(year, 2, 1);
      const daysUntilSunday = (7 - firstDayOfMarch.getDay()) % 7;
      const firstSundayOfMarch = daysUntilSunday + 1;

      return day <= firstSundayOfMarch;
    }
    return false;
  }

  // Si aucune période spécifique n'est reconnue, return true
  return true;
}

export function addColorsToFeatures(
  geojsonData: AuthorizedPathsCollection
): AuthorizedPathsCollection {
  return {
    ...geojsonData,
    features: geojsonData.features.map((feature) => {
      const period =
        feature.properties["Période_autorisation"]?.toLowerCase() || "";

      let color = "#000"; // Default color (black) if no period matches
      let dashed = false;
      if (period.includes("du 15/12 au 14/05")) {
        color = "#084aff";
        dashed = true;
      } else if (period.includes("du 15/12 au 30/06")) {
        color = "#084aff";
        dashed = false;
      } else if (period.includes("du 15/05 au 30/06")) {
        color = "#ed9e00";
        dashed = false;
      } else if (period.includes("du 15/12 au 1er dimanche de mars")) {
        color = "#ff0000";
        dashed = false;
      } else if (period.includes("non reglemente par l'appb")) {
        color = "#ff0000";
        dashed = true;
      } else if (
        period.includes("si deneigé") ||
        period.includes("si déneigé")
      ) {
        color = "#9E9E9E";
        dashed = false; // Magenta pour les itinéraires autorisés sur les 3 périodes
      } else {
        dashed = false;
        console.log(
          "Période non reconnue :",
          feature.properties["Période_autorisation"]
        );
      }

      return {
        ...feature,
        properties: {
          ...feature.properties,
          color, // Add the color property
          dashed,
        },
      };
    }),
  };
}

/**
 * Checks if a given date falls within the authorized period (July 1st to December 14th)
 * During this period, access is allowed on all marked trails and will disturb the least Grand Tétras
 * @param selectedDate The date to check, as a Dayjs object
 * @returns true if the date is within the authorized period, false otherwise
 */
export function checkAuthorizedDate(selectedDate: Dayjs): boolean {
  const month = selectedDate?.month() ?? -1;
  const day = selectedDate?.date() ?? -1;

  return (
    (month === 6 && day >= 1) || // July
    (month > 6 && month < 11) || // August through November
    (month === 11 && day <= 14)
  ); // December 1-14
  // return selectedDate?.isBetween("2024-06-15", "2024-07-01") ?? false;
}

/**
 * Filters features from a GeoJSON based on zone names
 * @param geojson The GeoJSON to filter
 * @param zoneNames Array of zone names to filter by
 * @returns GeoJSON with only features matching the zone names
 */
export function filterFeaturesByZones<
  P extends GeoJSONFeatureProperties & IAPPBZone,
  G extends Geometry = Geometry
>(
  geojson: FeatureCollection<G, P>,
  zoneNames: string[]
): FeatureCollection<G, P> {
  /*   console.log("zoneNames CHECK2 :", zoneNames instanceof Array); */
  if (zoneNames.length === 0) return geojson;
  const filteredFeatures = geojson.features.filter((feature) =>
    zoneNames.includes(feature.properties?.name as string)
  );
  return {
    type: "FeatureCollection",
    features: filteredFeatures,
  };
}

/**
 * Gets the bounding box of a GeoJSON
 * @param geojson The GeoJSON to get bounds for
 * @returns Bounding box as [minLng, minLat, maxLng, maxLat]
 */
export function getFeaturesBoundingBox<
  P extends GeoJSONFeatureProperties = GeoJSONFeatureProperties,
  G extends Geometry = Geometry
>(geojson: FeatureCollection<G, P>): number[] {
  return bbox(geojson);
}
/**
 * Filters features by zones and returns their bounding box
 * @param geojson The GeoJSON to process
 * @param zoneNames Array of zone names to filter by
 * @returns Bounding box of filtered features as [minLng, minLat, maxLng, maxLat]
 */
export function getZonesBoundingBox<
  P extends GeoJSONFeatureProperties & IAPPBZone,
  G extends Geometry = Geometry
>(geojson: FeatureCollection<G, P>, zoneNames: string[]): number[] {
  const filteredFeatures = filterFeaturesByZones(geojson, zoneNames);
  return getFeaturesBoundingBox(filteredFeatures);
}

// function to know is user is on ios device
export const isIOS = () => {
  return (
    /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    // iPad on iOS 13+ detection
    (navigator.userAgent.includes("Mac") && "ontouchend" in document)
  );
};
