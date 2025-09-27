import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import libphonenumber from "libphonenumber-js";
import { useState } from "react";
import { useFormContext } from "react-hook-form";
import PhoneInput from "react-phone-input-2";

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
  onlyCountries = ["bd"],
}: Props) {
  const { control, watch, setValue } = useFormContext();
  const [phoneNumber, setPhoneNumber] = useState("");

  // ফর্মের মান মনিটর করা
  const phoneValue = watch(name);

  // ফর্ম রিসেট হলে শুধুমাত্র নম্বর রিসেট করা
  if (!phoneValue && phoneNumber) {
    setPhoneNumber("");
  }

  // দেশের কোড নির্ধারণ
  const getCountryCode = () => {
    if (phoneValue && phoneValue.startsWith("+")) {
      const parsedNumber =
        libphonenumber.parsePhoneNumberFromString(phoneValue);
      if (parsedNumber) {
        return `+${parsedNumber.countryCallingCode}`;
      }
    }
    // ডিফল্ট কান্ট্রি কোড
    const defaultCountryCode = libphonenumber.getCountryCallingCode(
      country.toUpperCase(),
    );
    return `+${defaultCountryCode}`;
  };

  const countryCode = getCountryCode();

  const handleChange = (value: string) => {
    // শুধুমাত্র ব্যবহারকারীর লেখা নম্বর নেওয়া
    const numberWithoutCode = value.startsWith(countryCode)
      ? value.slice(countryCode.length)
      : value;
    setPhoneNumber(numberWithoutCode);
    setValue(name, `${countryCode}${numberWithoutCode}`, {
      shouldValidate: true,
    });
  };

  return (
    <FormField
      control={control}
      name={name}
      render={() => (
        <FormItem className={className}>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <PhoneInput
              country={country}
              onlyCountries={onlyCountries}
              value={`${countryCode}${phoneNumber}`}
              onChange={handleChange}
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
              enableSearch={false}
              disableSearchIcon={true}
              disableDropdown={true}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
