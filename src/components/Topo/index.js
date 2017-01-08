/**
 * Created by liekkas on 16/6/15.
 */
import React, { PropTypes } from 'react'
import {DataSet, Network} from 'vis'
import shallowCompare from 'react-addons-shallow-compare'
import _ from 'lodash'

let highlightActive = false
let realOptions
class Topo extends React.Component {
  constructor(props) {
    super(props)
    this.neighbourhoodHighlight = this.neighbourhoodHighlight.bind(this)
    this.state = {
      groups: _.map(props.value.nodes, 'group'), // id, isOpen
    }
  }

  componentDidMount() {
    this.drawTopo()
    const network = this.topo
    network.on("initRedraw", function () {
      // do something like move some custom elements?
    });
    network.on("beforeDrawing", function (ctx) {
//      var nodeId = 1;
//      var nodePosition = network.getPositions([nodeId]);
//      ctx.strokeStyle = '#A6D5F7';
//      ctx.fillStyle = '#294475';
//      ctx.circle(nodePosition[nodeId].x, nodePosition[nodeId].y,50);
//      ctx.fill();
//      ctx.stroke();
    });

    network.on("afterDrawing", function (ctx) {
//      console.log('>>> afterDrawing')
      var nodeId = 1;
//      var ids = network.getNodesInCluster('cluster:g1')
//      var nodePosition = network.getPositions(nodeId);
//      const xarr = _.map(nodePosition, 'x')
//      const yarr = _.map(nodePosition, 'y')
//      const _x = _.min(xarr)
//      const _y = _.min(yarr)
//      const _w = _.max(xarr) - _x
//      const _h = _.max(yarr) - _y

//      ctx.strokeStyle = '#294475';
//      ctx.lineWidth = 4;
//      ctx.fillStyle = '#A6D5F7';
//      ctx.circle(nodePosition[nodeId].x, nodePosition[nodeId].y,20);
////      ctx.rect(_x, _y, _w, _h)
//      ctx.fill();
//      ctx.stroke();
    });

    network.on("selectNode", function(params) {
      if (params.nodes.length == 1) {
        if (network.isCluster(params.nodes[0]) == true) {
          network.setOptions({physics:{stabilization:{fit: false}}});
          network.stabilize();
          network.openCluster(params.nodes[0]);
        }
      }
    });

    const {nodeDragged} = this.props
    network.on("dragEnd", function (params) {
      console.log('>>> topo dragEnd',params)
      nodeDragged()
    });

//    network.on("click",this.neighbourhoodHighlight);
  }

  componentWillReceiveProps(nextProps) {
//    console.log('>>> topo.componentWillReceiveProps', nextProps.value, this.props.value)
    if (nextProps.value !== this.props.value) {
      this.forceUpdate()
    }
  }

  componentDidUpdate(prevProps, prevState) {
//    console.log('>>> Topo.didUpdate')
    this.drawTopo()
  }

  componentWillUnmount() {
    if(this.topo) this.topo.destroy()
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  }

  getValue() {
    const {value} = this.props
    const positions = this.topo.getPositions(_.map(value.nodes, 'id')) //把节点的坐标值带上
    return {...value, nodes: value.nodes.map(item => _.merge(item, positions[item.id]))}
  }

  drawTopo() {
    const {nodes, edges, options} = this.props.value
//    console.log('>>> topo:drawTopo', this.props.value)
    const container = this.refs.container
    const data = {nodes: new DataSet(nodes), edges: new DataSet(edges)}
    const groups = _.map(nodes, 'group')
    realOptions = _.cloneDeep(options)
    let $topo = this.topo

    if (!this.props.isReuse) {
      $topo = this.topo = new Network(container, data, _.cloneDeep(options)) //避免vis内部更改options属性
      $topo.on("selectNode", function(params) {
        if (params.nodes.length == 1) {
          if ($topo.isCluster(params.nodes[0]) == true) {
            $topo.setOptions({physics:{stabilization:{fit: false}}});
            $topo.stabilize();
            $topo.openCluster(params.nodes[0]);
          }
          console.log('>>> topo select', params)
        }
      });

      const {nodeDragged} = this.props
      $topo.on("dragEnd", function (params) {
        console.log('>>> topo dragEnd',params)
        nodeDragged()
      });

      return
    }

    if(!!$topo) {
      $topo.setOptions(realOptions) //避免vis内部更改options属性
      $topo.setData(data)

//      $topo.redraw()
//      $topo.setSelection(selection)
    } else {
      $topo = this.topo = new Network(container, data, _.cloneDeep(options)) //避免vis内部更改options属性
      let clusterOptionsByData
      ['g1','g2'].forEach(item => {
        clusterOptionsByData = {
          joinCondition:function(childOptions) {
            return childOptions.group == item;
          },
//          processProperties: function(clusterOptions, childNodes) {
//            clusterOptions.label = "[" + childNodes.length + "]";
//            return clusterOptions;
//          },
          clusterNodeProperties: {id:'cluster:'+item, borderWidth:3, shape:'box', label: item}
        }
//        $topo.cluster(clusterOptionsByData);
      })
    }
  }

