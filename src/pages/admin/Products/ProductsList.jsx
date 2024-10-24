/* eslint-disable react/prop-types */
import { EditButton } from '../../../components/admin';
import { ReuseableTable } from '../../../components/admin';
import { mapTableData } from '@/utils';

export const ProductList = () => {
  const headers = ['name', 'price', 'stock'];
  const products = [
    { name: 'PS4', price: '5000', stock: 0 },
    { name: 'PS3', price: '3000', stock: 1 },
    { name: 'PS2', price: '1000', stock: 2 },
  ];

  const actions = [
    ({ id }) => (
      <EditButton
        key={id}
        onClick={() => console.log(products[id])}
      />
    ),
  ];

  const tableData = mapTableData(products);

  return (
    <ReuseableTable
      headers={headers}
      data={tableData}
      actions={actions}
    />
  );
};
