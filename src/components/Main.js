require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';
import ReactDOM from 'react-dom';
//let yeomanImage = require('../images/yeoman.png');


//get picture datas，利用自执行函数, prop name transform url
var imageDatas = require('../data/imageDatas.json');

(function genImageURL(imageDatasArr) {
  for (let i = 0, j = imageDatasArr.length; i < j; i++) {
    var singleImageData = imageDatasArr[i];
    singleImageData.imageURL = require('../images/' + singleImageData.filename);
    imageDatasArr[i] = singleImageData;
  }
  return imageDatasArr;
})(imageDatas);

//get random
function getRangeRandom(low,high){
  return Math.ceil(Math.random()*(high - low) + low);
}
//get random between 0 ~ 30°
function get30DegRandom(){
  return (Math.random() > 0.5?'':'-')+Math.ceil(Math.random()*30);
}

class ImgFigure extends React.Component {
  handleClick(e){
    if (this.props.arrange.isCenter) {
      this.props.inverse();
    }else{
      this.props.center();
    }
    e.stopPropagation();
    e.preventDefault();
  }
  render() {
    let styleObj = {};
    if(this.props.arrange.pos) {
      styleObj = this.props.arrange.pos;
    }
    if (this.props.arrange.rotate) {
      (['MozTransform','msTransform','WebkitTransform','transform']).forEach(function(value){
        styleObj[value] = 'rotate('+this.props.arrange.rotate+'deg)';
      }.bind(this));
    }
    if (this.props.arrange.isCenter) {
      styleObj.zIndex = 11;
    }
    var imgFigureClassName = "img-figure";
        imgFigureClassName += this.props.arrange.isInverse?' is-inverse':'';
    return (
      <figure className={imgFigureClassName} style={styleObj} onClick={this.handleClick.bind(this)}>
          <img src={this.props.data.imageURL} alt={this.props.data.title}/>
          <figcaption>
            <h2 className="img-title">{this.props.data.title}</h2>
            <div className="img-back" onClick={this.handleClick.bind(this)}>
              <p>{this.props.data.description}</p>
            </div>
          </figcaption>
      </figure>
    );
  }
}

ImgFigure.defaultProps = {};

