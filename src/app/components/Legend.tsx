import Image from "next/image";
import { Box, useMediaQuery, useTheme, IconButton } from "@mui/material";
import { CSSProperties, useState, useEffect, useRef } from "react";
import MapIcon from "@mui/icons-material/Map";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

import Typography from "@mui/material/Typography";
import LayersIcon from "@mui/icons-material/Layers";
import CheckIcon from "@mui/icons-material/Check";
import {
  useActiveMapBackground,
  useMapFiltersActions,
  useMaptilerMapId,
} from "@/app/lib/stores/mapFilters";
import { MapBackground } from "../lib/types/mapFilters";
import {
  useLayersVisibility,
  useMapStoreActions,
} from "../lib/stores/mapStore";

export const Legend = () => {
  const [isOpenMapBackgrounds, setIsOpenMapBackgrounds] = useState(false);
  const [isCollapsedLegend, setIsCollapsedLegend] = useState(true);
  const theme = useTheme();
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));
  const { setActiveMapBackground } = useMapFiltersActions();
  const activeMapBackground = useActiveMapBackground();
  const maptilerMapId = useMaptilerMapId();
  const layersVisibility = useLayersVisibility();
  const { toggleLayer } = useMapStoreActions();

  const legendRef = useRef<HTMLDivElement>(null);
  const mapBackgroundRef = useRef<HTMLDivElement>(null);

  const toggleMapBackgrounds = () => {
    setIsOpenMapBackgrounds(!isOpenMapBackgrounds);
  };

  const handleBackgroundChange = (background: MapBackground) => {
    setActiveMapBackground(background);
  };

  const modalStyleMapBackgrounds: CSSProperties = {
    position: "absolute",
    bottom: isTablet ? 180 : 140,
    right: isTablet ? 24 : 12,
    borderRadius: "5px",
    width: "200px",
    display: isOpenMapBackgrounds ? "block" : "none",
  };

  const styleLegend: CSSProperties = {
    position: "fixed",
    top: 20,
    left: "50%",
    transform: "translateX(-50%)",
    backgroundColor: "white",
    padding: "10px",
    borderRadius: "5px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.3)",
    maxHeight: isCollapsedLegend ? "60px" : isTablet ? "75%" : "85%",
    maxWidth: "300px",
    overflow: isCollapsedLegend ? "hidden" : "auto",
  };

  const buttonStyle: CSSProperties = {
    position: "absolute",
    bottom: isTablet ? 125 : 80,
    right: 12,
    backgroundColor: "white",
    borderRadius: "50%",
    boxShadow: "0px 2px 4px rgba(0,0,0,0.2)",
  };

  const mapBackgrounds = (
    <Box ref={mapBackgroundRef}>
      {[
        {
          id: "dynamic",
          label: "Dynamique (Maptiler Landscape + IGN SCAN 25®)",
        },
        { id: "ign-layer", label: "IGN SCAN 25®" },
        { id: "outdoor-v2", label: "Maptiler Outdoor" },
        { id: "streets-v2", label: "Maptiler Streets" },
        { id: "landscape", label: "Maptiler Landscape" },
      ].map((background) => (
        <Box
          key={background.id}
          onClick={() => handleBackgroundChange(background.id as MapBackground)}
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "5px",
            cursor: "pointer",
            backgroundColor:
              (activeMapBackground || maptilerMapId) === background.id
                ? "#f5f5f5"
                : "transparent",
            padding: isTablet ? "3px" : "5px",
            borderRadius: "4px",
            color: "#000",
          }}
        >
          <Box style={{ width: 24, display: "flex", justifyContent: "center" }}>
            {(activeMapBackground || maptilerMapId) === background.id && (
              <CheckIcon
                style={{ color: theme.palette.brown.main, fontSize: 20 }}
              />
            )}
          </Box>
          <span style={{ marginLeft: 5 }}>{background.label}</span>
        </Box>
      ))}
    </Box>
  );

  const legendContent = (
    <>
      <Box
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", width: "300px" }}>
          <MapIcon style={{ marginRight: "5px", color: "#725E51" }} />
          <Typography
            variant="inherit"
            fontSize={"15px"}
            textTransform={"uppercase"}
            color="#434A4A"
          >
            {`Légende et couches`}
          </Typography>
        </Box>

        <IconButton
          onClick={() => setIsCollapsedLegend(!isCollapsedLegend)}
          size="small"
        >
          {isCollapsedLegend ? <ExpandMoreIcon /> : <ExpandLessIcon />}
        </IconButton>
      </Box>

      {!isCollapsedLegend && (
        <>
          <Box sx={{ color: "#000" }}>
            <span>
              <strong>Itinéraires autorisés</strong>
            </span>
            <Box
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "5px",
              }}
            >
              <Box
                style={{
                  width: 20,
                  height: 3,
                  borderStyle: "dashed",
                  borderWidth: 2,
                  borderColor: "#084aff",
                  backgroundColor: "transparent",
                  marginRight: 10,
                }}
              ></Box>
              <span>{`Du 15/12 au 14/05`}</span>
            </Box>
            <Box
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "5px",
              }}
            >
              <Box
                style={{
                  width: 20,
                  height: 3,
                  backgroundColor: "#084aff",
                  marginRight: 10,
                }}
              ></Box>
              <span>{`Du 15/12 au 30/06`}</span>
            </Box>
            <Box
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "5px",
              }}
            >
              <Box
                style={{
                  width: 20,
                  height: 3,
                  backgroundColor: "#ed9e00",
                  marginRight: 10,
                }}
              ></Box>
              <span>{`Du 15/05 au 30/06`}</span>
            </Box>
            <Box
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "5px",
              }}
            >
              <Box
                style={{
                  width: 20,
                  height: 3,
                  backgroundColor: "#ff0000",
                  marginRight: 10,
                }}
              ></Box>
              <span>{`Du 15/12 au 1er dimanche de mars`}</span>
            </Box>
            <Box
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "5px",
              }}
            >
              <Box
                style={{
                  width: 20,
                  height: 3,
                  borderStyle: "dashed",
                  borderWidth: 2,
                  borderColor: "#ff0000",
                  backgroundColor: "transparent",
                  marginRight: 10,
                }}
              ></Box>
              <span>{`Non réglementé par l'APPB`}</span>
            </Box>
              
            <Box style={{ display: "flex", alignItems: "center", marginBottom: "15px"}}>
              <Box
                style={{
                  width: 20,
                  height: 3,
                  backgroundColor: "#9E9E9E",
                  marginRight: 10,
                }}
              ></Box>
              <span>{`Si déneigé`}</span>
            </Box>
            
            <Box>
              <span>
                <strong>Aires protégées</strong>
              </span>
              <Box
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "5px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center" }}>
                  <svg width="24" height="24" style={{ flexShrink: 0 }}>
                    <rect
                      width="24"
                      height="24"
                      fill="#009366"
                      stroke="gray"
                      strokeWidth={3}
                      fillOpacity={0.23}
                    />
                  </svg>
                  <span style={{ marginLeft: 10 }}>
                    {`Arrêté Préfectoral de Protection de Biotope "Forêts d'altitude du Haut-Jura"`}
                  </span>
                </div>
              </Box>
              <Box>
                <Box
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: "5px",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <svg width="24" height="24" style={{ flexShrink: 0 }}>
                      <rect
                        width="24"
                        height="24"
                        fill="#009366"
                        stroke="#009366"
                        strokeWidth={3}
                        fillOpacity={0.4}
                      />
                    </svg>
                    <span style={{ marginLeft: 10 }}>
                      Autres Arrêtés Préfectoraux de Protection de Biotope
                    </span>
                  </div>
                  <IconButton onClick={() => toggleLayer("other-appb-source")}>
                    {layersVisibility["other-appb-source"] ? (
                      <VisibilityIcon className="w-5 h-5 text-green-500" />
                    ) : (
                      <VisibilityOffIcon className="w-5 h-5 text-red-500" />
                    )}
                  </IconButton>
                </Box>
              </Box>
              <Box
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "5px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center" }}>
                  <svg width="24" height="24" style={{ flexShrink: 0 }}>
                    <rect
                      width="24"
                      height="24"
                      fill="#98FB98"
                      stroke="#98FB98"
                      strokeWidth={3}
                      fillOpacity={0.6}
                    />
                  </svg>
                  <span style={{ marginLeft: 10 }}>
                    Espaces Naturels Sensibles
                  </span>
                </div>
                <IconButton
                  onClick={() => toggleLayer("protected-areas-source", "ENS")}
                >
                  {layersVisibility["protected-areas-source"].ENS ? (
                    <VisibilityIcon className="w-5 h-5 text-green-500" />
                  ) : (
                    <VisibilityOffIcon className="w-5 h-5 text-red-500" />
                  )}
                </IconButton>
              </Box>
              <Box
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "5px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center" }}>
                  <svg width="24" height="24" style={{ flexShrink: 0 }}>
                    <rect
                      width="24"
                      height="24"
                      fill="#000000"
                      stroke="#000000"
                      strokeWidth={3}
                      fillOpacity={0.2}
                    />
                  </svg>
                  <span style={{ marginLeft: 10 }}>
                    Réserves Naturelles Régionales
                  </span>
                </div>
                <IconButton
                  onClick={() => toggleLayer("protected-areas-source", "RNR")}
                >
                  {layersVisibility["protected-areas-source"].RNR ? (
                    <VisibilityIcon className="w-5 h-5 text-green-500" />
                  ) : (
                    <VisibilityOffIcon className="w-5 h-5 text-red-500" />
                  )}
                </IconButton>
              </Box>
              <Box
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "5px",
                  justifyContent: "space-between",
                }}
              >
                <div style={{ display: "flex", alignItems: "center" }}>
                  <svg width="24" height="24" style={{ flexShrink: 0 }}>
                    <rect
                      width="24"
                      height="24"
                      fill="#ff8400"
                      stroke="#ff8400"
                      strokeOpacity={1}
                      strokeWidth={3}
                      fillOpacity={0.15}
                    />
                  </svg>
                  <span style={{ marginLeft: 10 }}>
                    District franc fédéral Le Noirmont
                  </span>
                </div>
                <IconButton
                  onClick={() => toggleLayer("swiss-protected-areas-source")}
                >
                  {layersVisibility["swiss-protected-areas-source"] ? (
                    <VisibilityIcon className="w-5 h-5 text-green-500" />
                  ) : (
                    <VisibilityOffIcon className="w-5 h-5 text-red-500" />
                  )}
                </IconButton>
              </Box>
            </Box>
          </Box>

          <Box sx={{ color: "#000" }}>
            <span>
              <strong>Haute Chaîne du Jura</strong>
            </span>
          </Box>
          <Box sx={{ color: "#000" }}>
            <Box
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "5px",
                justifyContent: "space-between",
              }}
            >
              <div style={{ display: "flex", alignItems: "center" }}>
                <svg width="24" height="24" style={{ flexShrink: 0 }}>
                  <rect
                    width="24"
                    height="24"
                    fill="#4b0092"
                    stroke="#4b0092"
                    strokeWidth={3}
                    fillOpacity={0.15}
                  />
                </svg>
                <span style={{ marginLeft: 10 }}>
                  Réserve Naturelle Nationale
                </span>
              </div>
              <Box style={{ alignSelf: "flex-end" }}>
                <IconButton
                  onClick={() => toggleLayer("protected-areas-source", "RNN")}
                >
                  {layersVisibility["protected-areas-source"].RNN ? (
                    <VisibilityIcon className="w-5 h-5 text-green-500" />
                  ) : (
                    <VisibilityOffIcon className="w-5 h-5 text-red-500" />
                  )}
                </IconButton>
              </Box>
            </Box>
            <Box
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "5px",
              }}
            >
              <svg width="24" height="24" style={{ flexShrink: 0 }}>
                <rect
                  width="24"
                  height="24"
                  fill="#4b0092"
                  stroke="#4b0092"
                  fillOpacity={0.4}
                  strokeWidth={3}
                />
              </svg>
              <span style={{ marginLeft: 10 }}>
                Zones de Quiétude de la Faune Sauvage
              </span>

              <IconButton onClick={() => toggleLayer("zonages-zqfs-source")}>
                {layersVisibility["zonages-zqfs-source"] ? (
                  <VisibilityIcon className="w-5 h-5 text-green-500" />
                ) : (
                  <VisibilityOffIcon className="w-5 h-5 text-red-500" />
                )}
              </IconButton>
            </Box>
            <Box>
              <span>
                <strong>Autres informations</strong>
              </span>
            </Box>
            <Box>
              <Box
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "5px",
                }}
              >
                <Image
                  src="/icons/parking_marker.png"
                  alt="Parking Icon"
                  width={20}
                  height={20}
                  style={{ marginRight: 10 }}
                />
                <span>Parking à proximité</span>
              </Box>
            </Box>
            <Box sx={{ maxWidth: 380, mt: 1, fontSize: "13px" }}>
              {`D'autres zones réglementées sont également présentes sur le massif
          jurassien. Pour plus d'informations, consulter la réglementation
          locale.`}
            </Box>
          </Box>
        </>
      )}
    </>
  );

  const handleClickOutside = (event: MouseEvent) => {
    if (
      legendRef.current &&
      !legendRef.current.contains(event.target as Node) &&
      mapBackgroundRef.current &&
      !mapBackgroundRef.current.contains(event.target as Node)
    ) {
      setIsCollapsedLegend(true);
      setIsOpenMapBackgrounds(false);
    }
  };
  // close element Legend and mapBackgrounds if click outside
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <Box ref={legendRef} style={styleLegend}>
        {legendContent}
      </Box>
      <IconButton
        onClick={toggleMapBackgrounds}
        style={buttonStyle}
        sx={{
          color: "#725E51",
          backgroundColor: "white",
          padding: 2,
          "&:hover": {
            backgroundColor: "white", // No effect on hover
          },
        }}
      >
        <LayersIcon />
      </IconButton>
      <Box
        ref={mapBackgroundRef}
        style={{
          ...modalStyleMapBackgrounds,
          backgroundColor: "white",
          padding: 5,
        }}
      >
        <Box sx={{ mb: 1, display: "flex", alignItems: "center" }}>
          <LayersIcon style={{ marginRight: "5px", color: "#725E51" }} />
          <Typography
            component="span"
            variant="button"
            fontSize={"15px"}
            color="#434A4A"
          >
            Fonds de carte
          </Typography>
        </Box>
        {mapBackgrounds}
      </Box>
    </>
  );
};
