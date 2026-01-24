import { useState } from 'react';
import {
  useGetAllUsersQuery,
  useToggleBlockUserMutation,
} from '@/redux/api/admin/usersApi';
import { AdminPagination } from '@/components/admin';
import { EmptyState, ConfirmationModal } from '@/components/common';
import { handleApiError, showToast } from '@/utils';
import { Users, UserCheck, UserX } from 'lucide-react';

import { Button } from '@/shadcn/components/ui/button';
import { Badge } from '@/shadcn/components/ui/badge';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/shadcn/components/ui/card';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/shadcn/components/ui/avatar';
import { ContainerLoading } from '@/components/error';

export const UsersList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: responseGetUsers, isLoading } = useGetAllUsersQuery({
    page: currentPage,
    limit: 6,
  });

  const [toggleBlockUser] = useToggleBlockUserMutation();

  const users = responseGetUsers?.data?.users || [];

  const handleBlockUnblockModal = (userId) => {
    setSelectedUserId(userId);
    setIsModalOpen(true);
  };

  const handleConfirmBlockUnblock = async () => {
    try {
      const response = await toggleBlockUser(selectedUserId).unwrap();
      if (response.success) {
        showToast.success(response.message);
      }
      setIsModalOpen(false);
    } catch (err) {
      handleApiError(err, 'There was some error blocking user');
    }
  };

  const handleCancelBlockUnblock = () => {
    setSelectedUserId(null);
    setIsModalOpen(false);
  };

  if (isLoading) return <ContainerLoading />;

  return (
    <Card className='w-full h-full shadow-sm border-0 bg-secondary-bg'>
      <CardHeader className='pb-0'>
        <div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
          <CardTitle className='text-2xl font-medium text-primary-text flex items-center gap-2'>
            <Users className='h-5 w-5' />
            Users
          </CardTitle>
        </div>
      </CardHeader>

      <CardContent className='p-6'>
        <div className='w-full space-y-4'>
          {users.length ? (
            <div className='grid gap-4'>
              {users.map((user) => (
                <Card
                  key={user._id}
                  className='overflow-hidden border-0 shadow-sm hover:shadow transition-shadow bg-primary-bg/20'>
                  <CardContent className='p-0'>
                    <div className='flex flex-col md:flex-row justify-between p-4 gap-4 md:items-center'>
                      {/* Left: Avatar + Name + Email */}
                      <div className='min-w-[200px] flex items-center gap-3'>
                        <Avatar className='h-10 w-10 border border-accent-blue/20'>
                          {user.profilePicture &&
                          user.profilePicture !==
                            'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSUpsDK5dkH7envHCdUECqq0XzCWK1Dv96XcQ&s' ? (
                            <AvatarImage
                              src={user.profilePicture}
                              alt={user.name}
                            />
                          ) : (
                            <AvatarFallback className='bg-accent-blue/10 text-accent-blue'>
                              {user.name?.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          )}
                        </Avatar>
                        <div>
                          <p className='font-medium text-primary-text'>
                            {user.name}
                          </p>
                          <p className='text-sm text-secondary-text'>
                            {user.email}
                          </p>
                        </div>
                      </div>

                      <div className='ml-auto flex flex-col md:flex-row items-center gap-4'>
                        <div className='grid grid-cols-2 md:grid-cols-3 gap-2 text-white'>
                          <Badge className='w-[110px] h-10 text-xs truncate text-center justify-center items-center flex bg-primary-bg/60 border-accent-blue/20'>
                            {user.role[0].toUpperCase() + user.role.slice(1)}
                          </Badge>
                          <Badge className='w-[110px] h-10 text-xs truncate text-center justify-center items-center flex bg-primary-bg/60 border-accent-blue/20'>
                            {user.phoneNumber || 'No Phone'}
                          </Badge>
                          <Badge
                            className={`w-[110px] h-10 text-xs truncate text-center justify-center items-center flex border-accent-blue/20 ${
                              user.status === 'active'
                                ? 'bg-green-500/20 text-green-600'
                                : 'bg-red-500/20 text-red-600'
                            }`}>
                            {user.status === 'active' ? 'Active' : 'Inactive'}
                          </Badge>
                        </div>

                        <div className='flex items-center gap-2'>
                          <Button
                            variant='ghost'
                            size='sm'
                            className={`min-w-[100px] justify-center ${
                              user.status === 'active'
                                ? 'text-red-600 hover:bg-hover-red'
                                : 'text-green-600 hover:bg-hover-green'
                            }`}
                            onClick={() => handleBlockUnblockModal(user._id)}>
                            {user.status === 'active' ? (
                              <>
                                <UserX className='h-4 w-4 mr-1' /> Block
                              </>
                            ) : (
                              <>
                                <UserCheck className='h-4 w-4 mr-1' /> Unblock
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={Users}
              title='No Users Found'
              description='There are no users available at the moment.'
            />
          )}
        </div>
      </CardContent>

      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={handleCancelBlockUnblock}
        onConfirm={handleConfirmBlockUnblock}
        title='Confirm Action'
        description='Are you sure you want to proceed with this action?'
      />
      <div className='mt-6 flex justify-center text-white sticky bottom-0'>
        {responseGetUsers?.data?.totalPages > 1 && (
          <AdminPagination
            currentPage={currentPage}
            totalPages={responseGetUsers?.data?.totalPages || 0}
            onPageChange={(page) => setCurrentPage(page)}
          />
        )}
      </div>
    </Card>
  );
};