  neighbourhoodHighlight(params) {
    const {nodes} = this.props.value
    var nodesDataset = new DataSet(nodes)

    // if something is selected:
    if (params.nodes.length > 0) {
      highlightActive = true;
      var i,j;
      var selectedNode = params.nodes[0];
      var degrees = 2;

      // mark all nodes as hard to read.
      for (var nodeId in nodes) {
        nodes[nodeId].color = 'rgba(200,200,200,0.5)';
        if (nodes[nodeId].hiddenLabel === undefined) {
          nodes[nodeId].hiddenLabel = nodes[nodeId].label;
          nodes[nodeId].label = undefined;
        }
      }
      var connectedNodes = this.topo.getConnectedNodes(selectedNode);
      var allConnectedNodes = [];

      // get the second degree nodes
      for (i = 1; i < degrees; i++) {
        for (j = 0; j < connectedNodes.length; j++) {
          allConnectedNodes = allConnectedNodes.concat(this.topo.getConnectedNodes(connectedNodes[j]));
        }
      }

      // all second degree nodes get a different color and their label back
      for (i = 0; i < allConnectedNodes.length; i++) {
        nodes[allConnectedNodes[i]].color = 'rgba(150,150,150,0.75)';
        if (nodes[allConnectedNodes[i]].hiddenLabel !== undefined) {
          nodes[allConnectedNodes[i]].label = nodes[allConnectedNodes[i]].hiddenLabel;
          nodes[allConnectedNodes[i]].hiddenLabel = undefined;
        }
      }

      // all first degree nodes get their own color and their label back
      for (i = 0; i < connectedNodes.length; i++) {
        nodes[connectedNodes[i]].color = undefined;
        if (nodes[connectedNodes[i]].hiddenLabel !== undefined) {
          nodes[connectedNodes[i]].label = nodes[connectedNodes[i]].hiddenLabel;
          nodes[connectedNodes[i]].hiddenLabel = undefined;
        }
      }

      // the main node gets its own color and its label back.
      nodes[selectedNode].color = undefined;
      if (nodes[selectedNode].hiddenLabel !== undefined) {
        nodes[selectedNode].label = nodes[selectedNode].hiddenLabel;
        nodes[selectedNode].hiddenLabel = undefined;
      }
    }
    else if (highlightActive === true) {
      // reset all nodes
      for (var nodeId in nodes) {
        nodes[nodeId].color = undefined;
        if (nodes[nodeId].hiddenLabel !== undefined) {
          nodes[nodeId].label = nodes[nodeId].hiddenLabel;
          nodes[nodeId].hiddenLabel = undefined;
        }
      }
      highlightActive = false
    }

    // transform the object into an array
    var updateArray = [];
    for (nodeId in nodes) {
      if (nodes.hasOwnProperty(nodeId)) {
        updateArray.push(nodes[nodeId]);
      }
    }
    nodesDataset.update(updateArray);
    this.topo.setData({nodes: nodesDataset, edges: this.props.value.edges})
  }

  render() {
    const { style, className } = this.props
    return (
      <div ref="container" className={className} style={style} />
    )
  }
}

Topo.propTypes = {
  value: PropTypes.object.isRequired,
  nodeDragged: PropTypes.func.isRequired,
  isReuse: PropTypes.bool.isRequired,
  className: PropTypes.string.isRequired,
}
Topo.defaultProps = {
  value: {},
  isReuse: true,
  nodeDragged: () => {}
}

export default Topo
