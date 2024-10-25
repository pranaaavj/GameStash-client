import { FormControl, FormLabel, FormErrorMessage } from '@chakra-ui/react';
import {
  Select,
  SelectItem,
  SelectValue,
  SelectTrigger,
  SelectContent,
} from '@/shadcn/components/ui/select';
import PropTypes from 'prop-types';

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
        value={value} // Ensure the selected value is displayed
      >
        <SelectTrigger className='w-full bg-[#262626] ring-0 hover:border text-secondary-text rounded-md'>
          <SelectValue placeholder={placeholder}>
            {value
              ? options.find((option) => option.value === value)?.label
              : ''}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem
              key={option.value}
              value={option.value}>
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

SelectField.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
  isInvalid: PropTypes.bool,
  errorMessage: PropTypes.string,
  placeholder: PropTypes.string,
};
