/* eslint-disable react/prop-types */
import { useState } from 'react';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Box,
} from '@chakra-ui/react';
import { Calendar } from '@/shadcn/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/shadcn/components/ui/popover';

export const DatePicker = ({
  name,
  label,
  value,
  onChange,
  isInvalid,
  helperText,
  errorMessage,
  placeHolder,
  ...props
}) => {
  const [open, setOpen] = useState(false);

  const handleSelect = (date) => {
    if (!date) return;

    const adjustedDate = new Date(date);
    if (name === 'startDate') {
      adjustedDate.setHours(0, 0, 0, 0); // Set start date to midnight
    } else if (name === 'endDate') {
      adjustedDate.setHours(23, 59, 59, 999); // Set end date to end of the day
    }

    const syntheticEvent = {
      target: {
        name,
        value: adjustedDate.toISOString(),
      },
    };
    onChange(syntheticEvent);
  };

  return (
    <FormControl isInvalid={isInvalid}>
      <FormLabel
        fontWeight={'medium'}
        fontSize={15}>
        {label}
      </FormLabel>

      <Popover
        open={open}
        onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Box
            as='button'
            type='button'
            display='flex'
            alignItems='center'
            width='100%'
            px={3}
            py={2}
            fontSize={13}
            textAlign='left'
            bgColor='#262626'
            border='1px solid transparent'
            borderRadius='md'
            color={value ? 'white' : 'gray.400'}
            _hover={{ border: '1px', borderColor: '#c0c0c0' }}
            _focus={{ border: '1px', borderColor: '#f2f2f2' }}
            whiteSpace='nowrap'
            overflow='hidden'
            textOverflow='ellipsis'
            {...props}>
            <CalendarIcon className='mr-2 h-4 w-4' />
            {value ? (
              format(value, 'PPP')
            ) : (
              <span>{placeHolder || 'Pick a date'}</span>
            )}
          </Box>
        </PopoverTrigger>
        <PopoverContent
          className='w-auto p-0 border-none'
          align='start'
          sideOffset={5}
          style={{
            zIndex: 1000,
            position: 'absolute',
          }}>
          <div className='bg-[#262626] text-white'>
            <Calendar
              mode='single'
              selected={value ? new Date(value) : undefined}
              onSelect={handleSelect}
              initialFocus
              className='border-none bg-[#262626] text-white'
            />
          </div>
        </PopoverContent>
      </Popover>

      {errorMessage && (
        <FormErrorMessage fontSize={13}>{errorMessage}</FormErrorMessage>
      )}
      {helperText && (
        <FormHelperText fontSize={13}>{helperText}</FormHelperText>
      )}
    </FormControl>
  );
};
