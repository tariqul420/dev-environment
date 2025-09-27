import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useEffect, useState } from "react";
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
  const [phoneNumber, setPhoneNumber] = useState("");

  return (
    <FormField
      name={name}
      render={({ field }) => {
        // ফর্ম রিসেটের সময় শুধুমাত্র নম্বর রিসেট করা
        useEffect(() => {
          if (!field.value) {
            setPhoneNumber("");
          }
        }, [field.value]);

        // ফোন নম্বর থেকে দেশের কোড আলাদা করা
        const countryCode =
          `+${field.value?.replace(/\D/g, "").slice(0, 3)}` || "+880";
        const handleChange = (value: string) => {
          // শুধুমাত্র ব্যবহারকারীর লেখা নম্বর নেওয়া
          const numberWithoutCode = value.startsWith(countryCode)
            ? value.slice(countryCode.length)
            : value;
          setPhoneNumber(numberWithoutCode);
          field.onChange(`${countryCode}${numberWithoutCode}`);
        };

        return (
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
        );
      }}
    />
  );
}
