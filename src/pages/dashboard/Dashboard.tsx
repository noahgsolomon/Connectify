import React, {useState} from "react";
import Header from "../../common/Components/Header/Header.tsx";
import './style.css';
import useAuthentication from "../../setup/useAuthentication.tsx";
import PostList from "../../common/Components/Post/Post.tsx";
import SlideMessage from "../../util/status.tsx";

const Dashboard : React.FC = () => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [filter, setFilter] = useState("👨 last 30 days");
    const [slideMessage, setSlideMessage] = useState<{ message: string, color: string, key: number, duration?: number } | null>(null);
    const showContent = useAuthentication();

    if (!showContent){
        return null;
    }

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    const handleFilterChange = (value : string) => {
        setFilter(value);
        setDropdownOpen(false);
    };


    return (
      <div>
        <Header page={"dashboard"}/>
          <div className="overlay"></div>

          <div className="container">
              <button className="add-post-btn">+</button>

              <main className="center-content">
                  <div className="post-wrapper">
                      <div className="search-bar">
                          <div className="dropdown" onClick={toggleDropdown}>
                              <div className="dropdown-title">{filter} <span>∟</span></div>
                              {dropdownOpen &&
                                  <ul className={`dropdown-options ${dropdownOpen ? 'show' : ''}`}>
                                      <li onClick={() => handleFilterChange("👶 last day")}>👶 Last day</li>
                                      <li onClick={() => handleFilterChange("🧒 last 7 days")}>🧒 Last 7 days</li>
                                      <li onClick={() => handleFilterChange("👨 last 30 days")}>👨 Last 30 days</li>
                                      <li onClick={() => handleFilterChange("🧓 last year")}>🧓 Last year</li>

                                  </ul>
                              }
                          </div>
                          <button className={'post-search-btn'} type="submit">
                              🔎
                          </button>
                      </div>
                      <PostList setSlideMessage={setSlideMessage} page={0}/>
                  </div>
                  <div id="postModal" className="modal">
                      <div className="modal-content">
                          <div className="modal-header">
                              <h2>Create a new post</h2>
                          </div>
                          <div className="modal-body">
                              <form id="postForm" noValidate={true}>
                                  <label htmlFor="postTitle"></label><input type="text" id="postTitle" name="postTitle" maxLength={100} placeholder="Title" required/>
                                  <label htmlFor="postBody"></label><textarea id="postBody" name="postBody" rows={5} maxLength={500} placeholder="Body" required/>
                                  <p><span id="charCount">0</span>/500</p>
                                  <input type="submit" value="🚀" className="btn"/>
                              </form>
                          </div>
                      </div>
                  </div>
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