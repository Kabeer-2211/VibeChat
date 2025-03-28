import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea"
import { Control, FieldValues, Path } from "react-hook-form";

interface InputProps<T extends FieldValues> {
  control: Control<T>;
  label: string;
  name: Path<T>;
  type?: string;
  placeholder?: string;
  hasFormDescription?: boolean;
  formDescription?: string;
  isTextarea?: boolean;
}
const CustomInput = <T extends FieldValues>({
  control,
  hasFormDescription = false,
  formDescription,
  label,
  name,
  placeholder,
  type = "text",
  isTextarea = false,
}: InputProps<T>) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            {isTextarea ? (
              <Textarea
                placeholder={placeholder}
                className="resize-none"
                {...field}
              />
            ) : (
              <Input type={type} placeholder={placeholder} {...field} />
            )}
          </FormControl>
          {hasFormDescription && (
            <FormDescription>{formDescription}</FormDescription>
          )}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default CustomInput;
