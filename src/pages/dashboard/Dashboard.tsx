import React from "react";
import Header from "../../common/Components/Header/Header.tsx";
import './style.css';
import useAuthentication from "../../setup/useAuthentication.tsx";

const Dashboard : React.FC = () => {

    useAuthentication();



    return (
      <div>
        <Header page={"dashboard"}/>
          <div className="overlay"></div>

          <div className="container">
              <button className="add-post-btn">+</button>

              <main className="center-content">
                  <label>
                      <input type="text" className="post-search" placeholder="Search..."/>
                  </label>
                  <div className="post-wrapper">

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
      </div>
    );
};

export default Dashboard;