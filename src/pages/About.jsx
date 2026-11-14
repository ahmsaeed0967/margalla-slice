import { usePageTitle } from "../hooks/usePageTitle.js";
import { SITE } from "../config/site.js";
import { DELIVERY_AREAS } from "../data/deliveryAreas.js";
import { DELIVERY_MINIMUM } from "../rules/deliveryMinimum.js";
import { MAX_PER_LINE } from "../rules/stockLimit.js";
import { formatRs } from "../utils/pricing.js";

export default function About() {
  usePageTitle("About and rules");

  return (
    <div className="page">
      <h1>About {SITE.name}</h1>
      <p className="lead">
        {SITE.name} is a fictional pizzeria made for a web programming assignment. {SITE.demoLabel}.
      </p>

      <h2>Pick-up</h2>
      <p>{SITE.counter}</p>
      <p>{SITE.hours}</p>

      <h2>Delivery areas</h2>
      <table className="table">
        <caption className="visually-hidden">Delivery areas and fees</caption>
        <thead>
          <tr>
            <th scope="col">Area</th>
            <th scope="col">Delivery fee</th>
          </tr>
        </thead>
        <tbody>
          {DELIVERY_AREAS.map((area) => (
            <tr key={area.id}>
              <th scope="row">{area.name}</th>
              <td>{formatRs(area.fee)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Ordering rules</h2>
      <ul className="plain-list">
        <li>Availability: at most {MAX_PER_LINE} of one item, and never more than what is left today.</li>
        <li>Eligibility: special pizzas (Crown Crust, Malai Boti) are not made in Small.</li>
        <li>Delivery: orders need a subtotal of at least {formatRs(DELIVERY_MINIMUM)}. Pick-up has no minimum.</li>
      </ul>

      <h2>Photos</h2>
      <p>Sample photos are from Unsplash and Pexels. Sources are listed in src/assets/menu/PHOTO-SOURCES.txt.</p>
    </div>
  );
}
