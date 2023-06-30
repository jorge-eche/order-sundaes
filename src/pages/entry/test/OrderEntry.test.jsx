import {
  render,
  screen,
  waitFor,
} from "../../../test-utils/testing-library-utils";
import userEvent from "@testing-library/user-event";
import { rest } from "msw";
import { server } from "../../../mocks/server.js";
import { OrderDetailsProvider } from "../../../contexts/OrderDetails";
import OrderEntry from "../OrderEntry";

test("handles errors for scoops and toppings routes", async () => {
  server.resetHandlers(
    rest.get("http://localhost:3030/scoops", (req, res, ctx) =>
      res(ctx.status(500))
    ),
    rest.get("http://localhost:3030/toppings", (req, res, ctx) =>
      res(ctx.status(500))
    )
  );

  render(<OrderEntry />);

  await waitFor(async () => {
    const alert = await screen.findAllByRole("alert");
    expect(alert).toHaveLength(2);
  });
});

test("disable Order Button if no scoops ordered", async () => {
  //render component with Context
  const user = userEvent.setup();
  render(<OrderEntry />, { wrapper: OrderDetailsProvider });

  //check scoops count is zero and button is disabled
  const vanillaInput = await screen.findByRole("spinbutton", {
    name: "Vanilla",
  });
  expect(vanillaInput).toBeInTheDocument();

  const scoopsSubtotal = screen.getByText("Scoops total: $0.00");
  expect(scoopsSubtotal).toBeInTheDocument();

  const orderSundaeButton = screen.getByRole("button", {
    name: "Order Sundae!",
  });
  expect(orderSundaeButton).toBeDisabled();

  //add scoops and check if button is enabled
  await user.clear(vanillaInput);
  await user.type(vanillaInput, "2");
  expect(scoopsSubtotal).toHaveTextContent("$4.00");

  expect(orderSundaeButton).toBeEnabled();

  //remove scoops and check if button is disabled
  await user.clear(vanillaInput);
  await user.type(vanillaInput, "0");
  expect(scoopsSubtotal).toHaveTextContent("$0.00");
  expect(orderSundaeButton).toBeDisabled();
});
