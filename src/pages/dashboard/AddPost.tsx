import React, {useEffect, useRef, useState} from "react";
import './style.css';
import {createPost} from "../../util/api/postapi.tsx";

type AddPostProps = {
    setDisplayModal : React.Dispatch<React.SetStateAction<boolean>>
    displayModal : boolean,
    setSlideMessage: React.Dispatch<React.SetStateAction<{ message: string, color: string, messageKey: number, duration?: number } | null>>;
}

const AddPost : React.FC<AddPostProps> = ({ setDisplayModal, displayModal, setSlideMessage }) => {


    const modalContentRef = useRef<HTMLDivElement>(null);
    const [createPostTitle, setCreatePostTitle] = useState('');
    const [createPostBody, setCreatePostBody] = useState('');
    const [submitBtnText, setSubmitBtnText] = useState('🚀');
    const [submitBtnBg, setSubmitBtnBg] = useState('var(--detail-color)');
    const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
        if (modalContentRef.current && !modalContentRef.current.contains(event.target as Node)) {
            setDisplayModal(false);
        }
    };

    const handlePostTitleChange = (e : React.ChangeEvent<HTMLInputElement>) => {
        setCreatePostTitle(e.target.value);
    }

    const handlePostBodyChange = (e : React.ChangeEvent<HTMLTextAreaElement>) => {
        setCreatePostBody(e.target.value);
    }

    useEffect(() => {
        document.body.style.overflowY = displayModal ? 'hidden' : 'auto';
    }, [displayModal]);

    const submitPost = (e : React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (createPostTitle.length < 5 || createPostTitle.length > 50 || createPostBody.length < 10 ||  createPostBody.length > 500 ){
            setSlideMessage({message: 'Invalid post length', color: 'var(--error-color)', messageKey: Math.random()});
            setSubmitBtnBg('red');
            setSubmitBtnText('🔥');
        }
        else{
            const postData = async () => {
                const post = await createPost(createPostTitle, createPostBody);
                if (post.status === 'valid'){
                    setSlideMessage({message: 'Uploaded post!', color: 'var(--slide-message-bg)', messageKey: Math.random()})
                    setSubmitBtnBg('green');
                    setSubmitBtnText('✅');
                }
                else if (post.status === 'invalid') {
                    setSlideMessage({message: 'This content does adhere to our policies', color: 'var(--error-color)', messageKey: Math.random()})
                    setSubmitBtnBg('red');
                    setSubmitBtnText('🔥');
                }
                else{
                    setSlideMessage({message: 'Internal server error', color: 'var(--error-color)', messageKey: Math.random()})
                    setSubmitBtnBg('red');
                    setSubmitBtnText('🔥');
                }
            }

            postData();
        }
        setTimeout(() => {
            setDisplayModal(false);
            setCreatePostBody('');
            setCreatePostTitle('');
            setSubmitBtnText('🚀');
            setSubmitBtnBg('var(--detail-color)');
        }, 1000);


    }

    return (
        <div id="postModal" onClick={handleOverlayClick} className={'modal'} style={{display: (displayModal ? 'block' : 'none')}}>
            <div className="modal-content" ref={modalContentRef}>
                <div className="modal-header">
                    <h2>Create a new post</h2>
                </div>
                <div className="modal-body">
                    <form id="postForm" noValidate={true} onSubmit={submitPost}>
                        <label htmlFor="postTitle"></label>
                        <input type="text" id="postTitle" name="postTitle" maxLength={100} placeholder="Title" required value={createPostTitle} onChange={handlePostTitleChange}/>
                        <label htmlFor="postBody"></label>
                        <textarea id="postBody" name="postBody" rows={5} maxLength={500} placeholder="Body" required value={createPostBody} onChange={handlePostBodyChange}/>
                        <p><span id="charCount">{createPostBody.length}</span>/500</p>
                        <input type="submit" value={submitBtnText} className="btn" style={{backgroundColor: submitBtnBg}}/>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default AddPost;