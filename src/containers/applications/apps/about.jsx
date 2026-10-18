import React from "react";
import { useSelector, useDispatch } from "react-redux";

export const AboutWin = () => {
  const open = useSelector(state => state.desktop.abOpen);
  const dispatch = useDispatch();
  return open ? <section className="aboutApp floatTab dpShad" role="dialog" aria-labelledby="about-title">
    <div className="content p-6">
      <h1 id="about-title">About Desktop Practice</h1>
      <p>An independent, open-source educational simulation. It uses sample files and never changes files on your computer.</p>
      <p>Adapted from <a href="https://github.com/blueedgetechno/win11React" target="_blank" rel="noreferrer">Win11React</a>, created by blueedgetechno, with work by andrewstech and the Win11React contributors. Thank you for the original desktop interface.</p>
      <p>This fork retains <a href="https://github.com/bla6987/win11React/blob/master/LICENSE" target="_blank" rel="noreferrer">CC0-1.0</a>. Its replacement artwork is original and shared under CC0-1.0. <a href="licenses/THIRD_PARTY_NOTICES.md" target="_blank" rel="noreferrer">Font Awesome Free and dyCalendar retain their own license notices.</a></p>
      <p>Windows and Microsoft are trademarks of Microsoft. This project is independent and is not affiliated with or endorsed by Microsoft.</p>
      <p><a href="https://github.com/bla6987/win11React" target="_blank" rel="noreferrer">Source code and credits</a></p>
    </div>
    <div className="okbtn px-6 py-4"><button onClick={() => dispatch({ type: "DESKABOUT", payload: false })}>Close</button></div>
  </section> : null;
};
