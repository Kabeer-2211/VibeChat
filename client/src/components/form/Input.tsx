import { Control, FieldValues, Path } from "react-hook-form";

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

interface InputProps<T extends FieldValues> {
  control: Control<T>;
  label: string;
  name: Path<T>;
  type?: string;
  placeholder?: string;
  hasFormDescription?: boolean;
  formDescription?: string;
  isTextarea?: boolean;
  setImagePreview?: CallableFunction;
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
  setImagePreview
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
              type === 'file' ? <Input
                type="file"
                accept="image/png, image/jpg, image/jpeg"
                onChange={(e) => {
                  const files = e.target.files;
                  if (files && files[0]) {
                    field.onChange(files[0]);
                    if (setImagePreview) {
                      const url = URL.createObjectURL(files[0]);
                      setImagePreview(url);
                    }
                  }
                }}
              /> : <Input type={type} placeholder={placeholder} {...field} />
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
