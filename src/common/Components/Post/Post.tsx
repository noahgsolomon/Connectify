import React, {useEffect, useState} from "react";
import './post.css';

import {
    addLikeBookmark,
    createComment,
    getLikeBookmark,
    getPostComments,
    getPosts
} from "../../../util/api/postapi.tsx";

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
    username: string,
    title: string,
    body: string,
    lastModifiedDate: string,
    category: Category,
    likes: number,
    bookmarks: number,
    setSlideMessage: React.Dispatch<React.SetStateAction<{ message: string, color: string, key: number, duration?: number } | null>>;

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

type Comment = {
    user: string,
    content: string,
    date: string
}

const Comment : React.FC<Comment> = ({user, content}) => (
    <div className={'comment'}>
        <a className="comment-author" data-username={user}>
            {user}
        </a>
        <span className="comment-text">{content}</span>
    </div>
)

const Post : React.FC<PostProps> = ({ id, username, title,
                                        body, lastModifiedDate, category,
                                        likes, setSlideMessage}) => {

    const [liked, setLiked] = useState(false);
    const [bookmarked, setBookmarked] = useState(false);
    const likeText = liked ? '💖' : '❤';
    const bookmarkText = bookmarked ? '📚' : '💾';
    const [comments, setComments] = useState<Array<Comment>>([]);
    const [commentsDisplay, setCommentsDisplay] = useState(false);
    const [commentText, setCommentText] = useState("");
    const [likeCount, setLikeCount] = useState(likes);
    const [likeCountChanged, setLikeCountChanged] = useState(false);
    const [fetched, setFetched] = useState(false);
    const [loading, setLoading] = useState(true);


    const handleLikePress = () => {
        setLiked(prevLiked => !prevLiked);
        setLikeCountChanged(true);
    };

    const handleBookmarkPress = () => {
        setBookmarked(prevBookmarked => !prevBookmarked);
    };

    useEffect( () => {
        if (fetched){
            const postData = async () => {
                await addLikeBookmark(id, liked, bookmarked);
            }
            postData();
        }


    }, [liked, bookmarked]);

    useEffect(() => {
        if (likeCountChanged && fetched){
            if (liked){
                setLikeCount(likeCount + 1);
            }
            else setLikeCount(likeCount - 1);
        }


    }, [likeCountChanged, liked]);

    useEffect(() => {
        const fetchData = async () => {
            const postInteractions = await getLikeBookmark(id);
            const postComments = await getPostComments(id);
            if (postInteractions){
                setLiked(postInteractions.liked);
                setBookmarked(postInteractions.bookmark);
            }
            if (postComments){
                setComments(postComments);
            }
            setFetched(true);
            setLoading(false);
        }

        fetchData();

    }, [id]);

    const displayComments = () => {
        setCommentsDisplay(true);
    }

    const handleCommentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCommentText(e.target.value);
    }

    const enterCommentSubmit = (event : React.KeyboardEvent) => {
        if (event.key === 'Enter') {
            event.preventDefault();

            submitComment();
        }
    }

    const submitComment = () => {
        if (commentText.length > 0){
            const postData = async () => {
                const uploadComment = await createComment(id, commentText);
                if (uploadComment){
                    setComments([...comments, {user: uploadComment.user, content: uploadComment.content, date: uploadComment.date}]);
                    setSlideMessage({message: 'Uploaded comment!', color: 'var(--slide-message-bg)', key: Math.random()})
                }
                else {
                    setSlideMessage({message: 'Failed to upload comment', color: 'var(--error-color)', key: Math.random()})
                }
                setCommentText('');
            }

            postData();
        }
    }

    if (loading){
        return (
            <>
            </>
        )
    }

    return (
        <div className={'post'}>
            <h2>{title}</h2>
            <p>{body}</p>
                <span className={`category 
            ${category.toLowerCase().replace(/ /g, '-')}`}>
                #{category}
            </span>
            <div className="post-meta">
                <a href="#" className="author">{username}</a>
                <span className="date">{formatDateAndTime(lastModifiedDate)}</span>
            </div>
            <div className="post-actions">
                <button className={`like-btn ${liked ? 'like-btn-active' : 'like-btn-inactive'}`} onClick={handleLikePress}>{likeText}</button>
                <button className={`bookmark-btn ${bookmarked ? 'bookmark-btn-active' : 'bookmark-btn-inactive'}`} onClick={handleBookmarkPress}>{bookmarkText}</button>
            </div>
            <div className="post-stats">
                <div className="like-count">{likeCount} likes</div>
            </div>
            <div className="comment-container">
                <input type="text" placeholder="Comment here..." className="comment-field" value={commentText} onChange={handleCommentChange} onKeyDown={enterCommentSubmit}/>
                <button className="comment-btn" onClick={submitComment}>💬</button>
            </div>
            <div className="see-comments-container" onClick={displayComments} style={{ display: ((comments.length > 0 && !commentsDisplay) ? 'block' : 'none') }}
            >see all comments...</div>
            <div className="comments" style={{display: (commentsDisplay ? 'block' : 'none')}}>{comments.map((comment, index) => (
                <Comment key={index} {...comment}/>
            ))}</div>
        </div>
    );
}

interface PostListProps {
    setSlideMessage: React.Dispatch<React.SetStateAction<{ message: string, color: string, key: number, duration?: number } | null>>;
    page: number;
}

const PostList : React.FC<PostListProps> = ({ setSlideMessage, page }) => {

    const [isLoading, setIsLoading] = useState(true);
    const [posts, setPosts] = useState<Array<PostProps>>([]); // Specify type

    useEffect(() => {
        const fetchPosts = async () => {
            const response = await getPosts(page);
            if (response){
                setPosts(response);
            }
            setIsLoading(false);
        }
        fetchPosts();
    }, [page]);

    if (isLoading) {
        return (
                <div className="loader loading-indicator" id="loader">
                    <span className="loader-blink"></span>
                </div>
        );
    }

    return (
        <>
            {posts.map((post) => (
                <Post key={post.id} {...post} setSlideMessage={setSlideMessage}/>
            ))}
        </>
    );
}

export default PostList;