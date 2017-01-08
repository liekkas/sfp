import React from 'react';
import { connect } from 'dva';
import styles from './IndexPage.less';
import Player from '../components/Player'
// import {SectionsContainer, Section} from 'react-fullpage';

import SectionsContainer from '../components/Section/SectionsContainer'
import Section from '../components/Section/Section'
import PageContent from '../components/PageContent/PageContent'
import First from '../components/First/First'
import Last from '../components/Last/Last'
import {Button, Icon} from 'antd'
import logo from '../assets/logo.jpg'
import _ from 'lodash'

class IndexPage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      current: 0,
    }
  }

  render() {
    const {common, members, data} = this.props
    if(data.length === 0) return <div></div>
    const {current} = this.state
    const archors = ['home'].concat(_.map(data, 'year')) //.concat(['last'])
    let options = {
//     sectionClassName:     'section',
      anchors:              archors,
      scrollBar:            false,
      navigation:           false,
      arrowNavigation:      true,
      scrollCallback: (states) => this.setState({current: states.activeSection})
    };

    return (
      <div className={styles.normal}>
        <div className={styles.home}>
          <Button type="ghost" shape="circle" icon="home" className={styles.btn}
                  onClick={() => this.setState({current: 0})}  />
        </div>

        <Player src={common.bgMusic} mini autoPlay />
        <SectionsContainer {...options} activeSection={current}>
          <Section>
            <First data={common.first}/>
          </Section>

          <Section>
            <PageContent data={data[0]} />
          </Section>
          <Section>
            <PageContent data={data[1]} />
          </Section>
          <Section>
            <PageContent data={data[2]} />
          </Section>
          <Section>
            <PageContent data={data[3]} />
          </Section>
          <Section>
            <PageContent data={data[4]} />
          </Section>
          <Section>
            <PageContent data={data[5]} />
          </Section>
          <Section>
            <PageContent data={data[6]} />
          </Section>

          {/*{*/}
            {/*data.map(item =>*/}
              {/*<Section key={item.year}>*/}
                {/*<PageContent data={item} />*/}
              {/*</Section>*/}
            {/*)*/}
          {/*}*/}
          {/*<Section>*/}
            {/*<Last/>*/}
          {/*</Section>*/}
        </SectionsContainer>

        <div className={styles.btnGroup}>
          <Button type="ghost" shape="circle" icon="up" className={styles.btn}
                  onClick={() => this.setState({current: current - 1})} disabled={current === 0} />
          <Button type="ghost" shape="circle" icon="down" className={styles.btn}
                  onClick={() => this.setState({current: current + 1})} disabled={current === archors.length - 1}/>
        </div>

        <div className={styles.copyright}>
          ©Copyright 2010 ~ 2017 by 書房排 <img src={logo} />
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const {common, members, data} = state.family
  return {common, members, data}
}

export default connect(mapStateToProps)(IndexPage);
