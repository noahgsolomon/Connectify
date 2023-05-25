import React, {useEffect, useState} from "react";
import './post.css';

import {
    getPosts
} from "../../../util/api/postapi.tsx";

import CommentList from "./Comment.tsx";
import PostInteractions from "./PostInteractions.tsx";
import {formatDateAndTime} from "../../../util/postUtils.tsx";


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
    // The setPostDisplay function prop, to control display of post from the parent component
    setPostDisplay: (value: boolean) => void;
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

const Post : React.FC<PostProps> = ({ id, username, title,
                                        body, lastModifiedDate, category,
                                        likes, setSlideMessage}) => {

    const [interactionsLoading, setInteractionsLoading] = useState(true);
    const [commentsLoading, setCommentsLoading] = useState(true);
    const [postDisplay, setPostDisplay] = useState(false);

    useEffect(() => {
        if (!interactionsLoading && !commentsLoading){
            setPostDisplay(true);
        }
    }, [interactionsLoading, commentsLoading]);

    return (
        <div className={postDisplay ? ('post') : ('post hidden')}>
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
            <PostInteractions postId={id} likes={likes} setLoading={setInteractionsLoading}/>
            <CommentList postId={id} setSlideMessage={setSlideMessage} setLoading={setCommentsLoading}/>
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
    const [postDisplays, setPostDisplays] = useState<{[id: number] : boolean}>({});
    const [allPostsLoaded, setAllPostsLoaded] = useState(false);

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

    useEffect(() => {
        if (Object.values(postDisplays).every(value => value)) {
            setAllPostsLoaded(true);
        }
    }, [postDisplays]);

    if (isLoading || !allPostsLoaded) {
        return (
            <div className="loader loading-indicator" id="loader">
                <span className="loader-blink"></span>
            </div>
        );
    }

    return (
        <>
            {posts.map((post) => (
                <Post key={post.id} {...post} setSlideMessage={setSlideMessage}
                      setPostDisplay={(value) => { // Define a function called setPostDisplay that takes a boolean value as a parameter
                          setPostDisplays(prevState => { // Call setPostDisplays function with a callback function
                              return {...prevState, [post.id]: value}// Update the display setting for the post with post.id
                          });
                      }} />
            ))}
        </>
    );
}

export default PostList;