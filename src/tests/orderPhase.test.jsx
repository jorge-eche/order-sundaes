import { queryByText, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../App";

test("order phases for happy path", async () => {
  //render app
  const user = userEvent.setup();
  const { unmount } = render(<App />);

  //add ice cream scoops
  const vanillaInput = await screen.findByRole("spinbutton", {
    name: "Vanilla",
  });

  await user.clear(vanillaInput);
  await user.type(vanillaInput, "1");

  const chocolateInput = screen.getByRole("spinbutton", {
    name: "Chocolate",
  });

  await user.clear(chocolateInput);
  await user.type(chocolateInput, "2");

  //add ice cream toppings
  const hotFudgeCheckbox = await screen.findByRole("checkbox", {
    name: "Hot Fudge",
  });

  await user.click(hotFudgeCheckbox);

  // check grand total updates correctly
  const grandTotal = screen.getByRole("heading", {
    name: /grand total: \$/i,
  });
  expect(grandTotal).toHaveTextContent("7.50");

  //find and click order button
  const orderSundaeButton = screen.getByRole("button", {
    name: "Order Sundae!",
  });

  await user.click(orderSundaeButton);

  //check summary information based on order
  const summaryHeading = screen.getByRole("heading", { name: "Order Summary" });
  expect(summaryHeading).toBeInTheDocument();

  const scoopsSubtotal = screen.getByRole("heading", { name: /scoops: \$/i });
  expect(scoopsSubtotal).toHaveTextContent("6.00");

  const toppingsSubtotal = screen.getByRole("heading", {
    name: /toppings: \$/i,
  });
  expect(toppingsSubtotal).toHaveTextContent("1.50");

  //chech summary option items
  expect(screen.getByText("1 Vanilla")).toBeInTheDocument();
  expect(screen.getByText("2 Chocolate")).toBeInTheDocument();
  expect(screen.getByText("1 Hot Fudge")).toBeInTheDocument();

  // // alternatively...
  // // const optionItems = screen.getAllByRole('listitem');
  // // const optionItemsText = optionItems.map((item) => item.textContent);
  // // expect(optionItemsText).toEqual(['1 Vanilla', '2 Chocolate', '1 Hot Fudge']);

  //accept terms and conditions and click button to confirm order
  const tcCheckbox = screen.getByRole("checkbox", {
    name: /terms and conditions/i,
  });

  await user.click(tcCheckbox);

  const confirmOrderButton = screen.getByRole("button", {
    name: /confirm order/i,
  });

  await user.click(confirmOrderButton);

  // expect loading to show
  const loading = screen.getByText(/loading/i);
  expect(loading).toBeInTheDocument();

  //expect that loading has disappear
  const thankYouHeader = await screen.findByRole("heading", {
    name: "Thank you!",
  });
  expect(thankYouHeader).toBeInTheDocument();

  const notLoading = screen.queryByText("loading");
  expect(notLoading).not.toBeInTheDocument();

  //confirm order number on confirmation page
  const orderNumber = await screen.findByText(/your order number is/i, {
    exact: false,
  });

  expect(orderNumber).toHaveTextContent(/^your order number is [0-9]{9}$/i);

  //click 'new order' button on confirmation page
  const newOrderButton = screen.getByRole("button", {
    name: "Create new order",
  });

  await user.click(newOrderButton);

  //check that scoops and toppings subtotals have been reset
  const scoopsReset = await screen.findByText("Scoops total:", {
    exact: false,
  });
  const toppingsReset = screen.getByText("Toppings total:", { exact: false });

  expect(scoopsReset).toHaveTextContent("$0.00");
  expect(toppingsReset).toHaveTextContent("$0.00");

  //do we need to await anything to avoid test errors?
  unmount();
});

test.only("order phases for happy path without toppings", async () => {
  //render app
  const user = userEvent.setup();
  render(<App />);

  // add Vanilla scoops
  const vanillaInput = await screen.findByRole("spinbutton", {
    name: "Vanilla",
  });

  await user.clear(vanillaInput);
  await user.type(vanillaInput, "2");

  //check grand total updates correctly
  const grandTotal = screen.getByRole("heading", { name: /grand total/i });
  expect(grandTotal).toHaveTextContent("4.00");

  //click order button
  const orderSundaeButton = screen.getByRole("button", {
    name: "Order Sundae!",
  });
  await user.click(orderSundaeButton);

  //confirm scoops subtotal and items
  const scoopsSubtotal = await screen.findByRole("heading", {
    name: "Scoops: $4.00",
  });
  expect(scoopsSubtotal).toBeInTheDocument();

  const scoopItem = screen
    .getAllByRole("listitem")
    .find((listitem) => listitem.textContent === "2 Vanilla");
  expect(scoopItem).toBeInTheDocument();

  //confirm toppings subtotal does not show up on OrderSummary
  const toppingSubtotal = screen.queryByRole("heading", { name: /toppings/i });
  expect(toppingSubtotal).not.toBeInTheDocument();
});
