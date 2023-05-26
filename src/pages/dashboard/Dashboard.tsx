import React, {useEffect, useState} from "react";
import Header from "../../common/Components/Header/Header.tsx";
import './style.css';
import useAuthentication from "../../setup/useAuthentication.tsx";
import PostList from "../../common/Components/Post/Post.tsx";
import SlideMessage from "../../util/status.tsx";
import AddPost from "./AddPost.tsx";

const Dashboard : React.FC = () => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [filter, setFilter] = useState("👨 last 30 days");
    const [slideMessage, setSlideMessage] = useState<{ message: string, color: string, messageKey: number, duration?: number } | null>(null);
    const [displayModal, setDisplayModal] = useState(false);
    const [page, setPage] = useState<Array<number>>([0])
    const [displayFilter, setDisplayFilter] = useState(false);
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
                              <div className="filter-category">Filter by category</div>
                              <div className="filter-option category technology">#Technology</div>
                              <div className="filter-option category travel">#Travel</div>
                              <div className="filter-option category food">#Food</div>
                              <div className="filter-option category fashion">#Fashion</div>
                              <div className="filter-option category sports">#Sports</div>
                              <div className="filter-option category health">#Health</div>
                              <div className="filter-option category beauty">#Beauty</div>
                              <div className="filter-option category music">#Music</div>
                              <div className="filter-option category gaming">#Gaming</div>
                              <div className="filter-option category animals">#Animals</div>
                              <div className="filter-option category finance">#Finance</div>
                              <div className="filter-option category education">#Education</div>
                              <div className="filter-option category art">#Art</div>
                              <div className="filter-option category politics">#Politics</div>
                              <div className="filter-option category science">#Science</div>
                              <div className="filter-option category environment">#Environment</div>
                              <div className="filter-option category literature">#Literature</div>
                              <div className="filter-option category business">#Business</div>
                              <div className="filter-option category entertainment">#Entertainment</div>
                              <div className="filter-option category history">#History</div>
                              <div className="filter-option category miscellaneous">#Miscellaneous</div>
                              <div className="filter-option category cars">#Cars</div>
                              <div className="filter-option category philosophy">#Philosophy</div>
                              <div className="filter-option category photography">#Photography</div>
                              <div className="filter-option category movies">#Movies</div>
                              <div className="filter-option category home-and-garden">#HomeAndGarden</div>
                              <div className="filter-option category career">#Career</div>
                              <div className="filter-option category relationships">#Relationships</div>
                              <div className="filter-option category society">#Society</div>
                              <div className="filter-option category parenting">#Parenting</div>
                              <div className="filter-option category space">#Space</div>
                              <div className="filter-option category diy">#DIY</div>
                              <div className="filter-option category cooking">#Cooking</div>
                              <div className="filter-option category adventure">#Adventure</div>
                              <div className="filter-option category spirituality">#Spirituality</div>
                              <div className="filter-option category fitness">#Fitness</div>
                              <div className="filter-option category real-estate">#RealEstate</div>
                              <div className="filter-option category psychology">#Psychology</div>
                              <div className="filter-option category personal-finance">#PersonalFinance</div>
                              <div className="filter-option category hobbies">#Hobbies</div>
                              <div className="filter-option category current-events">#CurrentEvents</div>
                          </div>
                      </div>
                  </div>
                  <div className="post-wrapper">
                      <PostList setSlideMessage={setSlideMessage} page={page}/>
                  </div>
                  <AddPost setDisplayModal={setDisplayModal} displayModal={displayModal} setSlideMessage={setSlideMessage}/>
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