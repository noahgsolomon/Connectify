import React, {useEffect, useState} from "react";
import {addLikeBookmark, getLikeBookmark} from "../../../util/api/postapi.tsx";

type PostInteractionProps = {
    likes: number,
    postId: number,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const PostInteractions : React.FC<PostInteractionProps> = ({likes, postId, setLoading}) => {

    const [{liked, bookmarked}, setPostInteractions] = useState<{liked: boolean, bookmarked: boolean}>({liked: false, bookmarked: false});
    const [likeCount, setLikeCount] = useState(likes);

    const handleLikePress = async () => {
        const newLikedState = !liked;
        setPostInteractions(prevState => ({...prevState, liked: newLikedState}));
        if (newLikedState) {
            setLikeCount(prev => prev + 1);
        } else {
            setLikeCount(prev => prev - 1);
        }
        await addLikeBookmark(postId, newLikedState, bookmarked);
    };

    const handleBookmarkPress = async () => {
        const newBookmarkedState = !bookmarked;
        setPostInteractions(prevState => ({...prevState, bookmarked: newBookmarkedState}));
        await addLikeBookmark(postId, liked, newBookmarkedState);
    };

    useEffect(() => {
        const fetchData = async () => {
            const postInteractions = await getLikeBookmark(postId);

            if (postInteractions){
                setPostInteractions(postInteractions);
            }
            setLoading(false);
        }

        fetchData();

    }, [postId]);

    return (
        <>
        <div className="post-actions">
            <button className={`like-btn ${liked ? 'like-btn-active' : 'like-btn-inactive'}`} onClick={handleLikePress}>{liked ? '💖' : '❤'}</button>
            <button className={`bookmark-btn ${bookmarked ? 'bookmark-btn-active' : 'bookmark-btn-inactive'}`} onClick={handleBookmarkPress}>{bookmarked ? '📚' : '💾'}</button>
        </div>
    <div className="post-stats">
        <div className="like-count">{likeCount} likes</div>
    </div>
        </>
    )
}

export default PostInteractions;