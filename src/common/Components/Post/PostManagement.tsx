import {updatePost} from "../../../util/api/postapi.tsx";
import React from "react";

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
    setLastModifiedDate: React.Dispatch<React.SetStateAction<string>>;
    setCategory: React.Dispatch<React.SetStateAction<string>>;
    likes: number;
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
        setLastModifiedDate,
        setCategory,
        likes
    }) => {
    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleSaveClick = async () => {
        const updatedPost = await updatePost(postId, content, title);
        if (updatedPost) {
            setSlideMessage({message: "Updated post!", color: "green", messageKey: Math.random()});
            setTitle(updatedPost.title);
            setBody(updatedPost.body);
            setLastModifiedDate(updatedPost.lastModifiedDate);
            setCategory(updatedPost.category);
        } else {
            setSlideMessage({message: "Inappropriate Content!", color: "red", messageKey: Math.random()});
            setTitle(initialTitle);
            setBody(initialContent);
        }

        setIsEditing(false);
    };

    return (
        <>
        <div className="post-actions">
            {isEditing ? (
                <>
                    <button className="post-del-btn">🔥️</button>
                    <button className="post-save-btn" onClick={handleSaveClick}>✅</button>
                </>
            ) : (
                <>
                    <button className="post-del-btn">🔥️</button>
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