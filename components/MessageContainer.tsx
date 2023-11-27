import React, { useEffect, useRef } from 'react';
import { MessageState } from '@/types/chat';
import {
  ChatBubbleLeftEllipsisIcon,
  UserCircleIcon,
} from '@heroicons/react/24/solid';
import ReactMarkdown from 'react-markdown';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

import styles from '@/styles/Home.module.css';

export const MessageContainer: React.FC<{
  loading: boolean;
  messageState: MessageState;
}> = ({ loading, messageState }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { messages } = messageState;

  useEffect(
    () => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }),
    [messages],
  );

  const apiMsgClass = 'bg-ec_blue_03 p-6 flex  border-b border-b-slate-200';
  const userMsgClass = (index: number) =>
    loading && index === messages.length - 1
      ? styles.usermessagewaiting + ' flex'
      : 'bg-white p-6 flex';

  return (
    <div className="overflow-y-auto scroll-smooth scroll-pe-6 scroll-pb-5 ">
      {messages.map((message, index) => {
        const className =
          message.type === 'apiMessage' ? apiMsgClass : userMsgClass(index);
        return (
          <div key={`chatMessage-${index}`}>
            <div className={`${className} border-b border-b-slate-200`}>
              {message.type === 'apiMessage' ? (
                <ChatBubbleLeftEllipsisIcon className="shrink-0 h-[24px] w-[24px] text-ec_blue mr-3" />
              ) : (
                <UserCircleIcon className="shrink-0 h-[24px] w-[24px] text-slate-800 mr-3" />
              )}
              <div className={styles.markdownanswer + ' '}>
                <ReactMarkdown linkTarget="_blank">
                  {message.message}
                </ReactMarkdown>
              </div>
            </div>
            {message.sourceDocs && (
              <div className="" key={`sourceDocsAccordion-${index}`}>
                <Accordion type="single" collapsible className="flex-col">
                  {message.sourceDocs.map((doc, index) => (
                    <div key={`messageSourceDocs-${index}`}>
                      <AccordionItem value={`item-${index}`}>
                        <AccordionTrigger>
                          <h3>Source {index + 1}</h3>
                        </AccordionTrigger>
                        <AccordionContent>
                          <ReactMarkdown linkTarget="_blank">
                            {doc.pageContent}
                          </ReactMarkdown>
                          <p className="mt-2">
                            <b>Source:</b> {doc.metadata.source}
                          </p>
                          <div className="text-xs">
                            I am an AI powered search tool, all data provided
                            should be fact checked
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </div>
                  ))}
                </Accordion>
              </div>
            )}
          </div>
        );
      })}
      <div ref={messagesEndRef} className="h-4" />
    </div>
  );
};