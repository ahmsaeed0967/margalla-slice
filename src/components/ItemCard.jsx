import { Link } from "react-router-dom";
import { Clock } from "lucide-react";
import FoodImage from "./FoodImage.jsx";
import { useCart } from "../context/CartContext.jsx";
import { formatRs, fromPrice, stockText } from "../utils/pricing.js";

// One menu card: photo, name, description, prep time, price and availability (all as text).
export default function ItemCard({ item }) {
  const { qtyForItem } = useCart();
  const inBasket = qtyForItem(item.id);
  const soldOut = item.stockToday <= 0;
  const status = stockText(item);

  return (
    <li className={`card ${soldOut ? "card--soldout" : ""}`}>
      <FoodImage item={item} />
      <div className="card__body">
        <p className="card__category">{item.category}</p>
        <h3 className="card__title">
          <Link to={`/menu/${item.id}`}>{item.name}</Link>
        </h3>
        <p className="card__desc">{item.description}</p>
        <p className="card__meta">
          <Clock size={16} aria-hidden="true" /> {item.prepMinutes} min prep
        </p>
        <p className="card__price">
          {item.sizes ? "From " : ""}
          <strong>{formatRs(fromPrice(item))}</strong>
        </p>
        <p className={`status ${soldOut ? "status--bad" : item.stockToday <= 5 ? "status--warn" : "status--good"}`}>
          {soldOut ? "✕ " : item.stockToday <= 5 ? "! " : "✓ "}
          {status}
        </p>
        {inBasket > 0 && <p className="card__inbasket">In basket: {inBasket}</p>}
        <Link className="btn btn--secondary" to={`/menu/${item.id}`}>
          View details<span className="visually-hidden"> for {item.name}</span>
        </Link>
      </div>
    </li>
  );
}
