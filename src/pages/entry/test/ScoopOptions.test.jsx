import { render, screen } from "../../../test-utils/testing-library-utils";
import userEvent from "@testing-library/user-event";
import ScoopOptions from "../ScoopOption";

test("input box becomes red for invalid scoop input", async () => {
  const user = userEvent.setup();
  render(<ScoopOptions />);

  const input = await screen.findByRole("spinbutton");
  expect(input).not.toHaveClass("is-invalid");

  //check input class is 'is-invalid' while input value is < 0
  await user.clear(input);
  await user.type(input, "-3");
  expect(input).toHaveClass("is-invalid");

  //check input class is 'is-invalid' while input value is a float number
  await user.clear(input);
  await user.type(input, "1.5");
  expect(input).toHaveClass("is-invalid");

  //check input class is 'is-invalid' while input value is > 10
  await user.clear(input);
  await user.type(input, "20");
  expect(input).toHaveClass("is-invalid");

  //check input class is not 'is-invalid' when input is cleared back to zero or a valid value
  await user.clear(input);
  await user.type(input, "5");
  expect(input).not.toHaveClass("is-invalid");
});
