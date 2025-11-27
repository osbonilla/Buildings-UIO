require([
  "esri/WebScene",
  "esri/views/SceneView",
  "esri/widgets/Home",
  "esri/widgets/Compass",
  "esri/widgets/BasemapGallery",
  "esri/widgets/Expand",
  "esri/widgets/Search",
  "esri/widgets/LayerList",
  "esri/widgets/Legend",
  "esri/widgets/DirectLineMeasurement3D",
  "esri/widgets/AreaMeasurement3D",
  "esri/widgets/Daylight",
  "esri/widgets/Weather",
  "esri/core/reactiveUtils"
], function(
  WebScene,
  SceneView,
  Home,
  Compass,
  BasemapGallery,
  Expand,
  Search,
  LayerList,
  Legend,
  DirectLineMeasurement3D,
  AreaMeasurement3D,
  Daylight,
  Weather,
  reactiveUtils
) {
  
  // Cargar Web Scene
  const webScene = new WebScene({
    portalItem: {
      id: "779038c07ab64a6889730afc4e5f75a3"
    }
  });
  
  // Crear la vista 3D
  const view = new SceneView({
    container: "viewDiv",
    map: webScene,
    qualityProfile: "high",
    environment: {
      lighting: {
        type: "virtual",
        directShadowsEnabled: true,
        ambientOcclusionEnabled: true
      },
      atmosphereEnabled: true,
      starsEnabled: true,
      atmosphere: {
        quality: "high"
      }
    }
  });

  let activeMeasurement = null;

  // Widgets de medición
  const distanceMeasurement = new DirectLineMeasurement3D({
    view: view
  });

  const areaMeasurement = new AreaMeasurement3D({
    view: view
  });

  // Widget de iluminación (simular hora del día)
  const daylightWidget = new Daylight({
    view: view,
    dateOrSeason: "season"
  });

  const daylightExpand = new Expand({
    view: view,
    content: daylightWidget,
    expandIconClass: "esri-icon-sunny",
    expandTooltip: "Luz del día"
  });
  view.ui.add(daylightExpand, "top-right");

  // Widget de clima
  const weatherWidget = new Weather({
    view: view
  });

  const weatherExpand = new Expand({
    view: view,
    content: weatherWidget,
    expandIconClass: "esri-icon-environment-settings",
    expandTooltip: "Clima"
  });
  view.ui.add(weatherExpand, "top-right");

  view.when(() => {
    console.log("Web Scene cargado");
  });
  
  // Widget Home
  const homeBtn = new Home({
    view: view
  });
  view.ui.add(homeBtn, "top-left");
  
  // Widget Compass
  const compass = new Compass({
    view: view
  });
  view.ui.add(compass, "top-left");
  
  // Widget de búsqueda
  const searchWidget = new Search({
    view: view,
    locationEnabled: false,
    popupEnabled: true
  });
  view.ui.add(searchWidget, {
    position: "top-right",
    index: 0
  });
  
  // Galería de mapas base
  const basemapGallery = new BasemapGallery({
    view: view
  });
  
  const bgExpand = new Expand({
    view: view,
    content: basemapGallery,
    expandIconClass: "esri-icon-basemap",
    expandTooltip: "Mapas base"
  });
  view.ui.add(bgExpand, "top-right");
  
  // Lista de capas
  const layerList = new LayerList({
    view: view,
    listItemCreatedFunction: function(event) {
      const item = event.item;
      if (item.layer.type !== "group") {
        item.panel = {
          content: "legend",
          open: false
        };
      }
    }
  });
  
  const layerExpand = new Expand({
    view: view,
    content: layerList,
    expandIconClass: "esri-icon-layers",
    expandTooltip: "Capas"
  });
  view.ui.add(layerExpand, "top-right");
  
  // Leyenda
  const legend = new Legend({
    view: view
  });
  
  const legendExpand = new Expand({
    view: view,
    content: legend,
    expandIconClass: "esri-icon-legend",
    expandTooltip: "Leyenda"
  });
  view.ui.add(legendExpand, "bottom-right");

  // Funciones de medición
  function startDistanceMeasurement() {
    clearMeasurements();
    activeMeasurement = 'distance';
    distanceMeasurement.viewModel.start();
    view.container.style.cursor = "crosshair";
    document.getElementById('distanceBtn').classList.add('active');
  }

  function startAreaMeasurement() {
    clearMeasurements();
    activeMeasurement = 'area';
    areaMeasurement.viewModel.start();
    view.container.style.cursor = "crosshair";
    document.getElementById('areaBtn').classList.add('active');
  }

  function clearMeasurements() {
    distanceMeasurement.viewModel.clear();
    areaMeasurement.viewModel.clear();
    view.container.style.cursor = "default";
    document.querySelectorAll('.tool-btn').forEach(btn => {
      btn.classList.remove('active');
    });
    activeMeasurement = null;
  }

  // Vista aérea rápida
  function aerialView() {
    view.goTo({
      target: view.center,
      tilt: 0,
      heading: 0,
      zoom: view.zoom
    }, {
      duration: 1500,
      easing: "ease-in-out"
    });
  }

  // Rotación 360°
  function rotate360() {
    const currentHeading = view.camera.heading;
    view.goTo({
      heading: currentHeading + 360
    }, {
      duration: 3000,
      easing: "linear"
    });
  }

  // Event listeners
  document.getElementById('distanceBtn').addEventListener('click', startDistanceMeasurement);
  document.getElementById('areaBtn').addEventListener('click', startAreaMeasurement);
  document.getElementById('clearBtn').addEventListener('click', clearMeasurements);
  document.getElementById('aerialBtn').addEventListener('click', aerialView);
  document.getElementById('rotateBtn').addEventListener('click', rotate360);
  
});