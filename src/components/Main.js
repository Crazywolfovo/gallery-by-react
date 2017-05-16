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

class ImgFigure extends React.Component {
  render() {
    return (
      <figure className="img-figure">
          <img src={this.props.data.imageURL} alt={this.props.data.title}/>
          <figcaption>
            <h2 className="img-title">{this.props.data.title}</h2>
          </figcaption>
      </figure>
    );
  }
}

ImgFigure.defaultProps = {};

class AppComponent extends React.Component {
  Constant:{
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
        // this.Constant.centerPos = {
        //   left: halfStageW - halfImgW,
        //   top: halfStageH - halfImgH
        // };
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
        this.Constant.vPosRange.x[0] = halfImgW - imgW;
        this.Constant.vPosRange.x[1] = halfImgW;
  }
  //reposition all picture
  rearrange(centerIndex){

  }

  render() {

    let controllerUnits = [],
        imgFigure = [];
    imageDatas.forEach(function(value,index) {
      imgFigure.push(<ImgFigure key={index} data={value} ref={'imgFigure'+index}/>);
    });

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
