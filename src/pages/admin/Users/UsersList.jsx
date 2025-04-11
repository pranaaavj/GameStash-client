import {
  ToggleList,
  ReuseableTable,
  AdminPagination,
} from '@/components/admin';
import {
  useGetAllUsersQuery,
  useToggleBlockUserMutation,
} from '@/redux/api/admin/usersApi';
import { toast } from 'sonner';
import { Alert, EmptyState } from '@/components/common';
import { useState } from 'react';
import { mapTableData } from '@/utils';
import { ConfirmationModal } from '@/components/common';
import { CircleX, Users } from 'lucide-react';

export const UsersList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetching data through RTK
  const {
    data: responseGetUsers,
    isSuccess,
    isError,
    error,
  } = useGetAllUsersQuery({ page: currentPage, limit: 6 });

  const [
    toggleBlockUser,
    { isError: isToggleBlockError, error: toggleBlockError },
  ] = useToggleBlockUserMutation();

  const tableHeaders = ['name', 'email', 'status', 'role'];

  const actions = [
    ({ id: userId, status }) => {
      return (
        <ToggleList
          onClick={() => handleBlockUnblockModal(userId)}
          title={status ? 'Block' : 'Unblock'}
        />
      );
    },
  ];

  const handleBlockUnblockModal = (userId) => {
    setSelectedUser(userId);
    setIsModalOpen(true);
  };

  const handleConfirmBlockUnblock = async () => {
    try {
      const responseToggleBlock = await toggleBlockUser(selectedUser);

      if (responseToggleBlock.success) {
        toast.success(responseToggleBlock.message, { duration: 1500 });
      }

      setIsModalOpen(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleCancelBlockUnblock = () => {
    setSelectedUser(null);
    setIsModalOpen(false);
  };
  const tableData = mapTableData(
    isSuccess ? responseGetUsers?.data?.users : [],
    tableHeaders
  );

  if (isError) {
    console.log(error);
  }

  return (
    <div className='w-full h-full flex flex-col overflow-auto bg-secondary-bg rounded-lg p-4'>
      <div className='mb-6 text-center'>
        <h1 className='text-2xl md:text-3xl font-bold text-primary-text mb-4'>
          Users
        </h1>
      </div>

      {/* Table */}
      <div className='w-full overflow-x-auto flex-grow no-scrollbar'>
        {tableData.length ? (
          <ReuseableTable
            headers={tableHeaders}
            data={tableData}
            actions={actions}
          />
        ) : (
          <EmptyState
            icon={Users}
            title='No Users Found'
            description='There are no users available at the moment.'
          />
        )}
      </div>

      {isToggleBlockError && (
        <Alert
          Icon={CircleX}
          variant='destructive'
          description={
            toggleBlockError?.data?.message ||
            'Something went wrong! Please try again.'
          }
        />
      )}

      {/* Pagination */}
      <div className='sticky bottom-0 mt-4'>
        {responseGetUsers?.data?.users?.length > 1 && (
          <AdminPagination
            currentPage={currentPage}
            totalPages={responseGetUsers?.data?.totalPages || 0}
            onPageChange={(page) => setCurrentPage(page)}
          />
        )}
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={handleCancelBlockUnblock}
        onConfirm={handleConfirmBlockUnblock}
        title='Confirm Action'
        description='Are you sure you want to proceed with this action?'
      />
    </div>
  );
};
