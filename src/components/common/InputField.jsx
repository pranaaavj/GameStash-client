import {
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Input,
  FormControl,
} from '@chakra-ui/react';

export const InputField = ({
  name,
  type,
  label,
  value,
  onChange,
  isInvalid,
  helperText,
  errorMessage,
  props,
  placeHolder,
}) => {
  return (
    <FormControl isInvalid={isInvalid}>
      <FormLabel
        fontWeight={'medium'}
        fontSize={15}>
        {label}
      </FormLabel>
      <Input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        onWheel={(e) => e.target.blur()}
        {...props}
        _hover={{
          border: '1px',
          borderColor: '#c0c0c0',
        }}
        _focus={{
          border: '1px solid #f2f2f2',
          boxShadow: 'none',
        }}
        bgColor={'#262626'}
        border={'1px solid transparent'}
        placeholder={placeHolder}
        fontSize={13}
      />
      {errorMessage && (
        <FormErrorMessage fontSize={13}>{errorMessage}</FormErrorMessage>
      )}
      {helperText && (
        <FormHelperText fontSize={13}>{helperText}</FormHelperText>
      )}
    </FormControl>
  );
};
