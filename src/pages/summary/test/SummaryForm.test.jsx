import { render, screen, fireEvent } from "@testing-library/react";
import SummaryForm from "../SummaryForm";

test("Initial conditions", () => {
  render(<SummaryForm />);

  const checkbox = screen.getByRole("checkbox", {
    name: "I agree to Terms and Conditions",
  });
  expect(checkbox).not.toBeChecked();

  const confirmButton = screen.getByRole("button", {
    name: /confirm order/i,
  });
  expect(confirmButton).toBeDisabled();
});

test("checking checkbox enables button and unchecking checkbox disables button", () => {
  render(<SummaryForm />);

  const checkbox = screen.getByRole("checkbox", {
    name: "I agree to Terms and Conditions",
  });
  const confirmButton = screen.getByRole("button", {
    name: /confirm order/i,
  });

  //check checkbox
  fireEvent.click(checkbox);

  //expect button to be enabled while checkbox is checked
  expect(confirmButton).toBeEnabled();

  //uncheck checkbox
  fireEvent.click(checkbox);

  //expect button to be disabled
  expect(confirmButton).toBeDisabled();
});
