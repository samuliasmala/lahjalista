/**
 *
 * @param e give the event value of onClick or onFocus props
 */
export function moveInputCursorToEnd(
  e:
    | React.MouseEvent<HTMLInputElement, MouseEvent>
    | React.FocusEvent<HTMLInputElement, Element>,
) {
  e.currentTarget.setSelectionRange(
    e.currentTarget.value.length,
    e.currentTarget.value.length,
  );
}
