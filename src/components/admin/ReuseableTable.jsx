import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/shadcn/components/ui/button';
import { Input } from '@/shadcn/components/ui/input';
import { Plus, Search } from 'lucide-react';
import PropTypes from 'prop-types';

export const ReuseableTable = ({ headers, data, actions }) => {
  return (
    <div className='w-auto h-full overflow-auto bg-secondary-bg rounded-lg shadow-lg'>
      <div className='flex justify-between items-center mb-4'>
        <div className='relative w-64'>
          <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-text h-4 w-4' />
          <Input
            type='text'
            placeholder='Search...'
            className='pl-10 pr-4 py-2 bg-secondary-bg text-primary-text border-accent-blue focus:border-accent-blue focus:ring focus:ring-accent-blue focus:ring-opacity-50 rounded-md'
          />
        </div>
        <Button className='bg-accent-blue text-primary-text hover:bg-accent-blue/90 transition-colors duration-200'>
          <Plus className='mr-2 h-4 w-4' /> Add Product
        </Button>
      </div>
      <Table className='w-full'>
        <TableHeader>
          <TableRow className='bg-primary-bg/5'>
            {headers.map((header, index) => (
              <TableHead
                key={index}
                className='px-6 py-3 text-left text-xs font-medium text-primary-text uppercase tracking-wider'>
                {header}
              </TableHead>
            ))}
            {actions && (
              <TableHead className='px-6 py-3 text-right text-xs font-medium text-primary-text uppercase tracking-wider'>
                Actions
              </TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((rowData, rowIndex) => (
            <TableRow
              key={rowIndex}
              className='hover:bg-primary-bg/10 transition-colors duration-200'>
              {rowData.map((cellData, cellIndex) => (
                <TableCell
                  key={cellIndex}
                  className='px-6 py-4 whitespace-nowrap text-sm text-secondary-text'>
                  {cellData}
                </TableCell>
              ))}
              {actions && (
                <TableCell className='px-6 py-4 whitespace-nowrap text-right text-sm font-medium'>
                  <div className='flex justify-end space-x-2'>
                    {actions.map((ActionButton, actionIndex) => (
                      <ActionButton
                        key={actionIndex}
                        id={rowIndex}
                      />
                    ))}
                  </div>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

ReuseableTable.propTypes = {
  headers: PropTypes.array,
  data: PropTypes.array,
  actions: PropTypes.array,
};
