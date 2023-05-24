import React from "react";
import { Link } from "react-router-dom";
interface Button {
    href: string;
    className: string;
    label: string;
}

type ButtonWithNestedElements = Button & {
    children?: Button[];
};

interface HeaderProps {
    page: 'index' | 'dashboard' | 'search' | 'profile' | 'login' | 'signup';
}

const Header: React.FC<HeaderProps> = ({ page }) => {
    const buttonConfigs: { [key in HeaderProps['page']]: (Button | ButtonWithNestedElements)[] } = {
        index: [
            { href: "/signup", className: "signup-btn", label: "📝 sign up" },
            { href: "/login", className: "login-btn", label: "🔑 login" },
        ],
        dashboard: [
            { href: "/profile", className: "profile-btn", label: "😀" },
            {
                href: "#",
                className: "notification-container",
                label: "",
                children: [
                    { href: "#", className: "notification-btn", label: "🔔" },
                    { href: "#", className: "notification-panel", label: "" },
                    { href: "#", className: "notification-items", label: "" },
                ]
            },
            { href: "/search", className: "search-btn", label: "🔎" },
            { href: "/#", className: "inbox-btn", label: "💬" },
        ],
        search: [
            { href: "/dashboard", className: "dashboard-btn", label: "🚀" },
            { href: "/profile", className: "profile-btn", label: "😀" },
        ],
        profile: [
            { href: "/dashboard", className: "dashboard-btn", label: "🚀" },
            { href: "/profile", className: "profile-btn", label: "😀" },
        ],
        login: [
            { href: "/signup", className: "signup-btn", label: "📝 sign up" },
        ],
        signup: [
            { href: "/login", className: "login-btn", label: "🔑 login" }
        ]
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
            return (
                <Link key={index} to={button.href} className={button.className}>
                    {button.label}
                </Link>
            );
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