class AppComponent extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      imgsArrangeArr: [
        // {
        //   pos:{
        //     left:'0',
        //     top:'0'
        //   },
        //   rotate:0,
        //   isInverse:false,
        //   isCenter:false
        // }
      ]
    };

    this.Constant = {
      centerPos: {
        left:0,
        right:0
      },
      hPosRange:{         //horizentail position range
        leftSecx:[0,0],
        rightSecx:[0,0],
        y:[0,0]
      },
      vPosRange:{           //Vertical position range
        x:[0,0],
        topY:[0,0]
      }
    }
  }
  //rotate picrure function
  inverse(index) {
    return function (){
      var imgsArrangeArr = this.state.imgsArrangeArr;

      imgsArrangeArr[index].isInverse = !imgsArrangeArr[index].isInverse;

      this.setState({
        imgsArrangeArr: imgsArrangeArr
      });
    }.bind(this);
  }

  center(index){
    return function(){
      this.rearrange(index);
    }.bind(this);
  }
  //loaded component，then caculate the position of every picture
  componentDidMount() {
    //get size ofstage
    let stageDOM = ReactDOM.findDOMNode(this.refs.stage),
        stageW = stageDOM.scrollWidth,
        stageH = stageDOM.scrollHeight,
        halfStageW = Math.ceil(stageW / 2),
        halfStageH = Math.ceil(stageH / 2),
    //get size of imgFigure
        imgFigureDOM = ReactDOM.findDOMNode(this.refs.imgFigure0),
        imgW = imgFigureDOM.scrollWidth,
        imgH = imgFigureDOM.scrollHeight,
        halfImgW = Math.ceil(imgW / 2),
        halfImgH = Math.ceil(imgH / 2);
    //caculate  center of picture
        console.log(this);
        this.Constant.centerPos.left = halfStageW - halfImgW;
        this.Constant.centerPos.top = halfStageH - halfImgH;
        this.Constant.hPosRange.leftSecx[0]= -halfImgW;
        this.Constant.hPosRange.leftSecx[1]= halfStageW - halfImgW*3;
        this.Constant.hPosRange.rightSecx[0]= halfStageW + halfImgW;
        this.Constant.hPosRange.rightSecx[1]= stageW - halfImgW;
        this.Constant.hPosRange.y[0] = -halfImgH;
        this.Constant.hPosRange.y[1] = stageH - halfImgH;
        this.Constant.vPosRange.topY[0] = -halfImgH;
        this.Constant.vPosRange.topY[1] = halfStageH - halfImgH*3;
        this.Constant.vPosRange.x[0] = halfStageW - imgW;
        this.Constant.vPosRange.x[1] = halfStageW;

        this.rearrange(0);
  }
  //reposition all picture
  rearrange(centerIndex){
    var imgsArrangeArr = this.state.imgsArrangeArr,
        Constant = this.Constant,
        centerPos = Constant.centerPos,
        hPosRange = Constant.hPosRange,
        vPosRange = Constant.vPosRange,
        hPosRangeLeftSecX = hPosRange.leftSecx,
        hPosRangeRightSecX = hPosRange.rightSecx,
        hPosRangeY = hPosRange.y,
        vPosRangeTopY = vPosRange.topY,
        vPosRangeX = vPosRange.x,
        imgsArrangeTopArr = [],
        topImgNum = Math.ceil(Math.random()*2),
        topImgSpliceIndex = 0,
        imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex,1);
        //the index of first positied picture need to be center and dont need to be rotated
        imgsArrangeCenterArr[0] = {
          pos:centerPos,
          rotate:0,
          isCenter:true
        },
        //
        topImgSpliceIndex = Math.ceil(Math.random()*(imgsArrangeArr.length - topImgNum)),
        imgsArrangeTopArr = imgsArrangeArr.splice(topImgSpliceIndex,topImgNum);
        //top area picture info
        imgsArrangeTopArr.forEach(function(value,index){
          imgsArrangeTopArr[index] = {
            pos:{
              top:getRangeRandom(vPosRangeTopY[0],vPosRangeTopY[1]),
              left:getRangeRandom(vPosRangeX[0],vPosRangeX[1])
            },
            rotate:get30DegRandom(),
            isCenter:false
          };
        });
        //Vertical position random range
        for (let i = 0,j = imgsArrangeArr.length,k = j/2; i < j; i++) {
          let hPosRangeLoRx = null;
          if (i < k) {
            hPosRangeLoRx = hPosRangeLeftSecX;
          }else{
            hPosRangeLoRx = hPosRangeRightSecX;
          }
          imgsArrangeArr[i] = {
            pos:{
              top:getRangeRandom(hPosRangeY[0],hPosRangeY[1]),
              left:getRangeRandom(hPosRangeLoRx[0],hPosRangeLoRx[1])
            },
            rotate:get30DegRandom(),
            isCenter:false
          };
        }
        //Toparea position  random range
        if(imgsArrangeTopArr && imgsArrangeTopArr[0]) {
          imgsArrangeArr.splice(topImgSpliceIndex,0,imgsArrangeTopArr[0]);
        }
        imgsArrangeArr.splice(centerIndex,0,imgsArrangeCenterArr[0]);

        this.setState({
          imgsArrangeArr:imgsArrangeArr
        });
  }

  render() {
      let controllerUnits = [],
          imgFigure = [];

      imageDatas.forEach(function(value,index) {
        if (!this.state.imgsArrangeArr[index]) {
          this.state.imgsArrangeArr[index] = {
            pos:{
              left:0,
              top:0
            },
            rotate:0,
            isInverse:false,
            isCenter:false
          };
        }
        imgFigure.push(<ImgFigure key={index} data={value} ref={'imgFigure'+index} arrange={this.state.imgsArrangeArr[index]} inverse={this.inverse(index).bind(this)} center={this.center(index).bind(this)}/>);
      }.bind(this));

      return (
        <section className="stage" ref="stage">
          <section className="img-sec">
            {imgFigure}
          </section>
          <nav className="controller-nav">
            {controllerUnits}
          </nav>
        </section>
      );
    }
  }

AppComponent.defaultProps = {};

export default AppComponent;
