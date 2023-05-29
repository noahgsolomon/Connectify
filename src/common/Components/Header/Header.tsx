import React from "react";
import { Link } from "react-router-dom";
import NotificationButton from "./NotificationButton.tsx";
interface Button {
    href: string;
    className: string;
    label: string | React.ReactNode;
    isReactNode?: boolean;
}

type ButtonWithNestedElements = Button & {
    children?: Button[];
};

interface HeaderProps {
    page: 'app' | 'auth'
}

const Header: React.FC<HeaderProps> = ({ page }) => {
    const emoji = localStorage.getItem('emoji') || "😀";

    const buttonConfigs: { [key in HeaderProps['page']]: (Button | ButtonWithNestedElements)[] } = {
        auth: [
            { href: "/signup", className: "signup-btn", label: "📝 sign up" },
            { href: "/login", className: "login-btn", label: "🔑 login" },
        ],
        app: [
            { href: "/profile", className: "profile-btn", label: emoji },
            {
                href: "#",
                className: "notification-container",
                label: <NotificationButton />,
                isReactNode: true
            },
            { href: "/inbox", className: "inbox-btn", label: "💬" },
        ],
    };

    function renderButton(button: Button | ButtonWithNestedElements, index: number) {
        if ('children' in button) {
            return (
                <div key={index} className={button.className}>
                    {button.children?.map((childButton, childIndex) => (
                        <Link key={childIndex} to={childButton.href} className={childButton.className}>
                            {childButton.label}
                        </Link>
                    ))}
                </div>
            );
        } else {
            if (button.isReactNode) {
                return (
                    <div key={index} className={button.className}>
                        {button.label}
                    </div>
                )
            }
            else {
                return (
                    <Link key={index} to={button.href} className={button.className}>
                        {button.label}
                    </Link>
                );
            }
        }
    }

    return (
        <header>
            <h1><Link to="/" className="logo">🌐 Connectify</Link></h1>
            <nav>
                {buttonConfigs[page].map(renderButton)}
            </nav>
        </header>
    );
};

export default Header;