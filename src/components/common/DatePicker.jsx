/* eslint-disable react/prop-types */
import { useState } from 'react';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

export default function DatePicker({ className, onDateChange }) {
  const [date, setDate] = useState();
  const [open, setOpen] = useState(false);

  const handleSelect = (selectedDate) => {
    setDate(selectedDate);
    // Note: We're not closing the popover here anymore
    if (onDateChange) {
      onDateChange(selectedDate);
    }
  };

  return (
    <div className={cn('grid gap-2', className)}>
      <Popover
        open={open}
        onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id='date'
            variant={'outline'}
            className={cn(
              'w-full justify-start text-left font-normal',
              !date && 'text-muted-foreground'
            )}>
            <CalendarIcon className='mr-2 h-4 w-4' />
            {date ? format(date, 'PPP') : <span>Pick a date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className='w-auto p-0'
          align='start'>
          <Calendar
            mode='single'
            selected={date}
            onSelect={handleSelect}
            initialFocus
          />
          <div className='p-3 border-t border-border'>
            <Button
              variant='default'
              className='w-full'
              onClick={() => setOpen(false)}>
              Done
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
