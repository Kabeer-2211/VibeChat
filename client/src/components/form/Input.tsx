import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Control } from 'react-hook-form'

interface InputProps {
    control: Control<{ email: string, password: string }>;
    label: string;
    name: string;
    type?: string;
    placeholder: string;
    hasFormDescription: boolean;
    formDescription?: string;
}
const CustomInput = ({ control, hasFormDescription = false, formDescription, label, name, placeholder, type = 'text' }: InputProps) => {
    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem>
                    <FormLabel>{label}</FormLabel>
                    <FormControl>
                        <Input type={type} placeholder={placeholder} {...field} />
                    </FormControl>
                    {hasFormDescription && <FormDescription>{formDescription}</FormDescription>}
                    <FormMessage />
                </FormItem>
            )}
        />
    )
}

export default CustomInput