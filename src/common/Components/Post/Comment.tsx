import './post.css';
import React, {useEffect, useState} from "react";
import {createComment, getPostComments} from "../../../util/api/postapi.tsx";
import {formatDateAndTime} from "../../../util/postUtils.tsx";

type Comment = {
    user: string,
    content: string,
    date: string
}

const Comment : React.FC<Comment> = ({user, content, date}) => (
    <div className={'comment'}>
        <a className="comment-author" data-username={user}>
            {user}
        </a>
        <span className="comment-text">{content}</span>
        <div className={'comment-info'}>
            <span className={'comment-time'}>{formatDateAndTime(date)}</span>
        </div>
    </div>
)

type CommentList = {
    postId : number,
    setSlideMessage: React.Dispatch<React.SetStateAction<{ message: string, color: string, messageKey: number, duration?: number } | null>>;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const CommentList : React.FC<CommentList> = ({postId, setSlideMessage, setLoading}) => {
    const [comments, setComments] = useState<Array<Comment>>([]);
    const [commentsDisplay, setCommentsDisplay] = useState(false);
    const [commentText, setCommentText] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            const postComments = await getPostComments(postId);
            if (postComments){
                setComments(postComments);
            }
            setLoading(false);
        }

        fetchData();

    }, [postId]);
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
                const uploadComment = await createComment(postId, commentText);
                if (uploadComment){
                    setComments([...comments, {user: uploadComment.user, content: uploadComment.content, date: uploadComment.date}]);
                    setSlideMessage({message: 'Uploaded comment!', color: 'var(--slide-message-bg)', messageKey: Math.random()})
                }
                else {
                    setSlideMessage({message: 'Failed to upload comment', color: 'var(--error-color)', messageKey: Math.random()})
                }
                setCommentText('');
            }

            postData();
        }
    }


    return (
        <>
            <div className="comment-container">
                <input type="text" placeholder="Comment here..." className="comment-field" value={commentText} onChange={handleCommentChange} onKeyDown={enterCommentSubmit}/>
                <button className="comment-btn" onClick={submitComment}>💬</button>
            </div>
            <div className="see-comments-container" onClick={displayComments} style={{ display: ((comments.length > 0 && !commentsDisplay) ? 'block' : 'none') }}
            >see all comments...</div>
            <div className="comments" style={{display: (commentsDisplay ? 'block' : 'none')}}>{comments.map((comment, index) => (
                <Comment key={index} {...comment}/>
            ))}</div>
        </>
    );
}

export default CommentList;
