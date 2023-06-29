import { render, screen } from "../../../test-utils/testing-library-utils";
import userEvent from "@testing-library/user-event";
import Options from "../Options";
import OrderEntry from "../OrderEntry";

test("update scoop subtotal when scoops change", async () => {
  const user = userEvent.setup();
  render(<Options optionType="scoops" />);

  // make sure scoop subtotal starts out at $0.00
  const scoopsSubtotal = screen.getByText("Scoops total: $", { exact: false });
  expect(scoopsSubtotal).toHaveTextContent("0.00");

  // update vanilla scoop to 1, and check subtotal
  const vanillaInput = await screen.findByRole("spinbutton", {
    name: "Vanilla",
  });
  await user.clear(vanillaInput);
  await user.type(vanillaInput, "1");
  expect(scoopsSubtotal).toHaveTextContent("2.00");

  // update chocolate scoop to 2, and check subtotal
  const chocolateInput = await screen.findByRole("spinbutton", {
    name: "Chocolate",
  });

  await user.clear(chocolateInput);
  await user.type(chocolateInput, "2");
  expect(scoopsSubtotal).toHaveTextContent("6.00");
});

test("update topping subtotal when toppings change", async () => {
  const user = userEvent.setup();
  render(<Options optionType="toppings" />);

  // make sure toppings subtotal starts out at $0.00
  const toppingsSubtotal = screen.getByText("Toppings Total: $", {
    exact: false,
  });
  expect(toppingsSubtotal).toHaveTextContent("0.00");

  // check Cherries topping, and check subtotal
  const cherriesCheckbox = await screen.findByRole("checkbox", {
    name: "Cherries",
  });

  await user.click(cherriesCheckbox);
  expect(toppingsSubtotal).toHaveTextContent("1.50");

  // check M&M topping, and check subtotal
  const mAndMsCheckbox = screen.getByRole("checkbox", { name: "M&Ms" });

  await user.click(mAndMsCheckbox);
  expect(toppingsSubtotal).toHaveTextContent("3.00");

  // uncheck Cherries topping, and check subtotal
  await user.click(cherriesCheckbox);
  expect(toppingsSubtotal).toHaveTextContent("1.50");
});

describe("grand total", () => {
  test("grand total starts at $0.00", () => {
    const { unmount } = render(<OrderEntry />);
    const grandTotal = screen.getByRole("heading", {
      name: /grand total: \$/i,
    });

    expect(grandTotal).toHaveTextContent("0.00");
    unmount();
  });

  test("grand total updates properly if scoop is added first", async () => {
    const user = userEvent.setup();
    render(<OrderEntry />);
    const grandTotal = await screen.findByRole("heading", {
      name: /grand total: \$/i,
    });

    //update Vanilla scoops
    const vanillaInput = await screen.findByRole("spinbutton", {
      name: "Vanilla",
    });
    await user.clear(vanillaInput);
    await user.type(vanillaInput, "1");
    expect(grandTotal).toHaveTextContent("2.00");

    //update Hot Fudge topping
    const hotFudgeCheckbox = await screen.findByRole("checkbox", {
      name: "Hot Fudge",
    });
    await user.click(hotFudgeCheckbox);
    expect(grandTotal).toHaveTextContent("3.50");
  });

  test("grand total updates properly if topping is added first", async () => {
    const user = userEvent.setup();
    render(<OrderEntry />);
    const grandTotal = await screen.findByRole("heading", {
      name: /grand total: \$/i,
    });

    // update Hot Fudge topping
    const hotFudgeCheckbox = await screen.findByRole("checkbox", {
      name: "Hot Fudge",
    });

    await user.click(hotFudgeCheckbox);
    expect(grandTotal).toHaveTextContent("1.50");

    //update Vanilla scoops
    const vanillaInput = await screen.findByRole("spinbutton", {
      name: "Vanilla",
    });
    await user.clear(vanillaInput);
    await user.type(vanillaInput, "1");
    expect(grandTotal).toHaveTextContent("3.50");
  });
  test("grand total updates properly if item is removed", async () => {
    const user = userEvent.setup();
    render(<OrderEntry />);

    const grandTotal = await screen.findByRole("heading", {
      name: /grand total: \$/i,
    });
    const vanillaInput = await screen.findByRole("spinbutton", {
      name: "Vanilla",
    });
    const hotFudgeCheckbox = await screen.findByRole("checkbox", {
      name: "Hot Fudge",
    });

    // add scoop; grand total should be $2.00
    await user.clear(vanillaInput);
    await user.type(vanillaInput, "1");

    // add topping; grand total should be $3.50
    await user.click(hotFudgeCheckbox);

    // remove 1 scoop and check if grand total updates
    await user.clear(vanillaInput);
    await user.type(vanillaInput, "0");
    expect(grandTotal).toHaveTextContent("1.50");

    // remove 1 topping and check if grand total updates
    await user.click(hotFudgeCheckbox);
    expect(grandTotal).toHaveTextContent("0.00");
  });
});
