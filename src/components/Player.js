import React from 'react';
import styles from './Player.css';
import musicLog from './music.png'

const DEFAULT_LISTEN_INTERVAL = 10000

class Player extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      playing: true
    }
    this.onToggle = this.onToggle.bind(this);
    this.play = this.play.bind(this);
    this.pause = this.pause.bind(this);
  }

  componentDidMount() {
    window.AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext || window.msAudioContext;
    window.requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.msRequestAnimationFrame;
    window.cancelAnimationFrame = window.cancelAnimationFrame || window.webkitCancelAnimationFrame || window.mozCancelAnimationFrame || window.msCancelAnimationFrame;
    try {
      this.audioContext = new AudioContext();
    } catch (e) {
      console.log(e);
    }

    const audio = this.audioEl;
    audio.crossOrigin="anonymous";
    this.draw(audio)

    audio.addEventListener('error', (e) => {
      this.props.onError && this.props.onError(e);
    });

    // When enough of the file has downloaded to start playing
    audio.addEventListener('canplay', (e) => {
      this.props.onCanPlay && this.props.onCanPlay(e);
    });

    // When enough of the file has downloaded to play the entire file
    audio.addEventListener('canplaythrough', (e) => {
      this.props.onCanPlayThrough && this.props.onCanPlayThrough(e);
    });

    // When audio play starts
    audio.addEventListener('play', (e) => {
      this.setListenTrack();
      this.props.onPlay && this.props.onPlay(e);
    });

    // When unloading the audio player (switching to another src)
    audio.addEventListener('abort', (e) => {
      this.clearListenTrack();
      this.props.onAbort && this.props.onAbort(e);
    });

    // When the file has finished playing to the end
    audio.addEventListener('ended', (e) => {
      this.clearListenTrack();
      this.props.onEnded && this.props.onEnded(e);
    });

    // When the user pauses playback
    audio.addEventListener('pause', (e) => {
      this.clearListenTrack();
      this.props.onPause && this.props.onPause(e);
    });

    // When the user drags the time indicator to a new time
    audio.addEventListener('seeked', (e) => {
      this.clearListenTrack();
      this.props.onSeeked && this.props.onSeeked(e);
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.selectedPlayerEvent) {
      const audio = this.audioEl;

      audio.currentTime = nextProps.selectedPlayerEvent.playTime;
      audio.play();
    }
  }

  /**
   * Set an interval to call props.onListen every props.listenInterval time period
   */
  setListenTrack() {
    if (!this.listenTracker) {
      const listenInterval = this.props.listenInterval || DEFAULT_LISTEN_INTERVAL;
      this.listenTracker = setInterval(() => {
        this.props.onListen && this.props.onListen(this.audioEl.currentTime);
      }, listenInterval);
    }
  }

  /**
   * Clear the onListen interval
   */
  clearListenTrack() {
    if (this.listenTracker) {
      clearInterval(this.listenTracker);
      this.listenTracker = null;
    }
  }

  onToggle() {
    const playing = !this.state.playing
    this.setState({playing})
    playing ? this.play() : this.pause()
  }

  play() {
    this.setListenTrack();
    this.props.onPlay && this.props.onPlay();
    const audio = this.audioEl;
    audio.play();
  }

  pause() {
    this.clearListenTrack();
    const audio = this.audioEl;
    audio.pause()
    this.props.onPause && this.props.onPause();
  }

  draw(audio) {
    var ctx = this.audioContext
    var analyser = ctx.createAnalyser();
    var audioSrc = ctx.createMediaElementSource(audio);
    // we have to connect the MediaElementSource with the analyser
    audioSrc.connect(analyser);
    analyser.connect(ctx.destination);
    // we could configure the analyser: e.g. analyser.fftSize (for further infos read the spec)
    // analyser.fftSize = 64;
    // frequencyBinCount tells you how many values you'll receive from the analyser
    var frequencyData = new Uint8Array(analyser.frequencyBinCount);

    // we're ready to receive some data!
    var canvas = this.cvs,
      cwidth = canvas.width,
      cheight = canvas.height,
      meterWidth = 9, //width of the meters in the spectrum
      gap = 2, //gap between meters
      capHeight = 2,
      capStyle = '#fff',
      meterNum = 800 / (meterWidth + 2), //count of the meters
      capYPositionArray = []; ////store the vertical position of hte caps for the preivous frame
    ctx = canvas.getContext('2d');
    var gradient = ctx.createLinearGradient(0, 0, 0, 300);
    gradient.addColorStop(1, '#0f0');
    gradient.addColorStop(0.5, '#ff0');
    gradient.addColorStop(0, '#fff');

    // loop
    function renderFrame() {
      var array = new Uint8Array(analyser.frequencyBinCount);
      analyser.getByteFrequencyData(array);
      var step = Math.round(array.length / meterNum); //sample limited data from the total array
      ctx.clearRect(0, 0, cwidth, cheight);

      for (var i = 0; i < meterNum; i++) {
        var value = array[i * step];
        if (capYPositionArray.length < Math.round(meterNum)) {
          capYPositionArray.push(value);
        };
        ctx.fillStyle = capStyle;
        //draw the cap, with transition effect
        if (value < capYPositionArray[i]) {
          ctx.fillRect(i * 12, cheight - (--capYPositionArray[i]), meterWidth, capHeight);
        } else {
          ctx.fillRect(i * 12, cheight - value, meterWidth, capHeight);
          capYPositionArray[i] = value;
        };
        ctx.fillStyle = gradient; //set the filllStyle to gradient for a better look
        ctx.fillRect(i * 12 /*meterWidth+gap*/ , cheight - value + capHeight, meterWidth, cheight); //the meter
      }
      requestAnimationFrame(renderFrame);
    }
    renderFrame();
    audio.play();

  }

  render() {
    const incompatibilityMessage = this.props.children || (
        <p>Your browser does not support the <code>audio</code> element.</p>
      );

    return (
      <div>
        <canvas ref={ref => this.cvs = ref} className={styles.canvas}/>

        <img src={musicLog} className={this.state.playing ? styles.musicPlay : styles.musicPause}
             onClick={() => this.onToggle()}/>

        <audio
          src={this.props.src}
          autoPlay={this.props.autoPlay}
          preload={this.props.preload}
          controls={false}
          ref={(ref) => this.audioEl = ref}
          onPlay={this.onPlay}
          loop={this.props.loop}
        >
          {incompatibilityMessage}
        </audio>
      </div>
    );
  }
}

Player.propTypes = {
  autoPlay: React.PropTypes.bool,
  children: React.PropTypes.array,
  listenInterval: React.PropTypes.number,
  onAbort: React.PropTypes.func,
  onCanPlay: React.PropTypes.func,
  onCanPlayThrough: React.PropTypes.func,
  onEnded: React.PropTypes.func,
  onError: React.PropTypes.func,
  onListen: React.PropTypes.func,
  onPause: React.PropTypes.func,
  onPlay: React.PropTypes.func,
  onSeeked: React.PropTypes.func,
  preload: React.PropTypes.string,
  src: React.PropTypes.string,
  mini: React.PropTypes.bool,
  loop: React.PropTypes.bool,
}

Player.defaultProps = {
  autoPlay: false,
  mini: false,
  loop: true,
}

export default Player;
