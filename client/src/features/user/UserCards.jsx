// import React, { useState } from 'react'
import Delete from './Delete'
import EditModal from './EditModal'
import { formatDate, usersRoleColors } from '@/utils/constants'
import { useAuth } from '@/store';

export default function UserCards({ item }) {
  // const [isOpen, setIsOpen] = useState(false);
  // const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  // const [userId, setUserId] = useState(null);
  const { user } = useAuth();
  return (
    <div className="bg-white rounded-lg p-6 max-w-[400px] w-full mt-4  ">
      
      <div className="flex gap-3">
        <div className="avatar avatar-placeholder">
          <div className="w-12 h-12  rounded-full bg-gray-300">
            {item?.avatar ? (
              <img
                src={item?.avatar}
                alt={item?.fullname}
                referrerPolicy="no-referrer"
                loading="lazy"
              />
            ) : (
              <span className="text-sm flex items-center justify-center">
                {item?.fullname
                  ?.split(' ')
                  .map((name) => name[0])
                  .join('')
                  .toUpperCase()}
              </span>
            )}
          </div>
        </div>

        <div className="space-y-1 flex-1">
          <h2 className="text-lg font-semibold">{item?.fullname}</h2>
          <p className="text-gray-500 text-sm">{item?.email}</p>

        <div
                  className={`capitalize badge badge-sm font-semibold my-2 ${
                    usersRoleColors[item.role]
                  }`}
                >
                  {item.role}
                </div>
          

          <p className="text-gray-500 text-sm">{item?.phone}</p>
          <p className="text-gray-400 text-xs">
            Joined: {formatDate(item?.createdAt)}
          </p>
        </div>
      </div>

      {user.role === "admin" && (
      <div className="flex justify-end gap-2 mt-4">
        {/* we want to send our user or id into modal */}
        <EditModal  item={item}   />
        <Delete  item={item} />
      </div>
      )}
    </div>
  )
}