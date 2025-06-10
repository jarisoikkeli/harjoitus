import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import 'leaflet/dist/leaflet.css';
import './KelikameraValitsin.css';

// Leafletin markerikuvien korjaus
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: new URL('leaflet/dist/images/marker-icon-2x.png', import.meta.url).href,
  iconUrl: new URL('leaflet/dist/images/marker-icon.png', import.meta.url).href,
  shadowUrl: new URL('leaflet/dist/images/marker-shadow.png', import.meta.url).href
});

const SiirryKartalla = ({ sijainti }) => {
  const map = useMap();
  useEffect(() => {
    if (sijainti) {
      map.setView(sijainti, 9);
    }
  }, [sijainti, map]);
  return null;
};

const KelikameraValitsin = () => {
  const [kamerat, setKamerat] = useState([]);
  const [valittu, setValittu] = useState("");
  const [kuvaUrl, setKuvaUrl] = useState("");
  const [sijainnit, setSijainnit] = useState({});

  useEffect(() => {
    fetch("https://tie.digitraffic.fi/api/weathercam/v1/stations")
      .then(res => res.json())
      .then(data => {
        console.log("Haettu kelikameradata:", data);

        console.log("Kameramäärä yhteensä:", data.features.length);

const kaikki = data.features.filter(a => {
  const coords = a.geometry?.coordinates;
  return (
    Array.isArray(a.properties.presets) &&
    a.properties.presets.length > 0 &&
    Array.isArray(coords) &&
    typeof coords[0] === 'number' &&
    typeof coords[1] === 'number'
  );
});

        console.log("Kamerat suodatuksen jälkeen:", kaikki.length);

        const sij = {};
        kaikki.forEach(a => {
          const id = a.properties.presets[0].id;
          const coords = [a.geometry.coordinates[1], a.geometry.coordinates[0]];
          sij[id] = coords;
          console.log(`ID: ${id}, Nimi: ${a.properties.name}, Koordinaatit:`, coords);
        });

        setKamerat(kaikki);
        setSijainnit(sij);

        if (kaikki.length > 0) {
          const oletusId = kaikki[0].properties.presets[0].id;
          setValittu(oletusId);
          setKuvaUrl(`https://weathercam.digitraffic.fi/${oletusId}.jpg?${Date.now()}`);
          console.log("Oletuskamera asetettu:", oletusId);
        } else {
          console.warn("Ei löytynyt yhtään kelikameraa suodatuksen jälkeen.");
        }
      })
      .catch(err => console.error("Virhe kameradatan haussa:", err));
  }, []);

  // Kuva päivittyy 30s välein
  useEffect(() => {
    if (!valittu) return;
    const i = setInterval(() => {
      setKuvaUrl(`https://weathercam.digitraffic.fi/${valittu}.jpg?${Date.now()}`);
      console.log("Kuva päivitetty:", kuvaUrl);
    }, 30000);
    return () => clearInterval(i);
  }, [valittu]);

  const vaihda = (id) => {
    console.log("Kameran vaihto:", id);
    setValittu(id);
    setKuvaUrl(`https://weathercam.digitraffic.fi/${id}.jpg?${Date.now()}`);
  };

  return (
    <div className="kelikamera-container">
      <div className="kuva-osa">
        {kuvaUrl && (
          <img
            src={kuvaUrl}
            alt="Kelikamerakuva"
            className="kelikamera-kuva"
          />
        )}
      </div>

      <div className="kartta-osa">
        <MapContainer
          center={[63.5, 25]}
          zoom={5.5}
          style={{ width: "100%", height: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="© OpenStreetMap"
          />
          {kamerat.map(a => {
            const id = a.properties.presets[0].id;
            const pos = sijainnit[id];
            if (!pos) {
              console.warn("Kameralta puuttuu koordinaatit:", id);
              return null;
            }
            console.log("Renderöidään marker:", id, pos);
            return (
              <Marker
                key={id}
                position={pos}
                eventHandlers={{ click: () => vaihda(id) }}
              >
                <Popup>{a.properties.name}</Popup>
              </Marker>
            );
          })}
          {valittu && sijainnit[valittu] && <SiirryKartalla sijainti={sijainnit[valittu]} />}
        </MapContainer>
      </div>
    </div>
  );
};

export default KelikameraValitsin;
