import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shadcn/components/ui/table';
import PropTypes from 'prop-types';

export const ReuseableTable = ({ headers, data, actions }) => {
  return (
    <Table className='w-full table-fixed border-collapse'>
      <TableHeader>
        <TableRow className='bg-primary-bg/10 border-b-2 border-accent-blue'>
          {/* Mapping Table Headers */}
          {headers.map((header, index) => (
            <TableHead
              key={index}
              className={`px-2 md:px-6 py-3 text-xs md:text-sm text-center font-semibold text-primary-text uppercase tracking-wider`}>
              {/* ${
                header === 'Genre' ||
                header === 'Platform' ||
                header === 'Stock'
                  ? 'hidden md:table-cell'
                  : ''
              }` */}

              {header === 'isActive' ? 'status' : header}
            </TableHead>
          ))}
          {actions && (
            <TableHead className='px-2 md:px-6 py-3 text-center text-xs md:text-sm font-semibold text-primary-text uppercase tracking-wider'>
              Actions
            </TableHead>
          )}
        </TableRow>
      </TableHeader>
      <TableBody>
        {/* Mapping table data */}
        {data.map((row) => (
          <TableRow
            key={row?.id}
            className='transition-colors duration-200 even:bg-primary-bg/5 hover:bg-primary-bg/20'>
            {row?.data?.map((cellData, cellIndex) => (
              <TableCell
                key={cellIndex}
                className={`px-2 md:px-6 py-3 text-center text-xs md:text-sm text-secondary-text border-b border-accent-blue/20 overflow-hidden truncate `}>
                {/* ${
                  cellIndex === 2 || cellIndex === 3 || cellIndex === 4
                    ? 'hidden md:table-cell'
                    : ''
                } */}

                {/* Check if cellData is boolean for isActive status */}
                {typeof cellData === 'boolean'
                  ? cellData
                    ? 'Active'
                    : 'Inactive'
                  : cellData}
              </TableCell>
            ))}
            {actions && (
              <TableCell className='px-2 md:px-6 py-3 text-center text-xs md:text-sm font-medium border-b border-accent-blue/20'>
                <div className='flex justify-center space-x-2'>
                  {actions.map((ActionButton, actionIndex) => (
                    <div
                      key={actionIndex}
                      className='transition-transform duration-200 hover:scale-105 active:scale-95'>
                      <ActionButton
                        id={row?.id}
                        isActive={row?.isActive}
                        status={row?.status === 'active'}
                      />
                    </div>
                  ))}
                </div>
              </TableCell>
            )}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

ReuseableTable.propTypes = {
  headers: PropTypes.array,
  data: PropTypes.array,
  actions: PropTypes.array,
};
