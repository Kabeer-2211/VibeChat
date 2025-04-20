import moment from "moment";

import { Chat, Friend } from "@/types/apiResponse";

const MessageBubble = ({
  chat,
  friend,
  isFriend = true,
}: {
  chat: Chat;
  friend?: Friend;
  isFriend?: boolean;
}) => {
  const receiverDetail =
    friend?.friendId._id === chat.receiverId
      ? friend?.friendId
      : friend?.userId;
  return (
    <div className="flex items-start gap-2.5 mb-3">
      <img
        className="w-8 h-8 rounded-full"
        src={`${import.meta.env.VITE_BASE_URL}/avatars/${
          receiverDetail?.avatar
        }`}
        alt="Jese image"
      />
      <div className="flex flex-col gap-1 w-full max-w-[320px]">
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <span className="text-sm font-semibold text-gray-900">
            {receiverDetail?.username}
          </span>
          <span className="text-sm font-normal text-gray-500">
            {moment(chat.createdAt).format("h:mm")}
          </span>
        </div>
        <div
          className={`flex flex-col leading-1.5 p-4 border-gray-200 ${
            isFriend ? "bg-gray-200" : "bg-[#2563eb]"
          } rounded-e-xl rounded-es-xl`}
        >
          <p
            className={`text-sm font-normal ${
              isFriend ? "text-gray-900" : "text-white"
            }`}
          >
            {chat.message}
          </p>
        </div>
        <span className="text-sm font-normal text-gray-500">
          {chat.isSeen ? "Seen" : ""}
        </span>
      </div>
      {/* <button
        id="dropdownMenuIconButton"
        data-dropdown-toggle="dropdownDots"
        data-dropdown-placement="bottom-start"
        className="inline-flex self-center items-center p-2 text-sm font-medium text-center text-gray-900 bg-white rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-50"
        type="button"
      >
        <svg
          className="w-4 h-4 text-gray-500"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 4 15"
        >
          <path d="M3.5 1.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm0 6.041a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm0 5.959a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" />
        </svg>
      </button> */}
      {/* <div
        id="dropdownDots"
        className="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow-sm w-40 dark:bg-gray-700 dark:divide-gray-600"
      >
        <ul
          className="py-2 text-sm text-gray-700 dark:text-gray-200"
          aria-labelledby="dropdownMenuIconButton"
        >
          <li>
            <a
              href="#"
              className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
            >
              Reply
            </a>
          </li>
          <li>
            <a
              href="#"
              className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
            >
              Forward
            </a>
          </li>
          <li>
            <a
              href="#"
              className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
            >
              Copy
            </a>
          </li>
          <li>
            <a
              href="#"
              className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
            >
              Report
            </a>
          </li>
          <li>
            <a
              href="#"
              className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
            >
              Delete
            </a>
          </li>
        </ul>
      </div> */}
    </div>
  );
};

export default MessageBubble;
