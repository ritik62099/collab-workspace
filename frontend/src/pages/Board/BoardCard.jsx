import React from 'react';
import { useNavigate } from 'react-router-dom';
import Dropdown, { DropdownItem } from '../../components/common/Dropdown';
import Avatar from '../../components/common/Avatar';

const BoardCard = ({ board, onDelete }) => {
  const navigate = useNavigate();

  return (
    <div
      className="group relative rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all cursor-pointer h-32"
      style={{ backgroundColor: board.background || '#FF9933' }}
      onClick={() => navigate(`/board/${board._id}`)}
    >
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-black/40" />

      {/* Content */}
      <div className="relative h-full p-4 flex flex-col justify-between">
        <div className="flex items-start justify-between">
          <h3 className="text-white font-bold text-lg line-clamp-2 pr-2">{board.title}</h3>
          <Dropdown
            align="right"
            trigger={
              <button
                onClick={(e) => e.stopPropagation()}
                className="p-1.5 hover:bg-white/20 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
              >
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                </svg>
              </button>
            }
          >
            <DropdownItem
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/board/${board._id}`);
              }}
              icon={({ className }) => (
                <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            >
              Open Board
            </DropdownItem>
            <DropdownItem
              onClick={(e) => {
                e.stopPropagation();
                onDelete(board._id);
              }}
              danger
              icon={({ className }) => (
                <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              )}
            >
              Delete Board
            </DropdownItem>
          </Dropdown>
        </div>

        {board.createdBy && (
          <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Avatar
              src={board.createdBy.avatar}
              alt={board.createdBy.name}
              size="sm"
              className="ring-2 ring-white/50"
            />
            <span className="text-xs text-white font-medium">{board.createdBy.name}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default BoardCard;
