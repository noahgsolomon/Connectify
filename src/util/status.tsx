import React, {useState, useEffect} from 'react';
interface SlideMessageProps {
    message: string;
    color: string;
    duration?: number;
    key: number
}

const SlideMessage: React.FC<SlideMessageProps> = ({ message, color, key, duration = 2000 }) => {
    const [showMessage, setShowMessage] = useState(false);

    useEffect(() => {
        setShowMessage(true);
        const timerId = setTimeout(() => {
            setShowMessage(false);

        }, duration);
        return () => clearTimeout(timerId);
    }, [key, message, duration]);

    return (
        showMessage ? (
            <div className="slide-message show" style={{ backgroundColor: color }}>
                {message}
            </div>
        ) : null
    );
};
export default SlideMessage;