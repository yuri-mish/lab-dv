/* eslint-disable no-unused-vars */
import PropTypes from 'prop-types';
import { appInfo } from 'app-info';
import './footer.scss';

export const Footer = ({ compactMode }) => (
  (compactMode ?
    <footer className={'footer footer--compact'}>
      <span>   </span>©<br/>{new Date().getFullYear()}
    </footer> :
    <footer className={'footer'}>
      Copyright © 2020-{new Date().getFullYear()} {appInfo.title}
      {` (v${appInfo.version})`} Inc.
      <br />
      All trademarks or registered trademarks are property of their
      respective owners.
    </footer>
  )
);

Footer.propTypes = {
  compactMode: PropTypes.bool,
};

