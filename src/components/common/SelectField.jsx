/* eslint-disable react/prop-types */
import { FormControl, FormLabel, FormErrorMessage } from '@chakra-ui/react';
import {
  Select,
  SelectItem,
  SelectValue,
  SelectTrigger,
  SelectContent,
} from '@/shadcn/components/ui/select';

export const SelectField = ({
  name,
  label,
  value,
  onChange,
  options,
  isInvalid,
  errorMessage,
  placeholder,
}) => {
  return (
    <FormControl isInvalid={isInvalid}>
      <FormLabel
        fontWeight='medium'
        fontSize={15}>
        {label}
      </FormLabel>
      <Select
        onValueChange={(newValue) =>
          onChange({ target: { name, value: newValue } })
        }
        value={value}>
        <SelectTrigger className='w-full bg-[#262626] text-secondary-text rounded-md border-0 ring-0 focus:ring-0 focus:outline-none focus-visible:ring-0 focus-visible:outline-none hover:bg-[#303030] transition-all'>
          <SelectValue placeholder={placeholder}>
            {options.find((option) => option.value === value)?.label || ''}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem
              key={option.value}
              value={option.value}
              className='hover:bg-[#2a2a2a] transition-all focus:ring-0 focus:outline-none'>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {isInvalid && (
        <FormErrorMessage fontSize={13}>{errorMessage}</FormErrorMessage>
      )}
    </FormControl>
  );
};
