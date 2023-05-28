import React, {useEffect, useState} from "react";
import './post.css';

import {
    getPostsFilter
} from "../../../util/api/postapi.tsx";

import CommentList from "./Comment.tsx";
import PostInteractions from "./PostInteractions.tsx";
import {formatDateAndTime} from "../../../util/postUtils.tsx";
import {Link} from "react-router-dom";


type PostProps = {
    id: number
    username: string,
    title: string,
    body: string,
    lastModifiedDate: string,
    category: Category,
    likes: number,
    bookmarks: number,
    setSlideMessage: React.Dispatch<React.SetStateAction<{ message: string, color: string, messageKey: number, duration?: number } | null>>;
    // The setPostDisplay function prop, to control display of post from the parent component
    setPostDisplay: (value: boolean) => void;
    setCategory: React.Dispatch<React.SetStateAction<string>>;
    setSelectedCategory: React.Dispatch<React.SetStateAction<string>>;
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
                                        likes, setSlideMessage, setCategory, setSelectedCategory}) => {

    const [interactionsLoading, setInteractionsLoading] = useState(true);
    const [commentsLoading, setCommentsLoading] = useState(true);
    const [postDisplay, setPostDisplay] = useState(false);

    useEffect(() => {
        if (!interactionsLoading && !commentsLoading){
            setPostDisplay(true);
        }
    }, [interactionsLoading, commentsLoading]);

    const handleCategoryClick = () => {
        setSelectedCategory(category.replaceAll('-', ' '));
        setCategory(category);
    };

    return (
        <div className={`post ${postDisplay ? ('') : ('hidden')}`}>
            <h2>{title}</h2>
            <p>{body}</p>
                <span onClick={handleCategoryClick} className={`category 
            ${category.toLowerCase().replace(/ /g, '-')}`}>
                #{category}
            </span>
            <div className="post-meta">
                <Link to={`/user/${username}`} className={"author"}>{username}</Link>
                <span className="date">{formatDateAndTime(lastModifiedDate)}</span>
            </div>
            <PostInteractions postId={id} likes={likes} setLoading={setInteractionsLoading}/>
            <CommentList postId={id} setSlideMessage={setSlideMessage} setLoading={setCommentsLoading}/>
        </div>
    );
}

interface PostListProps {
    setSlideMessage: React.Dispatch<React.SetStateAction<{ message: string, color: string, messageKey: number, duration?: number } | null>>;
    page: Array<number>;
    category: string;
    lastDay: number;
    setCategory: React.Dispatch<React.SetStateAction<string>>;
    setSelectedCategory: React.Dispatch<React.SetStateAction<string>>;
    user: string | null;
}

const PostList : React.FC<PostListProps> = ({ setSlideMessage, page, category, lastDay, setCategory, setSelectedCategory, user }) => {

    const [isLoading, setIsLoading] = useState(true);
    const [posts, setPosts] = useState<Array<PostProps>>([]); // Specify type
    const [postDisplays, setPostDisplays] = useState<{[id: number] : boolean}>({});
    const [allPostsLoaded, setAllPostsLoaded] = useState(false);
    const [lastFetchPage, setLastFetchPage] = useState( page[page.length - 1]);
    const [postTransition, setPostTransition] = useState(false); // Used to trigger useEffect on page change
    const [init, setInit] = useState(true);
    const [emptyPosts, setEmptyPosts] = useState(false);

    useEffect(() => {

        if (init) {
            setInit(false);
            return;
        }

        const fetchPosts = async () => {
            const response = await getPostsFilter(category, lastDay, user, lastFetchPage);
            if (response){
                setPosts(prevState => [...prevState, ...response]);
                setLastFetchPage(lastFetchPage + 1);
            }
            setIsLoading(false);
        }
        fetchPosts();
    }, [page, init]);

    useEffect(() => {

        if (!init){
            setPostTransition(true);

            setTimeout(() => {
                setPosts([]);
                const fetchPosts = async () => {
                    const response = await getPostsFilter(category, lastDay, user, 0);
                    if (response){
                        if (response.length === 0){
                            setEmptyPosts(true);
                        }
                        else{
                            setEmptyPosts(false);
                        }
                        setPosts(response);
                        setLastFetchPage(1);
                    }
                }
                fetchPosts();
                setTimeout(() => {
                    setPostTransition(false);
                }, 1000);
            }, 200);

        }

    },[lastDay, category]);



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
        !emptyPosts ? (
        <div className={`post-container ${postTransition ? 'hide' : ''}`}>
            {posts.map((post, index) => (
                <Post key={index} {...post} setSlideMessage={setSlideMessage} setCategory={setCategory} setSelectedCategory={setSelectedCategory}
                      setPostDisplay={(value) => { // Define a function called setPostDisplay that takes a boolean value as a parameter
                          setPostDisplays(prevState => { // Call setPostDisplays function with a callback function
                              return {...prevState, [post.id]: value}// Update the display setting for the post with post.id
                          });
                      }} />
            ))}
        </div>
    ) :
            <div className={`post-container}`}>
                <div className={`post`}>
                    <h2>No posts here 😢</h2>
                    <p>Check back some other time, or make a post yourself!</p>
                    <span className={`category 
                           ${category.toLowerCase().replace(/ /g, '-')}`}>
                        #{category}
                    </span>
                </div>
            </div>
    );
}

export default PostList;