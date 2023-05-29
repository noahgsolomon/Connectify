import {deletePost, updatePost} from "../../../util/api/postapi.tsx";
import React, {useState} from "react";

type PostManagementProps = {
    postId: number;
    title: string;
    content: string;
    isEditing: boolean;
    setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
    setTitle: React.Dispatch<React.SetStateAction<string>>;
    setBody: React.Dispatch<React.SetStateAction<string>>;
    setSlideMessage: React.Dispatch<React.SetStateAction<{ message: string, color: string, messageKey: number, duration?: number } | null>>;
    initialTitle: string;
    initialContent: string;
    likes: number;
    setRefresh : React.Dispatch<React.SetStateAction<boolean>>;
};
const PostManagement: React.FC<PostManagementProps> = (
    {
        initialTitle,
        initialContent,
        postId,
        title,
        content,
        isEditing,
        setIsEditing,
        setTitle,
        setBody,
        setSlideMessage,
        likes,
        setRefresh,
    }) => {

    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleSaveClick = async () => {
        const updatedPost = await updatePost(postId, content, title);
        if (updatedPost) {
            setRefresh(prevState => !prevState);
            setSlideMessage({message: "Updated post!", color: "green", messageKey: Math.random()});
        } else {
            setSlideMessage({message: "Inappropriate Content!", color: "red", messageKey: Math.random()});
            setTitle(initialTitle);
            setBody(initialContent);
        }

        setIsEditing(false);
    };

    const handleConfirmDeleteClick = async () => {
        setShowDeleteConfirmation(false);
        const deletedPost = await deletePost(postId);
        if (deletedPost) {
            setRefresh(prevState => !prevState);
            setSlideMessage({message: "Deleted post!", color: "green", messageKey: Math.random()});
        } else {
            setSlideMessage({message: "Failed to delete post!", color: "red", messageKey: Math.random()});
        }
    }

    const renderDeleteConfirmation = () => {
        if (showDeleteConfirmation) {
            return (
                <div className="confirm-delete-container">
                    <p>Are you sure you want to delete this post?</p>
                    <div className={'delete-container-buttons'}>
                        <button className="cancel-popup-btn" onClick={() => setShowDeleteConfirmation(false)}>Cancel</button>
                        <button className="delete-btn" onClick={handleConfirmDeleteClick}>🗑️</button>
                    </div>
                </div>
            );
        }
        return null;
    };

    return (
        <>
        {renderDeleteConfirmation()}
        <div className="post-actions">
            {isEditing ? (
                <>
                    <button className="post-del-btn" onClick={() => {setShowDeleteConfirmation(true)}}>🔥️</button>
                    <button className="post-save-btn" onClick={handleSaveClick}>✅</button>
                </>
            ) : (
                <>
                    <button className="post-del-btn" onClick={() => {setShowDeleteConfirmation(true)}}>🔥️</button>
                    <button className="post-edit-btn" onClick={handleEditClick}>Edit</button>
                </>
            )}
        </div>
        <div className="post-stats">
            <div className="like-count">{likes} likes</div>
        </div>
    </>
    );
};

export default PostManagement;