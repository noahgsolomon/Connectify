import React, {useEffect, useState} from "react";
import './post.css'
import {getLikeBookmark, getPosts} from "../../../util/api/postapi.tsx";

const formatDateAndTime = (dateString : string) => {
    const dateObj = new Date(dateString);
    const now = new Date();
    const timeDifference = now.getTime() - dateObj.getTime();
    const twentyFourHours = 24 * 60 * 60 * 1000;

    const formattedDate = dateObj.toLocaleDateString();
    const formattedTime = dateObj.toLocaleTimeString([], {
        hour12: true,
        hour: '2-digit',
        minute: '2-digit'
    }).replace(/^0+/, '');

    if (timeDifference < twentyFourHours) {
        return `${formattedTime}`;
    } else {
        return `${formattedDate}`;
    }
};

type PostProps = {
    id: number
    author: string,
    title: string,
    body: string,
    lastModifiedDate: string,
    category: Category,
    likes: number,
    bookmarks: number
}

type Category = 'invalid' | 'technology' | 'travel' |
    'food' | 'fashion' | 'sports' | 'health' | 'beauty' |
    'music' | 'gaming' | 'finance' | 'education' | 'art' |
    'politics' | 'science' | 'environment' | 'literature' |
    'business' | 'entertainment' | 'history' | 'animals' |
    'miscellaneous' | 'cars' | 'philosophy' | 'photography' |
    'movies' | 'home and garden' | 'career' | 'relationships'
    | 'society' | 'parenting' | 'space' | 'DIY' | 'cooking' |
    'adventure' | 'spirituality' | 'fitness' | 'real estate' |
    'psychology' | 'personal finance' | 'hobbies';
const Post : React.FC<PostProps> = ({ id, author, title,
                                        body, lastModifiedDate, category,
                                        likes}) => {

    const [liked, setLiked] = useState(false);
    const [bookmarked, setBookmarked] = useState(false);

    const likeText = liked ? '💖' : '❤';
    const bookmarkText = bookmarked ? '📚' : '💾';
    const handleLikePress = () => {
        setLiked(prevLiked => !prevLiked);
    };

    const handleBookmarkPress = () => {
        setBookmarked(prevBookmarked => !prevBookmarked);
    };

    useEffect(() => {
        const fetchData = async () => {
            const postInteractions = await getLikeBookmark(id);
            if (postInteractions){
                setLiked(postInteractions.liked);
                setBookmarked(postInteractions.bookmark);
            }
        }

        fetchData();


    }, [id]);

    return (
        <div className={'post'}>
            <h2>{title}</h2>
            <p>{body}</p>
            <span className="category">{category}</span>
            <div className="post-meta">
                <a href="#" className="author">{author}</a>
                <span className="date">{formatDateAndTime(lastModifiedDate)}</span>
            </div>
            <div className="post-actions">
                <button className="like-btn" onClick={handleLikePress}>{likeText}</button>
                <button className="bookmark-btn" onClick={handleBookmarkPress}>{bookmarkText}</button>
            </div>
            <div className="post-stats">
                <div className="like-count">{likes} likes</div>
            </div>
            <div className="comment-container">
                <input type="text" placeholder="Comment here..." className="comment-field"/>
                <button className="comment-btn">💬</button>
            </div>
            <div className="see-comments-container" style={{display: "none"}}>see all comments...</div>
            <div className="comments"></div>
        </div>
    );
}

interface Page {
    page: number;
}

const PostList : React.FC<Page> = ({ page }) => {
    const [posts, setPosts] = useState<Array<PostProps>>([]); // Specify type

    useEffect(() => {
        const fetchPosts = async () => {
            const response = await getPosts(page);
            if (response){
                setPosts(response);
            }
        }
        fetchPosts();
    }, [page]);

    return (
        <div className={'post-wrapper'}>
            {posts.map((post) => (
                <Post key={post.id} {...post}/>
            ))}
        </div>
    );
}

export default PostList;