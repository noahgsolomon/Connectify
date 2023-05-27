import React, {useEffect, useState} from 'react';
import './style.css';
import Header from "../../common/Components/Header/Header.tsx";
import {getInbox, getMessageLog, sendMessage} from "../../util/api/inboxapi.tsx";
import {timeAgo} from "../../util/userUtils.tsx";

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
    // For simplicity, I'm using some static data for the inbox items.
    // You should replace this with real data from your application.
    const [inboxItems, setInboxItems] = useState<Array<InboxItem>>([]);
    const [showMessageLog, setShowMessageLog] = useState(false);
    const [messageLog, setMessageLog] = useState<Array<MessageLogItem>>([]);
    const [messagedUser, setMessagedUser] = useState('');
    const [message, setMessage] = useState('');
    const username = localStorage.getItem('username');

    useEffect(() => {
        const fetchData = async () => {
            const inboxes = await getInbox();
            if (inboxes){
                console.log(inboxes)
                setInboxItems(inboxes);
            }
        }

        fetchData();

    }, []);
    const handleInboxItemClick = (item : InboxItem) => {
        setMessageLog([]);
        const fetchData = async () => {
            const messageLogFetch = await getMessageLog(item.user);
            if (messageLogFetch){
                setMessagedUser(item.user);
                setMessageLog(messageLogFetch);
            }
        }

        fetchData();
        setShowMessageLog(true);
    };

    const handleSendMessage = () => {
        const postData = async () => {
            const postMessage = await sendMessage(messagedUser, message);
            if (postMessage){
                setMessageLog(prev => [...prev, {
                    message_id: postMessage.message_id,
                    sender: postMessage.sender,
                    message: postMessage.message,
                    timeSent: postMessage.timeSent
                }]);
                setMessage('');
            }
        }
        postData();
    }

    setInterval(async () => {
        if (showMessageLog){
            const messageLogFetch = await getMessageLog(messagedUser);
            if (messageLogFetch){
                setMessageLog(messageLogFetch);
            }
        }
    }, 5000);

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
                        <button className="back-btn" onClick={() => {
                            setShowMessageLog(false);
                            setMessageLog([]);
                        }}>&lt;</button>
                        <h3 className="message-log-username">{messagedUser}</h3>
                    </div>
                    <div className="message-log-content">
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