import { Dispatch, SetStateAction } from "react";
import { SelectOptionsType } from "../components/CustomSelect.tsx";

export function onChangeSelect<T>(
  newValueObj: unknown,
  setState: Dispatch<SetStateAction<T>>,
) {
  const newValue = (newValueObj as SelectOptionsType<T>).value;
  setState(
    (typeof newValue === "number" ? newValue : newValue === "true") as T,
  );
}
