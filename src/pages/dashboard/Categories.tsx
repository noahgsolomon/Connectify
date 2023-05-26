import React from "react";

type CategoriesProps = {
    handleFilterClick: (category: string) => void;
    selectedCategory: string;
}

const Categories : React.FC<CategoriesProps> = ({ handleFilterClick, selectedCategory }) => {
    const categories = [
        'any','technology', 'travel', 'food', 'fashion', 'sports', 'health', 'beauty', 'music', 'gaming', 'animals', 'finance',
        'education', 'art', 'politics', 'science', 'environment', 'literature', 'business', 'entertainment', 'history',
        'miscellaneous', 'cars', 'philosophy', 'photography', 'movies', 'home-and-garden', 'career',
        'relationships', 'society', 'parenting', 'space', 'diy', 'cooking', 'adventure', 'spirituality',
        'fitness', 'real-estate', 'psychology', 'personal-finance', 'hobbies', 'current-events'
    ];
    return (
        <>
            <div className="filter-category">Filter by category</div>
            {categories.map((category, index) => (
                <div key={index} className={`filter-option category ${category}`} onClick={() => handleFilterClick(category)} style={{boxShadow: (selectedCategory === category) ? '0 0 20px #ffff00' : ''}}>
                    #{category.replaceAll('-', ' ')}
                </div>
            ))}
        </>
    );
}

export default Categories;