import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
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
  onlyCountries: [],
}: Props) {
  return (
    <FormField
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <PhoneInput
              country={country}
              onlyCountries={["bd"]}
              value={field.value}
              onChange={field.onChange}
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
