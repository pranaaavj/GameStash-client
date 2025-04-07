import {
  useAddAddressMutation,
  useEditAddressMutation,
  useGetAllAddressesQuery,
  useDeleteAddressMutation,
} from '@/redux/api/user/addressApi';

import { useState, useEffect } from 'react';
import { MapPin, Plus, Trash2, Edit2, Save, Loader2, X } from 'lucide-react';

import { showToast } from '@/utils/showToast';
import { handleApiError } from '@/utils/handleApiError';

import {
  Card,
  CardTitle,
  CardHeader,
  CardContent,
} from '@/shadcn/components/ui/card';
import { Button } from '@/shadcn/components/ui/button';
import { AddressLoading } from '@/components/error';
import { validateAddress } from '@/utils/validation/validateAddress';
import { ConfirmationModal, InputField } from '@/components/common';

const initialAddressState = {
  addressName: '',
  addressLine: '',
  line2: '',
  city: '',
  state: '',
  zip: '',
  country: '',
  isDefault: false,
};

export const Address = ({ onAddressSelect }) => {
  const [addresses, setAddresses] = useState([]);
  const [addressForm, setAddressForm] = useState(initialAddressState);
  const [editingId, setEditingId] = useState(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [validation, setValidation] = useState(initialAddressState);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: responseAddresses, isLoading: isAddressLoading } =
    useGetAllAddressesQuery();
  const [addAddress, { isLoading: isAdding }] = useAddAddressMutation();
  const [editAddress, { isLoading: isEditing }] = useEditAddressMutation();
  const [deleteAddress, { isLoading: isDeleting }] = useDeleteAddressMutation();

  useEffect(() => {
    if (responseAddresses) {
      setAddresses(responseAddresses.data);
    }
  }, [responseAddresses]);

  const handleAddressClick = (address) => {
    setSelectedAddress(address);
    onAddressSelect?.(address);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setAddressForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    setValidation((prev) => ({ ...prev, [name]: '' }));
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    const validation = validateAddress(addressForm);
    setValidation(validation);
    if (Object.keys(validation).length) return;

    try {
      const response = await addAddress(addressForm).unwrap();
      if (response.success) {
        showToast.success('Address added successfully!');
        setAddressForm(initialAddressState);
        setIsAddingNew(false);
      }
    } catch (error) {
      handleApiError(error);
    }
  };

  const handleEditAddress = async (e) => {
    e.preventDefault();
    const validation = validateAddress(addressForm);
    setValidation(validation);
    if (Object.keys(validation).length) return;

    try {
      const response = await editAddress({
        addressId: editingId,
        updatedAddress: addressForm,
      }).unwrap();

      if (response.success) {
        setAddresses((prev) =>
          prev.map((addr) => (addr.id === editingId ? response.data : addr))
        );
        showToast.success('Address updated successfully!');
        setAddressForm(initialAddressState);
        setEditingId(null);
      }
    } catch (error) {
      handleApiError(error);
    }
  };

  const handleDeleteAddress = async (id) => {
    try {
      const response = await deleteAddress(id).unwrap();
      if (response.success) {
        showToast.success('Address deleted successfully!');
        setAddresses((prev) => prev.filter((addr) => addr.id !== id));
      }
    } catch (error) {
      handleApiError(error);
    }
  };

  const toggleEdit = (id) => {
    const address = addresses.find((addr) => addr.id === id);
    setAddressForm(address);
    setEditingId(id);
    setIsAddingNew(false);
  };

  if (isAddressLoading) return <AddressLoading />;

  return (
    <Card className='bg-secondary-bg/20 shadow-xl border-none text-primary-text overflow-hidden'>
      <CardHeader className='bg-secondary-bg/20'>
        <CardTitle className='text-3xl font-bold flex items-center'>
          <MapPin className='w-8 h-8 mr-2 text-primary-text' />
          Your Addresses
        </CardTitle>
      </CardHeader>

      <CardContent className='p-4 sm:p-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
        {addresses.map((address) => (
          <Card
            key={address.id}
            className={`bg-primary-bg/50 border ${
              address.id === selectedAddress?.id
                ? 'border-accent-red'
                : 'border-accent-blue/20'
            } text-primary-text shadow-md hover:shadow-lg transition-all duration-300`}>
            <CardContent className='p-4 space-y-4'>
              {editingId === address.id ? (
                <form
                  onSubmit={handleEditAddress}
                  className='space-y-4'>
                  <InputField
                    label='Location Name'
                    placeholder='Location Name'
                    name='addressName'
                    type='text'
                    value={addressForm?.addressName}
                    onChange={handleChange}
                    isInvalid={!!validation.addressName}
                    errorMessage={validation.addressName}
                  />
                  <InputField
                    label='Address Line 1'
                    placeholder='Address Line 1'
                    name='addressLine'
                    type='text'
                    value={addressForm?.addressLine}
                    onChange={handleChange}
                    isInvalid={!!validation.addressLine}
                    errorMessage={validation.addressLine}
                  />

                  <label className='flex items-center'>
                    <input
                      type='checkbox'
                      name='isDefault'
                      checked={addressForm.isDefault}
                      onChange={handleChange}
                      className='mr-2'
                    />
                    Set as default address
                  </label>

                  <div className='grid grid-cols-2 gap-2'>
                    <InputField
                      label='City'
                      placeholder='City'
                      name='city'
                      type='text'
                      value={addressForm?.city}
                      onChange={handleChange}
                      isInvalid={!!validation.city}
                      errorMessage={validation.city}
                    />
                    <InputField
                      label='State/Province'
                      placeholder='State/Province'
                      name='state'
                      type='text'
                      value={addressForm?.state}
                      onChange={handleChange}
                      isInvalid={!!validation.state}
                      errorMessage={validation.state}
                    />
                  </div>

                  <div className='grid grid-cols-2 gap-2'>
                    <InputField
                      label='ZIP/Postal Code'
                      placeholder='ZIP/Postal Code'
                      name='zip'
                      type='text'
                      value={addressForm?.zip}
                      onChange={handleChange}
                      isInvalid={!!validation.zip}
                      errorMessage={validation.zip}
                    />
                    <InputField
                      label='Country'
                      placeholder='Country'
                      name='country'
                      type='text'
                      value={addressForm?.country}
                      onChange={handleChange}
                      isInvalid={!!validation.country}
                      errorMessage={validation.country}
                    />
                  </div>

                  <div className='flex justify-end'>
                    <Button
                      type='submit'
                      size='sm'
                      disabled={isEditing}
                      className='bg-accent-blue hover:bg-hover-blue text-white'>
                      {isEditing ? (
                        <Loader2 className='w-4 h-4 animate-spin mr-2' />
                      ) : (
                        <Save className='w-4 h-4 mr-2' />
                      )}
                      Save
                    </Button>
                  </div>
                </form>
              ) : (
                <>
                  <div className='flex justify-between items-start'>
                    <div>
                      <h3 className='font-bold text-lg text-accent-blue'>
                        {address.addressName || 'Unnamed Location'}
                      </h3>
                      <p className='text-sm text-secondary-text'>
                        {address.addressLine}
                      </p>
                      {address.line2 && (
                        <p className='text-sm text-secondary-text'>
                          {address.line2}
                        </p>
                      )}
                      <p className='text-sm text-secondary-text'>
                        {address.city}, {address.state} {address.zip}
                      </p>
                      <p className='text-sm text-secondary-text'>
                        {address.country}
                      </p>
                    </div>

                    <div className='flex space-x-2'>
                      <Button
                        size='icon'
                        variant='ghost'
                        onClick={() => toggleEdit(address.id)}
                        className='text-accent-blue hover:bg-accent-blue/20'>
                        <Edit2 className='w-4 h-4' />
                        <span className='sr-only'>Edit</span>
                      </Button>

                      <Button
                        size='icon'
                        variant='ghost'
                        onClick={() => setIsModalOpen(true)}
                        className='text-red-500 hover:bg-red-500/20'>
                        {isDeleting ? (
                          <Loader2 className='h-4 w-4 animate-spin' />
                        ) : (
                          <Trash2 className='w-4 h-4' />
                        )}
                      </Button>

                      <ConfirmationModal
                        isOpen={isModalOpen}
                        onClose={() => {
                          setIsModalOpen(false);
                        }}
                        onConfirm={() => {
                          handleDeleteAddress(address.id);
                          setIsModalOpen(false);
                        }}
                        title='Confirm Action'
                        description='Are you sure you want to proceed with this action?'
                      />
                    </div>
                  </div>

                  <div>
                    {address.isDefault && !onAddressSelect && (
                      <span className='text-xs bg-accent-red/10 text-accent-red px-2 py-1 rounded'>
                        Default
                      </span>
                    )}
                    {onAddressSelect && (
                      <Button
                        className='text-xs bg-accent-red/10 text-accent-red px-2 py-1 rounded'
                        onClick={() => handleAddressClick(address)}>
                        {address.id === selectedAddress?.id
                          ? 'Selected'
                          : 'Select'}
                      </Button>
                    )}
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        ))}

        <Card
          className='bg-primary-bg/30 border-2 border-dashed border-accent-blue/30 flex items-center justify-center p-6 cursor-pointer hover:bg-primary-bg/50 transition-colors duration-300'
          onClick={() => {
            if (isAddingNew) {
              setIsAddingNew(false);
            } else {
              setIsAddingNew(true);
              setEditingId(null);
              setAddressForm(initialAddressState);
            }
          }}>
          <div className='text-center'>
            {isAddingNew ? (
              <X className='w-12 h-12 text-accent-red mx-auto mb-2' />
            ) : (
              <Plus className='w-12 h-12 text-accent-blue mx-auto mb-2' />
            )}

            <p
              className={`font-medium ${
                isAddingNew ? 'text-accent-red' : 'text-accent-blue'
              }`}>
              {isAddingNew ? 'Cancel' : 'Add New Address'}
            </p>
          </div>
        </Card>
      </CardContent>

      {isAddingNew && (
        <CardContent className='p-4'>
          <form
            onSubmit={handleAddAddress}
            className='space-y-4'>
            <div className='grid grid-cols-2 gap-2'>
              <InputField
                label='Location Name'
                placeholder='Location Name'
                name='addressName'
                type='text'
                value={addressForm.addressName}
                onChange={handleChange}
                isInvalid={!!validation.addressName}
                errorMessage={validation.addressName}
              />
              <InputField
                label='Address Line 1'
                placeholder='Address Line 1'
                name='addressLine'
                type='text'
                value={addressForm.addressLine}
                onChange={handleChange}
                isInvalid={!!validation.addressLine}
                errorMessage={validation.addressLine}
              />
            </div>

            <div className='grid grid-cols-2 gap-2'>
              <InputField
                label='City'
                placeholder='City'
                name='city'
                type='text'
                value={addressForm.city}
                onChange={handleChange}
                isInvalid={!!validation.city}
                errorMessage={validation.city}
              />
              <InputField
                label='State/Province'
                placeholder='State/Province'
                name='state'
                type='text'
                value={addressForm.state}
                onChange={handleChange}
                isInvalid={!!validation.state}
                errorMessage={validation.state}
              />
            </div>

            <div className='grid grid-cols-2 gap-2'>
              <InputField
                label='ZIP/Postal Code'
                placeholder='ZIP/Postal Code'
                name='zip'
                type='text'
                value={addressForm.zip}
                onChange={handleChange}
                isInvalid={!!validation.zip}
                errorMessage={validation.zip}
              />
              <InputField
                label='Country'
                placeholder='Country'
                name='country'
                type='text'
                value={addressForm.country}
                onChange={handleChange}
                isInvalid={!!validation.country}
                errorMessage={validation.country}
              />
            </div>

            <label className='flex items-center'>
              <input
                type='checkbox'
                name='isDefault'
                checked={addressForm.isDefault}
                onChange={handleChange}
                className='mr-2'
              />
              Set as default address
            </label>

            <div className='flex justify-end'>
              <Button
                type='submit'
                size='sm'
                disabled={isAdding}
                className='bg-accent-blue hover:bg-hover-blue text-white'>
                {isAdding ? (
                  <Loader2 className='w-4 h-4 animate-spin mr-2' />
                ) : (
                  <Save className='w-4 h-4 mr-2' />
                )}
                {isAdding ? 'Saving...' : 'Save Address'}
              </Button>
            </div>
          </form>
        </CardContent>
      )}
    </Card>
  );
};
