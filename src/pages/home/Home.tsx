import React from "react";
import './style.css';
import useAuthentication from "../../setup/useAuthentication.tsx";
const Home: React.FC = () => {
    const showContent = useAuthentication();
    if (!showContent){
        return null;
    }

    return(
        <div>
            <main>
                <section>
                    <h2>🎉 Welcome to Connectify! 🎉</h2>
                    <p>
                        Connectify is a social networking platform that brings people together from all around the world. Our mission is to make it easier for you to stay connected with friends, family, and people who share your interests. With Connectify, you can:
                    </p>
                    <ul>
                        <li>💬 Message friends and family in real-time</li>
                        <li>📝 Share your thoughts and experiences through posts</li>
                        <li>🔎 Discover new content and people based on your interests</li>
                        <li>👥 Join groups and communities to engage in discussions and events</li>
                    </ul>
                    <p>
                        Are you ready to join the Connectify community and start making meaningful connections? Click the "Sign Up" button above to create your account and get started! 🚀
                    </p>
                </section>
                <section>
                    <h2>📣 What Our Users Say</h2>
                    <blockquote>
                        "Connectify has made it easy for me to stay in touch with my friends and family. I love the user-friendly interface and the variety of features it offers! 🌟"
                        <cite>- Jane Doe</cite>
                    </blockquote>
                    <blockquote>
                        "I discovered some amazing new interests and communities through Connectify. It's a great platform for meeting like-minded people and engaging in meaningful conversations! 🌍"
                        <cite>- John Smith</cite>
                    </blockquote>
                </section>
                <section>
                    <h2>🔥 Connectify Features</h2>
                    <div>
                        <h3>💌 Private Messaging</h3>
                        <p>Stay connected with friends and family through private messaging. Share photos, videos, and links seamlessly in one-on-one or group conversations.</p>
                    </div>
                    <div>
                        <h3>📣 Posts and Sharing</h3>
                        <p>Share your thoughts, experiences, and moments with your network through text, image, and video posts. Engage with others through likes, comments, and shares.</p>
                    </div>
                    <div>
                        <h3>👥 Groups and Communities</h3>
                        <p>Discover and join groups and communities centered around your interests. Participate in discussions, events, and collaborations with like-minded individuals.</p>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default Home;