import React from 'react';
import styles from './PageContent.less';
import {TINYS} from '../../consts'

function PageContent({data}) {

  let infoStyle = {}
  if(data.width) infoStyle.width = data.width
  if(data.left) infoStyle.left = data.left
  if(data.top) infoStyle.top = data.top
  if(data.right) infoStyle.right = data.right
  if(data.bottom) infoStyle.bottom = data.bottom
  if(data.infoBgColor) infoStyle.backgroundColor = data.infoBgColor

  return (
    <div className={styles.normal} style={{backgroundImage: `url(${data.cover})`}}>
      <div className={styles.info}
           style={infoStyle}>
        <div className={styles.title}>
          {data.year}
        </div>
        <div className={styles.wordA}>
          <img src={TINYS[data.whoA]} className={styles.circleImgA}/>
          “{data.wordA}”
        </div>
        <div className={styles.wordB}>
          <div>“{data.wordB}”</div>
          <img src={TINYS[data.whoB]} className={styles.circleImgB}/>
        </div>
      </div>
    </div>
  );
}

export default PageContent;
