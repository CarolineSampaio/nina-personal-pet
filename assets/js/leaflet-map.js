
/**
 * Nina Personal Pet - Mapa Interativo de Localização & Raio de Atendimento
 * Biblioteca: Leaflet.js
 */

document.addEventListener("DOMContentLoaded", function () {
  const mapElement = document.getElementById("map");
  if (!mapElement) return;

  const centerLat = -23.558184;
  const centerLng = -46.608520;

  // Determina o zoom ideal responsivo (13 para telas >= 768px, 12 para telas < 768px)
  function getResponsiveZoom() {
    return window.innerWidth < 768 ? 12 : 13;
  }

  // Inicializa o mapa com zoom responsivo
  const map = L.map("map", {
    center: [centerLat, centerLng],
    zoom: getResponsiveZoom(),
    scrollWheelZoom: false, // evita travar o scroll da página no mobile
    zoomControl: true,
  });

  // Chave de API da CARTO
  const CARTO_API_KEY = (window.NINA_CONFIG && window.NINA_CONFIG.CARTO_API_KEY) || "";

  // Carrega o estilo vetorial CARTO Voyager e oculta edificações/estádios para visual super limpo
  const vectorStyleUrl = `https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json?key=${CARTO_API_KEY}`;
  const hiddenLayers = ["building", "building-top", "landuse", "poi_stadium", "aeroway-runway", "aeroway-taxiway"];

  if (typeof L.maplibreGL === "function") {
    fetch(vectorStyleUrl)
      .then(function (res) {
        return res.json();
      })
      .then(function (styleJson) {
        // Filtra as camadas indesejadas (edificações isoladas, estádios/cemitérios, etc.)
        styleJson.layers = styleJson.layers.filter(function (layer) {
          return (
            !hiddenLayers.includes(layer.id) &&
            layer["source-layer"] !== "building" &&
            layer["source-layer"] !== "housenumber"
          );
        });

        L.maplibreGL({
          style: styleJson,
          interactive: false,
        }).addTo(map);
      })
      .catch(function () {
        // Fallback caso falhe o carregamento do JSON
        L.maplibreGL({
          style: vectorStyleUrl,
          interactive: false,
        }).addTo(map);
      });
  } else {
    // Fallback raster
    L.tileLayer(
      `https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png?key=${CARTO_API_KEY}`,
      {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions" target="_blank">CARTO</a>',
        subdomains: "abcd",
        maxZoom: 19,
      }
    ).addTo(map);
  }

  map.attributionControl.addAttribution(
    '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions" target="_blank">CARTO</a>'
  );

  // Raio de atendimento ajustado para 4km com as cores da marca
  const coverageCircle = L.circle([centerLat, centerLng], {
    radius: 3500,
    color: "#318ab7",
    fillColor: "#318ab7",
    fillOpacity: 0.14,
    weight: 2,
    dashArray: "5, 8",
  }).addTo(map);

  // Pin personalizado com ícone de patinha
  const petIcon = L.divIcon({
    className: "custom-map-marker",
    html: '<div class="map-pet-pin"><i class="fas fa-paw"></i></div>',
    iconSize: [42, 42],
    iconAnchor: [21, 42],
    popupAnchor: [0, -38],
  });

  const marker = L.marker([centerLat, centerLng], { icon: petIcon }).addTo(map);

  marker.bindPopup(`
    <div style="font-family: Poppins, sans-serif; font-size: 13px; text-align: center; padding: 4px 2px;">
      <strong style="color: #14183E; font-size: 14px; display: block; margin-bottom: 2px;">Nina Personal Pet</strong>
      <span style="color: #5E6282; font-size: 12px;">Região Central &amp; Leste de SP</span>
    </div>
  `);

  // Atualiza o zoom e centralização em caso de redimensionamento da janela
  let resizeTimer;
  window.addEventListener("resize", function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      map.invalidateSize();
      const targetZoom = getResponsiveZoom();
      if (map.getZoom() !== targetZoom) {
        map.setView([centerLat, centerLng], targetZoom);
      }
    }, 200);
  });

  // Garante renderização perfeita das tiles
  setTimeout(function () {
    map.invalidateSize();
    map.setView([centerLat, centerLng], getResponsiveZoom());
  }, 300);
});
