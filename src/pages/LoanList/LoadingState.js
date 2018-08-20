import React, { Component } from 'react';
import { Image, Segment } from 'semantic-ui-react';
import paragraph from '../../images/wireframes/paragraph.png';

export default class LoadingState extends Component {
  state = {}

  handleShow = () => this.setState({ active: true })
  handleHide = () => this.setState({ active: false })

  render() {
    const { active } = this.state

    return (
      <div className='proper-height'>
          <Segment loading style={{paddingTop: "10em", height: "100%"}}>
            <Image src={paragraph} centered />
            <Image src={paragraph} style={{ marginTop: '2em' }} centered />
            <Image src={paragraph} style={{ marginTop: '2em' }} centered />
            <Image src={paragraph} style={{ marginTop: '2em' }} centered />
            <Image src={paragraph} style={{ marginTop: '2em' }} centered />
          </Segment>
      </div>
    )
  }
}