/**
 * Created by liekkas on 16/6/30.
 */
import _ from 'lodash'

export const defaultValue = {
  nodes: [
    {id: 5, x: 10, y: 10, shape: 'circularImage', image: 'http://7xkjpz.com1.z0.glb.clouddn.com/baba2.jpg'},
    {id: 6, shape: 'circularImage', image: 'http://7xkjpz.com1.z0.glb.clouddn.com/mama.jpg'},
    {id: 7, shape: 'circularImage', image: 'http://7xkjpz.com1.z0.glb.clouddn.com/qian.jpg'},
  ],
  edges: [
    {from: 7, to: 5},
    {from: 7, to: 6},
    {from: 5, to: 6},
  ],
  options: defaultOptions
}

export const defaultOptions = {
  "nodes": {
    "shape": "ellipse",
    "size": 40,
    "color": "#97C2FC",
    "image": undefined,
    "fixed": true
  },
  "edges": {
    "arrows": {
      "to": false,
      "from": false
    },
    "smooth": {
      "type": "cubicBezier"
    }
  },
  "groups": {
    "g1": {
      "shape": "box"
    },
    "g2": {
      "color": "#ff0000"
    }
  },
  "layout": {
    "randomSeed": 1,
    "improvedLayout": true,
    "hierarchical": {
      "enabled": false,
      "direction": "UD",
      "sortMethod": "hubsize"
    }
  },
  "interaction": {
    zoomView: false
  },
  "physics": {
    "enabled": true,
    "solver": "barnesHut"
  },
}

export const fullOptions = {
  nodes:{
    borderWidth: 1,
    borderWidthSelected: 2,
    brokenImage:undefined,
    color: '#97C2FC',
//    {
//      border: '#2B7CE9',
//      background: '#97C2FC',
//      highlight: {
//        border: '#2B7CE9',
//        background: '#D2E5FF'
//      },
//      hover: {
//        border: '#2B7CE9',
//        background: '#D2E5FF'
//      }
//    },
    fixed: {
      x:true,
      y:true
    },
    font: {
      color: '#343434',
      size: 14, // px
      face: 'arial',
      background: 'none',
      strokeWidth: 0, // px
      strokeColor: '#ffffff',
      align: 'center'
    },
    group: undefined,
    hidden: false,
    icon: {
      face: 'FontAwesome',
      code: undefined,
      size: 50,  //50,
      color:'#2B7CE9'
    },
    image: undefined,
    label: undefined,
    labelHighlightBold: true,
    level: undefined,
    mass: 1,
    physics: true,
    scaling: {
      min: 10,
      max: 30,
      label: {
        enabled: false,
        min: 14,
        max: 30,
        maxVisible: 30,
        drawThreshold: 5
      },
      customScalingFunction: function (min,max,total,value) {
        if (max === min) {
          return 0.5;
        }
        else {
          let scale = 1 / (max - min);
          return Math.max(0,(value - min)*scale);
        }
      }
    },
    shadow:{
      enabled: false,
      color: 'rgba(0,0,0,0.5)',
      size:10,
      x:5,
      y:5
    },
    shape: 'ellipse',
    shapeProperties: {
      borderDashes: false, // only for borders
      borderRadius: 6,     // only for box shape
      interpolation: false,  // only for image and circularImage shapes
      useImageSize: false,  // only for image and circularImage shapes
      useBorderWithImage: false  // only for image shape
    },
    size: 25,
    title: undefined,
    value: undefined,
    x: undefined,
    y: undefined
  },
  edges:{
    arrows: {
      to:     {enabled: false, scaleFactor:1},
      middle: {enabled: false, scaleFactor:1},
      from:   {enabled: false, scaleFactor:1}
    },
    arrowStrikethrough: true,
    color: {
      color:'#848484',
      highlight:'#848484',
      hover: '#848484',
      inherit: 'from',
      opacity:1.0
    },
    dashes: false,
    font: {
      color: '#343434',
      size: 14, // px
      face: 'arial',
      background: 'none',
      strokeWidth: 2, // px
      strokeColor: '#ffffff',
      align:'horizontal'
    },
    hidden: false,
    hoverWidth: 1.5,
    label: undefined,
    labelHighlightBold: true,
    length: undefined,
    physics: true,
    scaling:{
      min: 1,
      max: 15,
      label: {
        enabled: true,
        min: 14,
        max: 30,
        maxVisible: 30,
        drawThreshold: 5
      },
      customScalingFunction: function (min,max,total,value) {
        if (max === min) {
          return 0.5;
        }
        else {
          var scale = 1 / (max - min);
          return Math.max(0,(value - min)*scale);
        }
      }
    },
    selectionWidth: 1,
    selfReferenceSize:20,
    shadow:{
      enabled: false,
      color: 'rgba(0,0,0,0.5)',
      size:10,
      x:5,
      y:5
    },
    smooth: {
      enabled: true,
      type: "dynamic",
      roundness: 0.5
    },
    title:undefined,
    width: 1,
    value: undefined
  },

  layout: {
    randomSeed: undefined,
    improvedLayout:true,
    hierarchical: {
      enabled:false,
      levelSeparation: 150,
      nodeSpacing: 100,
      treeSpacing: 200,
      blockShifting: true,
      edgeMinimization: true,
      parentCentralization: true,
      direction: 'UD',        // UD, DU, LR, RL
      sortMethod: 'hubsize'   // hubsize, directed
    }
  },

  physics:{
    enabled: true,
    barnesHut: {
      gravitationalConstant: -2000,
      centralGravity: 0.3,
      springLength: 95,
      springConstant: 0.04,
      damping: 0.09,
      avoidOverlap: 0
    },
    forceAtlas2Based: {
      gravitationalConstant: -50,
      centralGravity: 0.01,
      springConstant: 0.08,
      springLength: 100,
      damping: 0.4,
      avoidOverlap: 0
    },
    repulsion: {
      centralGravity: 0.2,
      springLength: 200,
      springConstant: 0.05,
      nodeDistance: 100,
      damping: 0.09
    },
    hierarchicalRepulsion: {
      centralGravity: 0.0,
      springLength: 100,
      springConstant: 0.01,
      nodeDistance: 120,
      damping: 0.09
    },
    maxVelocity: 50,
    minVelocity: 0.1,
    solver: 'barnesHut',
    stabilization: {
      enabled: true,
      iterations: 1000,
      updateInterval: 100,
      onlyDynamicEdges: false,
      fit: true
    },
    timestep: 0.5,
    adaptiveTimestep: true
  }
}
