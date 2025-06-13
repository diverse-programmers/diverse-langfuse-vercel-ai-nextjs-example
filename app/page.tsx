'use client';

import { useChat } from 'ai/react';
import { useEffect, useRef } from 'react';
import { FiSend } from 'react-icons/fi';

export default function Chat() {
  const messagesRef = useRef<HTMLDivElement>(null);

  const {
    error,
    input,
    isLoading,
    handleInputChange,
    handleSubmit,
    messages,
    reload,
    stop,
  } = useChat({
    keepLastMessageOnError: true,
    onFinish(message, { usage, finishReason }) {
      console.log('Usage', usage);
      console.log('FinishReason', finishReason);
    },
  });

  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  return (
    <div className="flex-1 p-2 sm:p-6 flex flex-col h-screen bg-white">
      <div
        ref={messagesRef}
        id="messages"
        className="flex flex-col space-y-4 p-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch flex-grow"
      >
        {messages.map(m => (
          <div key={m.id}>
            <div className={`flex items-end ${m.role === 'user' ? 'justify-end' : ''}`}>
              <div
                className={`flex flex-col space-y-2 text-md leading-tight max-w-lg mx-2 ${
                  m.role === 'user' ? 'order-1 items-end' : 'order-2 items-start'
                }`}
              >
                <div>
                  <span
                    className={`px-4 py-3 rounded-xl inline-block ${
                      m.role === 'user'
                        ? 'rounded-br-none bg-blue-500 text-white'
                        : 'rounded-bl-none bg-gray-100 text-gray-600'
                    }`}
                  >
                    {m.content}
                  </span>
                </div>
              </div>
              <img
                src={m.role === 'user' ? 'https://i.pravatar.cc/100?img=7' : 'https://cdn.icon-icons.com/icons2/1371/PNG/512/robot02_90810.png'}
                alt=""
                className={`w-6 h-6 rounded-full ${m.role === 'user' ? 'order-2' : 'order-1'}`}
              />
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-end">
            <div className="flex flex-col space-y-2 text-md leading-tight mx-2 order-2 items-start">
              <div>
                <img src="https://support.signal.org/hc/article_attachments/360016877511/typing-animation-3x.gif" alt="typing" className="w-16 ml-6" />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="border-t-2 border-gray-200 px-4 pt-4 mb-2 sm:mb-0">
        <form onSubmit={handleSubmit} className="relative flex">
          <input
            className="text-md w-full focus:outline-none focus:placeholder-gray-400 text-gray-600 placeholder-gray-600 pl-5 pr-16 bg-gray-100 border-2 border-gray-200 focus:border-blue-500 rounded-full py-2"
            value={input}
            placeholder="Say something..."
            onChange={handleInputChange}
            disabled={isLoading || error != null}
          />
          <div className="absolute right-2 items-center inset-y-0 hidden sm:flex">
            <button
              type="submit"
              disabled={isLoading || error != null}
              className="inline-flex items-center justify-center rounded-full h-8 w-8 transition duration-200 ease-in-out text-white bg-blue-500 hover:bg-blue-600 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FiSend className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>

      {error && (
        <div className="fixed top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>An error occurred. <button onClick={() => reload()} className="underline">Retry</button></p>
        </div>
      )}
    </div>
  );
}
