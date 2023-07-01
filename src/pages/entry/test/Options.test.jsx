import { render, screen } from "../../../test-utils/testing-library-utils";
import userEvent from "@testing-library/user-event";
import Options from "../Options";

test("displays image for each scoop option from server", async () => {
  render(<Options optionType="scoops" />);

  //find images
  const scoopImages = await screen.findAllByRole("img", { name: /scoop$/i });
  expect(scoopImages).toHaveLength(2);

  //confirm alt text of images
  const altText = scoopImages.map((element) => element.alt);
  expect(altText).toEqual(["Chocolate scoop", "Vanilla scoop"]);
});

test("displays image for each topping option from server", async () => {
  render(<Options optionType="toppings" />);

  //find images
  const toppingImages = await screen.findAllByRole("img", {
    name: /topping$/i,
  });
  expect(toppingImages).toHaveLength(3);

  //confirm alt text of images
  const altText = toppingImages.map((element) => element.alt);
  expect(altText).toEqual([
    "Cherries topping",
    "M&Ms topping",
    "Hot Fudge topping",
  ]);
});

test("no scoops subtotal updates for invalid scoop count", async () => {
  const user = userEvent.setup();
  render(<Options optionType="scoops" />);

  const vanillaInput = await screen.findByRole("spinbutton", {
    name: "Vanilla",
  });
  const scoopsSubtotal = screen.getByText("Scoops total: $0.00");

  await user.clear(vanillaInput);
  await user.type(vanillaInput, "1.5");

  expect(scoopsSubtotal).toHaveTextContent("$0.00");

  // same test for '100'
  await user.clear(vanillaInput);
  await user.type(vanillaInput, "100");

  expect(scoopsSubtotal).toHaveTextContent("$0.00");
  // same test for '-1'
  await user.clear(vanillaInput);
  await user.type(vanillaInput, "100");

  expect(scoopsSubtotal).toHaveTextContent("$0.00");
});
