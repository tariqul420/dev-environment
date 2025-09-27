import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useState } from "react";
import { FieldPath, FieldValues, useFormContext } from "react-hook-form";
import PhoneInput, { CountryData } from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

interface Props<TFieldValues extends FieldValues> {
  name: FieldPath<TFieldValues>;
  label: string;
  country?: string;
  className?: string;
  onlyCountries?: string[];
}

export default function PhoneInputField<TFieldValues extends FieldValues>({
  name,
  label,
  className,
  country = "bd",
  onlyCountries = ["bd", "us", "ca"],
}: Props<TFieldValues>) {
  const { control, watch } = useFormContext<TFieldValues>();
  const [phoneNumber, setPhoneNumber] = useState("");

  const phoneValue = watch(name);

  if (!phoneValue && phoneNumber) {
    setPhoneNumber("");
  }

  const handleChange = (
    value: string,
    data: CountryData,
    event: React.ChangeEvent<HTMLInputElement>,
    formattedValue: string,
    field: { onChange: (value: string) => void },
  ) => {
    const countryCode = `+${data.dialCode}`;
    const numberWithoutCode = value.startsWith(countryCode)
      ? value.slice(countryCode.length)
      : value;
    setPhoneNumber(numberWithoutCode);
    field.onChange(`${countryCode}${numberWithoutCode}`);
  };

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <PhoneInput
              country={country}
              onlyCountries={onlyCountries}
              value={phoneValue || `${phoneNumber}`}
              onChange={(value, data, event, formattedValue) =>
                handleChange(
                  value,
                  data as CountryData,
                  event,
                  formattedValue,
                  field,
                )
              }
              inputClass="w-full rounded-md border p-3"
              containerClass="w-full"
              inputStyle={{
                width: "100%",
                backgroundColor: "transparent",
                color: "inherit",
              }}
              buttonStyle={{
                backgroundColor: "transparent",
                color: "inherit",
              }}
              countryCodeEditable={false}
              enableSearch={true}
              disableSearchIcon={false}
              disableDropdown={false}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
