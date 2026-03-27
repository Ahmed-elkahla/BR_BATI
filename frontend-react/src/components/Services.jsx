import { useEffect, useState } from "react";
import { dataApi } from "../api/auth";

export default function Services() {
  const [services, setServices] = useState([]);
  const [popup, setPopup] = useState(null);

  useEffect(() => {
    dataApi.services().then(setServices).catch(() => {});
  }, []);

  return (
    <section className="services">
      <h2>Nos Services</h2>
      <p className="subtitle">Cliquez sur un service pour voir plus de détails.</p>
      <div className="services-grid">
        {services.map((s) => (
          <div className="service-card" key={s.label} onClick={() => setPopup(s)}>
            <i className={`fa-solid ${s.icon}`}></i>
            <h3>{s.label}</h3>
          </div>
        ))}
      </div>

      {popup && (
        <div id="popup" style={{ display: "block" }}>
          <div className="popup-content">
            <span onClick={() => setPopup(null)}>✖</span>
            <h2>{popup.label}</h2>
            <p>{popup.desc}</p>
          </div>
        </div>
      )}
    </section>
  );
}
