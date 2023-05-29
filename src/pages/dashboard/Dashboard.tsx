import React, {useEffect, useState} from "react";
import Header from "../../common/Components/Header/Header.tsx";
import './style.css';
import useAuthentication from "../../setup/useAuthentication.tsx";
import PostList from "../../common/Components/Post/Post.tsx";
import SlideMessage from "../../util/status.tsx";
import AddPost from "./AddPost.tsx";
import Categories from "./Categories.tsx";

const Dashboard : React.FC = () => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [filter, setFilter] = useState("👨 last 30 days");
    const [lastDay, setLastDay] = useState(30);
    const [slideMessage, setSlideMessage] = useState<{ message: string, color: string, messageKey: number, duration?: number } | null>(null);
    const [displayModal, setDisplayModal] = useState(false);
    const [page, setPage] = useState<Array<number>>([0])
    const [displayFilter, setDisplayFilter] = useState(false);
    const [category, setCategory] = useState("")
    const [selectedCategory, setSelectedCategory] = useState("");
    const [refresh, setRefresh] = useState(false);
    const showContent = useAuthentication();


    useEffect(() => {
        const handleScroll = async () => {
            const d = document.documentElement;
            const offset = d.scrollTop + window.innerHeight;
            const height = d.offsetHeight;

            if (offset >= height) {
                setPage(prevPage => [...prevPage, prevPage[prevPage.length - 1] + 1]);
            }

        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };

    }, []);

    useEffect(() => {
        setPage([0]);
    }, [lastDay, category]);

    if (!showContent){
        return null;
    }

    const handleAddPost = () => {
        setDisplayModal(true);
    }

    const toggleDropdown = () => {
        if (displayFilter){
            setDisplayFilter(false);
        }
        setDropdownOpen(!dropdownOpen);
    };

    const handleFilterChange = (value : string) => {
        value = value.toLowerCase()
        if (value.includes('last day')){
            setLastDay(1);
        }
        else if (value.includes('7 days')){
            setLastDay(7);
        }
        else if (value.includes('30 days')){
            setLastDay(30);
        }
        else if (value.includes('last year')){
            setLastDay(365);
        }

        setFilter(value);
        setDropdownOpen(false);
    };

    const handleOverlayClick = () => {
        setDropdownOpen(false);
        setDisplayFilter(false);
    }

    const toggleFilter = () => {
        if (dropdownOpen){
            setDropdownOpen(false);
        }
        setDisplayFilter(!displayFilter);
    }

    const handleFilterClick = (category: string) => {
        category = (category.replaceAll('-', ' '));
        setSelectedCategory(category);
        if (category && category !== ''){
            if (category === 'any'){
                setCategory('');
            }
            else {
                setCategory(category);
            }
        }
    }



    return (
        <div>
            <Header page={"dashboard"}/>
            {(dropdownOpen || displayFilter) && <div className="overlay" onClick={handleOverlayClick}></div>}
            <div className="container">
                <button className="add-post-btn" onClick={handleAddPost}>+</button>

                <main className="center-content">
                    <div className="search-bar">
                        <div className="dropdown" onClick={toggleDropdown}>
                            <div className="dropdown-title">{filter} <span>∟</span></div>
                            <ul className={`dropdown-options ${dropdownOpen ? 'show' : ''}`}>
                                <li onClick={() => handleFilterChange("👶 last day")}>👶 Last day</li>
                                <li onClick={() => handleFilterChange("🧒 last 7 days")}>🧒 Last 7 days</li>
                                <li onClick={() => handleFilterChange("👨 last 30 days")}>👨 Last 30 days</li>
                                <li onClick={() => handleFilterChange("🧓 last year")}>🧓 Last year</li>
                            </ul>
                        </div>
                        <div className="filter-btn" onClick={toggleFilter}>🔧
                            <div className={`filter-panel ${displayFilter ? 'show' : ''}`}>
                                <Categories handleFilterClick={handleFilterClick} selectedCategory={selectedCategory}/>
                            </div>
                        </div>
                    </div>
                    <div className="post-wrapper">
                        <PostList refresh={refresh} setSlideMessage={setSlideMessage} category={category} lastDay={lastDay} page={page} setCategory={setCategory} setSelectedCategory={setSelectedCategory} user={''}/>
                    </div>
                    <AddPost setRefresh={setRefresh} setDisplayModal={setDisplayModal} displayModal={displayModal} setSlideMessage={setSlideMessage}/>
                </main>
                <div className="games-panel">
                    <div id="chess-game" className="game-item chess-game">
                        <h2 className="game-title">👑 Chess</h2>
                        <p className="game-description">Engage in a game of wits and strategy. Will you be able to checkmate your opponent?</p>
                        <div className="game-meta">
                            <span className="players">2 Players</span>
                        </div>
                        <button className="game-join-btn">🕹️</button>
                    </div>

                    <div id="trivia-game" className="game-item trivia-game">
                        <h2 className="game-title">🧠 Trivia</h2>
                        <p className="game-description">Test your knowledge across a wide range of topics in this exciting trivia game.</p>
                        <div className="game-meta">
                            <span className="players">4 Players</span>
                        </div>
                        <button className="game-join-btn">🕹️</button>
                    </div>

                    <div id="puzzle-game" className="game-item puzzle-game">
                        <h2 className="game-title">🧩 Puzzle</h2>
                        <p className="game-description">Challenge your problem-solving skills with this fun and engaging puzzle game.</p>
                        <div className="game-meta">
                            <span className="players">1 Player</span>
                        </div>
                        <button className="game-join-btn">🕹️</button>
                    </div>
                </div>
                <aside className="inbox-panel">
                    <label>
                        <input type="text" className="inbox-search" placeholder="Search..."/>
                    </label>
                    <div className="inbox-items">
                    </div>
                    <div className="message-log" style={{"display": "none"}}>
                        <div className="message-log-header">
                            <button className="back-btn">&lt;</button>
                            <h3 className="message-log-username"></h3>
                        </div>
                        <div className="message-log-content">
                        </div>
                        <div className="message-log-input">
                        </div>
                    </div>
                </aside>
            </div>
            {slideMessage && <SlideMessage {...slideMessage} />}
        </div>
    );
};

export default Dashboard;