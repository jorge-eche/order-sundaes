import { render, screen } from "../../../test-utils/testing-library-utils";
import { server } from "../../../mocks/server.js";
import { rest } from "msw";
import OrderConfirmation from "../OrderConfirmation";

test("alert appears on error from server", async () => {
  server.resetHandlers(
    rest.post("http://localhost:3030/order", (req, res, ctx) =>
      res(ctx.status(500))
    )
  );
  render(<OrderConfirmation />);

  const alert = await screen.findByRole("alert");
  expect(alert).toBeInTheDocument();
});
