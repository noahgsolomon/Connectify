import React, {useEffect, useRef, useState} from 'react';
import './style.css';
import Header from "../../common/Components/Header/Header.tsx";
import {getInbox, getMessageLog, sendMessage} from "../../util/api/inboxapi.tsx";
import {timeAgo} from "../../util/userUtils.tsx";
import useAuthentication from "../../setup/useAuthentication.tsx";

type InboxItem = {
    user: string,
    last_message: string,
    unread: boolean,
    timeSent: Date
}

type MessageLogItem = {
    message_id: number,
    sender: string,
    message: string,
    timeSent: Date
}

const Inbox : React.FC = () => {
    const [inboxItems, setInboxItems] = useState<Array<InboxItem>>([]);
    const [showMessageLog, setShowMessageLog] = useState(false);
    const [messageLog, setMessageLog] = useState<Array<MessageLogItem>>([]);
    const [messagedUser, setMessagedUser] = useState('');
    const [message, setMessage] = useState('');
    const [selectInbox, setSelectInbox] = useState<InboxItem | null>(null);

    const messageLogContentRef = useRef<HTMLDivElement | null>(null);

    useAuthentication();

    const username = localStorage.getItem('username') || 'default_username';

    useEffect(() => {
        const fetchData = async () => {
            const inboxes = await getInbox();
            if (inboxes){
                console.log(inboxes)
                setInboxItems(inboxes);
                if (inboxes.length > 0) {
                    setSelectInbox(inboxes[0]);
                }
            }
        }

        fetchData();

    }, []);
    const handleInboxItemClick = (item : InboxItem) => {
        setSelectInbox(item);
    };

    useEffect(() => {
        if (selectInbox){
            const fetchData = async () => {
                const messageLogFetch = await getMessageLog(selectInbox.user);
                if (messageLogFetch){
                    setMessageLog(messageLogFetch);
                    setShowMessageLog(true);
                    setMessagedUser(selectInbox.user);
                } else {
                    setShowMessageLog(false);
                }
            }
            fetchData();
        } else {
            setShowMessageLog(false);
        }
    }, [selectInbox]);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (showMessageLog && selectInbox){
            interval = setInterval(async () => {
                const messageLogFetch = await getMessageLog(selectInbox.user);
                if (messageLogFetch){
                    setMessageLog(messageLogFetch);
                }
            }, 5000);
        }
        return () => {
            if (interval) {
                clearInterval(interval);
            }
        };
    }, [showMessageLog, selectInbox]);

    const handleSendMessage = () => {
        const postData = async () => {
            const postMessage = await sendMessage(messagedUser, message);
            if (postMessage){

                setMessageLog(prev => [...prev, {
                    message_id: postMessage.message_id,
                    sender: username,
                    message: message,
                    timeSent: new Date()
                }]);

                setMessage('');
            }
        }
        postData();
    }

    useEffect(() => {
        const intervalId = setInterval(() => {
            const fetchData = async () => {
                const inboxes = await getInbox();
                if (inboxes){
                    setInboxItems(inboxes);
                }
            }

            fetchData();
        }, 5000);

        return () => clearInterval(intervalId);
    }, []);

    useEffect(() => {
        if (messageLogContentRef.current) {
            const { scrollHeight, clientHeight } = messageLogContentRef.current;
            messageLogContentRef.current.scrollTop = scrollHeight - clientHeight;
        }
    }, [messageLog]);

    return (
        <>
            <Header page={'inbox'}/>
            <div className={'chat-app'}>
                <div className="inbox-panel" style={{display: "block"}}>
                    <label className={'inbox-manage'}>
                        <input type="text" className="inbox-search" placeholder="Search..."/>
                        <button className='add-inbox'>+</button>
                    </label>
                    <div className="inbox-items">
                        {inboxItems.map((item, index) => (
                            <div className="inbox-item" key={index} onClick={() => handleInboxItemClick(item)}>
                                <div className="inbox-user">{item.user}</div>
                                <div className="inbox-last-message">{item.last_message}</div>
                                <div className="inbox-timestamp">{timeAgo(item.timeSent)}</div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className={`message-log ${showMessageLog ? 'show' : ''}`}>
                    <div className="message-log-header">
                        <h3 className="message-log-username">{messagedUser}</h3>
                    </div>
                    <div className="message-log-content" ref={messageLogContentRef}>
                        <div className="spacer"></div>
                        {messageLog.map((item) => (
                            <div className={`message ${item.sender === username ? 'sent' : 'received'}`} key={item.message_id}>
                                <div className="message-content">{item.message}<span className="message-time">{timeAgo(item.timeSent)}</span></div>
                            </div>
                        ))}
                    </div>
                    <div className="message-log-input">
                        <input type="text" className="inbox-message-input" value={message} onChange={
                            (e) => setMessage(e.target.value)
                        } placeholder="Type your message..."/>
                        <button className="send-message-btn" onClick={handleSendMessage}>Send</button>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Inbox;