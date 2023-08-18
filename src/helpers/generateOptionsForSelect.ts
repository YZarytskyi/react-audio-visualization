import { SelectOptionsType } from "../components/CustomSelect.tsx";

export function generateOptionsForSelect<T>(
  values: T[],
): SelectOptionsType<T>[] {
  return values.map((value) => ({
    value: value,
    label: value,
  }));
}
