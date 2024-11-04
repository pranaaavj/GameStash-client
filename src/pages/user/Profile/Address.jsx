import { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/shadcn/components/ui/card';
import { Button } from '@/shadcn/components/ui/button';
// import {
//   useGetAddressesQuery,
//   useEditAddressMutation,
//   useDeleteAddressMutation,
// } from '@/redux/api/addressApi';
// import { toast } from 'sonner';
import { InputField } from '@/components/common';
import { MapPin, Plus, Trash2, Edit2, Save } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function Address() {
  // const {
  //   data: addressData,
  //   isError: isAddressError,
  //   error: addressError,
  // } = useGetAddressesQuery();
  // const [editAddress, { isError: isEditError, error: editError }] =
  //   useEditAddressMutation();
  // const [deleteAddress] = useDeleteAddressMutation();
  const [editingId, setEditingId] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    line1: '',
    line2: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
  });
  console.log(setAddresses);
  // useEffect(() => {
  //   if (addressData) {
  //     setAddresses(addressData.data);
  //   }
  // }, [addressData]);

  const handleEdit = (address) => {
    setEditingId(address.id);
    setFormData({
      name: address.name,
      line1: address.line1,
      line2: address.line2,
      city: address.city,
      state: address.state,
      zipCode: address.zipCode,
      country: address.country,
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // const handleSave = async (e) => {
  //   // e.preventDefault();
  //   // try {
  //   //   const response = await editAddress({
  //   //     id: editingId,
  //   //     data: formData,
  //   //   }).unwrap();
  //   //   setAddresses((prev) =>
  //   //     prev.map((addr) => (addr.id === editingId ? response.data : addr))
  //   //   );
  //   //   setEditingId(null);
  //   //   toast.success('Address updated successfully');
  //   // } catch (error) {
  //   //   console.error('Error updating address', error);
  //   // }
  // };

  // const handleDelete = async (id) => {
  //   // try {
  //   //   await deleteAddress(id).unwrap();
  //   //   setAddresses((prev) => prev.filter((addr) => addr.id !== id));
  //   //   toast.success('Address deleted successfully');
  //   // } catch (error) {
  //   //   console.error('Error deleting address', error);
  //   // }
  // };

  const handleAddNewAddress = () => {
    setFormData({
      name: '',
      line1: '',
      line2: '',
      city: '',
      state: '',
      zipCode: '',
      country: '',
    });
    setEditingId(null);
    // Trigger a form or modal for adding a new address if needed
  };

  return (
    <Card className='bg-gradient-to-br from-primary-bg to-secondary-bg border-none shadow-lg text-primary-text overflow-hidden'>
      <CardHeader className='bg-accent-blue/10 border-b border-accent-blue/20'>
        <CardTitle className='text-3xl font-bold flex items-center'>
          <MapPin className='w-8 h-8 mr-2 text-accent-blue' />
          Shipping Destinations
        </CardTitle>
      </CardHeader>
      <CardContent className='p-4 sm:p-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
        {addresses.map((address) => (
          <Card
            key={address.id}
            className='bg-primary-bg/50 border border-accent-blue/20 shadow-md hover:shadow-lg transition-all duration-300'>
            <CardContent className='p-4 space-y-4'>
              <AnimatePresence mode='wait'>
                {editingId === address.id ? (
                  <motion.form
                    // onSubmit={handleSave}
                    className='space-y-4'
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.1 }}>
                    <InputField
                      label='Location Name'
                      placeholder='Location Name'
                      name='name'
                      type='text'
                      value={formData.name}
                      onChange={handleChange}
                      isInvalid={false}
                      errorMessage=''
                    />
                    <InputField
                      label='Address Line 1'
                      placeholder='Address Line 1'
                      name='line1'
                      type='text'
                      value={formData.line1}
                      onChange={handleChange}
                      isInvalid={false}
                      errorMessage=''
                    />
                    <InputField
                      label='Address Line 2 (Optional)'
                      placeholder='Address Line 2'
                      name='line2'
                      type='text'
                      value={formData.line2}
                      onChange={handleChange}
                      isInvalid={false}
                      errorMessage=''
                    />
                    <div className='grid grid-cols-2 gap-2'>
                      <InputField
                        label='City'
                        placeholder='City'
                        name='city'
                        type='text'
                        value={formData.city}
                        onChange={handleChange}
                        isInvalid={false}
                        errorMessage=''
                      />
                      <InputField
                        label='State/Province'
                        placeholder='State/Province'
                        name='state'
                        type='text'
                        value={formData.state}
                        onChange={handleChange}
                        isInvalid={false}
                        errorMessage=''
                      />
                    </div>
                    <div className='grid grid-cols-2 gap-2'>
                      <InputField
                        label='ZIP/Postal Code'
                        placeholder='ZIP/Postal Code'
                        name='zipCode'
                        type='text'
                        value={formData.zipCode}
                        onChange={handleChange}
                        isInvalid={false}
                        errorMessage=''
                      />
                      <InputField
                        label='Country'
                        placeholder='Country'
                        name='country'
                        type='text'
                        value={formData.country}
                        onChange={handleChange}
                        isInvalid={false}
                        errorMessage=''
                      />
                    </div>
                    <div className='flex justify-end'>
                      <Button
                        type='submit'
                        size='sm'
                        className='bg-accent-blue hover:bg-hover-blue text-white'>
                        <Save className='w-4 h-4 mr-2' /> Save
                      </Button>
                    </div>
                  </motion.form>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.1 }}
                    className='flex justify-between items-start'>
                    <div>
                      <h3 className='font-bold text-lg text-accent-blue'>
                        {address.name || 'Unnamed Location'}
                      </h3>
                      <p className='text-sm text-secondary-text'>
                        {address.line1}
                      </p>
                      {address.line2 && (
                        <p className='text-sm text-secondary-text'>
                          {address.line2}
                        </p>
                      )}
                      <p className='text-sm text-secondary-text'>
                        {address.city}, {address.state} {address.zipCode}
                      </p>
                      <p className='text-sm text-secondary-text'>
                        {address.country}
                      </p>
                    </div>
                    <div className='flex space-x-2'>
                      <Button
                        size='icon'
                        variant='ghost'
                        onClick={() => handleEdit(address)}
                        className='text-accent-blue hover:bg-accent-blue/20'>
                        <Edit2 className='w-4 h-4' />
                        <span className='sr-only'>Edit</span>
                      </Button>
                      <Button
                        size='icon'
                        variant='ghost'
                        // onClick={() => handleDelete(address.id)}
                        className='text-red-500 hover:bg-red-500/20'>
                        <Trash2 className='w-4 h-4' />
                        <span className='sr-only'>Delete</span>
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        ))}
        <Card
          className='bg-primary-bg/30 border-2 border-dashed border-accent-blue/30 flex items-center justify-center p-6 cursor-pointer hover:bg-primary-bg/50 transition-colors duration-300'
          onClick={handleAddNewAddress}>
          <div className='text-center'>
            <Plus className='w-12 h-12 mx-auto text-accent-blue mb-2' />
            <p className='font-medium text-accent-blue'>Add New Address</p>
          </div>
        </Card>
      </CardContent>
      {/* {isAddressError && (
        <Alert
          Icon={CircleX}
          variant='destructive'
          description={addressError?.data?.message || 'Error loading addresses'}
        />
      )}
      {isEditError && (
        <Alert
          Icon={CircleX}
          variant='destructive'
          description={editError?.data?.message || 'Error updating address'}
        />
      )} */}
    </Card>
  );
}
