import React, {useEffect, useState} from "react";
import {addLikeBookmark, getLikeBookmark} from "../../../util/api/postapi.tsx";

type PostInteractionProps = {
    likes: number,
    postId: number,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}
const PostInteractions : React.FC<PostInteractionProps> = ({likes, postId, setLoading}) => {

    const [liked, setLiked] = useState(false);
    const [bookmarked, setBookmarked] = useState(false);
    const likeText = liked ? '💖' : '❤';
    const bookmarkText = bookmarked ? '📚' : '💾';

    const [likeCount, setLikeCount] = useState(likes);
    const [likeCountChanged, setLikeCountChanged] = useState(false);
    const [fetched, setFetched] = useState(false);

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
                await addLikeBookmark(postId, liked, bookmarked);
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
            const postInteractions = await getLikeBookmark(postId);

            if (postInteractions){
                setLiked(postInteractions.liked);
                setBookmarked(postInteractions.bookmark);
            }

            setFetched(true);
            setLoading(false);
        }

        fetchData();

    }, [postId]);

    return (
        <>
        <div className="post-actions">
            <button className={`like-btn ${liked ? 'like-btn-active' : 'like-btn-inactive'}`} onClick={handleLikePress}>{likeText}</button>
            <button className={`bookmark-btn ${bookmarked ? 'bookmark-btn-active' : 'bookmark-btn-inactive'}`} onClick={handleBookmarkPress}>{bookmarkText}</button>
        </div>
    <div className="post-stats">
        <div className="like-count">{likeCount} likes</div>
    </div>
        </>
    )
}

export default PostInteractions;