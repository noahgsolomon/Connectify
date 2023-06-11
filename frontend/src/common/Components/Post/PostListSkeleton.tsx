import React from "react";

const PostListSkeleton: React.FC = () => {
    return (
        <div className="post-container skeleton">
            {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="post skeleton">
                    <div className="skeleton-title"></div>
                    <div className="skeleton-body"></div>
                    <div className="skeleton-category"></div>
                    <div className="post-meta">
                        <div className="skeleton-author"></div>
                        <div className="skeleton-date"></div>
                    </div>
                    <div className="skeleton-interactions"></div>
                    <div className="skeleton-comments"></div>
                </div>
            ))}
        </div>
    );
}

export default PostListSkeleton;