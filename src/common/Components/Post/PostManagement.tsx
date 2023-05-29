import {deletePost, updatePost} from "../../../util/api/postapi.tsx";
import React, {useEffect} from "react";

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
    setDeletePost : React.Dispatch<React.SetStateAction<boolean>> | null;
    setDeletedPost : React.Dispatch<React.SetStateAction<boolean>> | null;
    deletedPost: boolean;
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
        setDeletePost,
        setDeletedPost,
        deletedPost,
    }) => {

    if (setDeletePost === null) throw new Error("setDeletePost is null");
    if (setDeletedPost === null) throw new Error("setDeletedPost is null");

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

    useEffect(() => {
        if (deletedPost) {
            setDeletePost(false);
            const removeData = async () => {
                const deletedPost = await deletePost(postId);
                console.log(deletedPost);
                if (deletedPost) {
                    setRefresh(prevState => !prevState);
                    setSlideMessage({message: "Deleted post!", color: "green", messageKey: Math.random()});
                } else {
                    setSlideMessage({message: "Failed to delete post!", color: "red", messageKey: Math.random()});
                }
            }
            removeData();

            setDeletedPost(false);
        }
    }, [deletedPost]);

    const renderDeleteConfirmation = () => {
        setDeletePost(true);
    };

    return (
        <>
        <div className="post-actions">
            {isEditing ? (
                <>
                    <button className="post-del-btn" onClick={renderDeleteConfirmation}>🔥️</button>
                    <button className="post-save-btn" onClick={handleSaveClick}>✅</button>
                </>
            ) : (
                <>
                    <button className="post-del-btn" onClick={renderDeleteConfirmation}>🔥️</button>
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