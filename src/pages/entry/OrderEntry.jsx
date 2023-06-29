import Options from "./Options";
import { useOrderDetails } from "../../contexts/OrderDetails";
import { formatCurrency } from "../../utilities";
import Button from "react-bootstrap/Button";

export default function OrderEntry({ setOrderPhase }) {
  const { totals } = useOrderDetails();
  const grandTotal = totals.scoops + totals.toppings;

  return (
    <div>
      <h1>Design your Sundae!</h1>
      <Options optionType={"scoops"} />
      <Options optionType={"toppings"} />
      <h2>Grand Total: {formatCurrency(grandTotal)}</h2>
      <Button variant="primary" onClick={() => setOrderPhase("review")}>
        Order Sundae!
      </Button>
    </div>
  );
}
