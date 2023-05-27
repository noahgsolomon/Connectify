import React, {useEffect, useState} from 'react';
import './style.css';
import Header from "../../common/Components/Header/Header.tsx";
const Inbox : React.FC = () => {
    // For simplicity, I'm using some static data for the inbox items.
    // You should replace this with real data from your application.
    const [inboxItems, setInboxItems] = useState<Array<{user: string, lastMessage: string, timestamp: string}>>([]);


    const [showMessageLog, setShowMessageLog] = useState(false);
    useEffect(() => {
        setInboxItems([
            { user: 'antoonsworld', lastMessage: 'g', timestamp: '5/24/2023' },
            { user: 'TheBenyas', lastMessage: 'Master micah!', timestamp: '5/22/2023' },
            { user: 'Dzbenyaa', lastMessage: 'you\'re famous', timestamp: '5/18/2023' },
            { user: 'turtleman', lastMessage: 'Hfty', timestamp: '5/17/2023' }
        ]);
    }, []);
    const handleInboxItemClick = (item) => {
        // Here you can do something with the clicked item.
        // For example, you can show the message log for this user.
        setShowMessageLog(true);
    };

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
                                <div className="inbox-last-message">{item.lastMessage}</div>
                                <div className="inbox-timestamp">{item.timestamp}</div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="message-log" style={{display: showMessageLog ? 'block' : 'none'}}>
                    <div className="message-log-header">
                        <button className="back-btn" onClick={() => setShowMessageLog(false)}>&lt;</button>
                        <h3 className="message-log-username">turtleman</h3>
                    </div>
                    <div className="message-log-content">
                        <div className="message received">
                            <div className="message-content">Fuck you<span className="message-time">5/13/2023</span>
                            </div>
                        </div>
                        <div className="message sent">
                            <div className="message-content">hello sir<span className="message-time">5/13/2023</span>
                            </div>
                        </div>
                        <div className="message sent">
                            <div className="message-content">whats up g<span className="message-time">5/13/2023</span>
                            </div>
                        </div>
                        <div className="message received">
                            <div className="message-content">Sup n<span className="message-time">5/13/2023</span></div>
                        </div>
                        <div className="message sent">
                            <div className="message-content">nun<span className="message-time">5/13/2023</span></div>
                        </div>
                        <div className="message sent">
                            <div className="message-content">sup<span className="message-time">5/14/2023</span></div>
                        </div>
                        <div className="message sent">
                            <div className="message-content">chess?<span className="message-time">5/14/2023</span></div>
                        </div>
                        <div className="message received">
                            <div className="message-content">Fuck no<span className="message-time">5/15/2023</span>
                            </div>
                        </div>
                        <div className="message sent">
                            <div className="message-content">Hello sir<span className="message-time">5/17/2023</span>
                            </div>
                        </div>
                        <div className="message sent">
                            <div className="message-content">Sup<span className="message-time">5/17/2023</span></div>
                        </div>
                        <div className="message received">
                            <div className="message-content">K<span className="message-time">5/17/2023</span></div>
                        </div>
                        <div className="message received">
                            <div className="message-content">Bi<span className="message-time">5/17/2023</span></div>
                        </div>
                        <div className="message received">
                            <div className="message-content">Hgh<span className="message-time">5/17/2023</span></div>
                        </div>
                        <div className="message received">
                            <div className="message-content">Jbf<span className="message-time">5/17/2023</span></div>
                        </div>
                        <div className="message received">
                            <div className="message-content">Ggft<span className="message-time">5/17/2023</span></div>
                        </div>
                        <div className="message received">
                            <div className="message-content">Fucj<span className="message-time">5/17/2023</span></div>
                        </div>
                        <div className="message received">
                            <div className="message-content">Fuck<span className="message-time">5/17/2023</span></div>
                        </div>
                        <div className="message received">
                            <div className="message-content">Hfty<span className="message-time">5/17/2023</span></div>
                        </div>
                    </div>
                    <div className="message-log-input">
                        <input type="text" className="inbox-message-input" placeholder="Type your message..."/>
                        <button className="send-message-btn">Send</button>
                    </div>
                </div>
            </div>
    </>
    );
}

export default Inbox;