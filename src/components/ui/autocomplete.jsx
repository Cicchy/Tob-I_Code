"use client";;
import {
  Combobox,
  ComboboxClear,
  ComboboxContent,
  ComboboxControl,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxGroupLabel,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxTrigger,
} from "@/components/ui/combobox";
import { Separator } from "@/components/ui/separator";

export const Autocomplete = (props) => (
  <Combobox
    allowCustomValue
    data-slot="autocomplete"
    inputBehavior="autocomplete"
    {...props} />
);

export const AutocompleteControl = (
  props
) => <ComboboxControl data-slot="autocomplete-control" {...props} />;

export const AutocompleteInput = (
  props
) => {
  const { showClear = false, showTrigger = false, ...rest } = props;

  return (
    <ComboboxInput
      data-slot="autocomplete-input"
      showClear={showClear}
      showTrigger={showTrigger}
      {...rest} />
  );
};

export const AutocompleteGroupLabel = (
  props
) => <ComboboxGroupLabel data-slot="autocomplete-group-label" {...props} />;

export const AutocompleteItem = (
  props
) => <ComboboxItem data-slot="autocomplete-item" {...props} />;

export const AutocompleteContent = (
  props
) => <ComboboxContent data-slot="autocomplete-content" {...props} />;

export const AutocompleteTrigger = (
  props
) => <ComboboxTrigger data-slot="autocomplete-trigger" {...props} />;

export const AutocompleteClear = (
  props
) => <ComboboxClear data-slot="autocomplete-clear" {...props} />;

export const AutocompleteGroup = (
  props
) => <ComboboxGroup data-slot="autocomplete-group" {...props} />;

export const AutocompleteEmpty = (
  props
) => <ComboboxEmpty data-slot="autocomplete-empty" {...props} />;

export const AutocompleteList = (
  props
) => <ComboboxList data-slot="autocomplete-list" {...props} />;

export const AutocompleteCollection = (
  props
) => <ComboboxList data-slot="autocomplete-collection" {...props} />;

export const AutocompleteSeparator = (
  props
) => <Separator data-slot="autocomplete-separator" {...props} />;
