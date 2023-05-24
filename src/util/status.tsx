import React, { useState, useEffect } from 'react';
interface SlideMessageProps {
    message: string;
    color: string;
    duration?: number;
}

const SlideMessage: React.FC<SlideMessageProps> = ({ message, color, duration = 2000 }) => {
    const [showMessage, setShowMessage]
        = useState(false);

    useEffect(() => {
        setShowMessage(true);
        const timerId = setTimeout(() => setShowMessage(false), duration);
        return () => clearTimeout(timerId);
    }, [message, duration]);

    return (
        showMessage ? (
            <div className="slide-message show" style={{ backgroundColor: color }}>
                {message}
            </div>
        ) : null
    );
};
export default SlideMessage;