import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useState } from "react";
import { useFormContext } from "react-hook-form";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css"; // স্টাইলের জন্য প্রয়োজনীয় CSS

interface Props {
  name: string;
  label: string;
  country?: string;
  className?: string;
  onlyCountries?: string[];
}

export default function PhoneInputField({
  name,
  label,
  className,
  country = "bd",
  onlyCountries = ["bd", "us", "ca"], // ডিফল্ট কান্ট্রি তালিকা
}: Props) {
  const { control, watch } = useFormContext();
  const [phoneNumber, setPhoneNumber] = useState("");

  // ফর্মের মান মনিটর করা
  const phoneValue = watch(name);

  // ফর্ম রিসেট হলে ফোন নম্বর রিসেট করা
  if (!phoneValue && phoneNumber) {
    setPhoneNumber("");
  }

  const handleChange = (
    value: string,
    data: any,
    event: any,
    formattedValue: string,
    field: any,
  ) => {
    // react-phone-input-2 থেকে কান্ট্রি কোড পাওয়া
    const countryCode = `+${data.dialCode}`;
    // কান্ট্রি কোড ছাড়া নম্বর নেওয়া
    const numberWithoutCode = value.startsWith(countryCode)
      ? value.slice(countryCode.length)
      : value;
    setPhoneNumber(numberWithoutCode);
    // ফিল্ডের মান আপডেট করা
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
                handleChange(value, data, event, formattedValue, field)
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
              enableSearch={true} // দেশ খোঁজার জন্য সার্চ সক্ষম
              disableSearchIcon={false}
              disableDropdown={false} // দেশ নির্বাচনের জন্য ড্রপডাউন সক্ষম
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
