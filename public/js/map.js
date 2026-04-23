mapboxgl.accessToken = mapToken;

const map = new mapboxgl.Map({
    container: "map", // container ID
    center: coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
    zoom: 8, // starting zoom
});

// Marker Wrapper
const wrapper = document.createElement("div");
wrapper.className = "marker-wrapper";

// Circle background
const circle = document.createElement("div");
circle.className = "marker-circle";

// Flipping Marker
const el = document.createElement("div");
el.className = "marker";

const front = document.createElement("div");
front.className = "front";

const back = document.createElement("div");
back.className = "back";

el.appendChild(front);
el.appendChild(back);
wrapper.appendChild(circle);
wrapper.appendChild(el);

const marker = new mapboxgl.Marker(wrapper).setLngLat(coordinates).addTo(map);
