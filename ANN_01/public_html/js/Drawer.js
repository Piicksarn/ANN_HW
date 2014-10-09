/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var Drawer = function (mdata) {
    this.data = mdata;//Database.data Database.expecation
    this.boxsize = this.data.maxData + 1;
    this.board = JXG.JSXGraph.initBoard('jxgbox', {boundingbox:[-1*this.boxsize, this.boxsize, this.boxsize, -1*this.boxsize], axis: true, grid: true, keepaspectratio: true, showcopyright: false, zoom: true, pan: true}),
            out = document.getElementById('out');
    this.f;
    this.curve;
};

Drawer.prototype = {
    data: '',
    f: '',
    curve: '',
    boxsize: '',
    drawPoint: function (c) { // c  0 for trainingData 1 for testingData
        if(this.data.trainingData[0].length == 2) {// 沒時間了..暫時先用最笨方案
            switch(c){
                case 0:
                //console.log("data length:"+this.data.data.length);

                for (var i = 0; i < this.data.trainingData.length; i++){
                    if(this.data.train_expecation[i] == neuron.expecationLabel[1])
                        this.board.create('point', this.data.trainingData[i],{name:'',color:'#0000ff'});        
                    else if(this.data.train_expecation[i] == neuron.expecationLabel[0])
                        this.board.create('point', this.data.trainingData[i],{name:'',color:'#00ff00'}); 
                }
                break;

                case 1:
                //console.log("data length:"+this.data.testingData.length);
                //console.log(this.data.test_expecation);
                for (var i = 0; i < this.data.testingData.length; i++){
                    if(this.data.test_expecation[i] == neuron.expecationLabel[1])
                        this.board.create('point', this.data.testingData[i],{name:'',color:'#0000ff'});        
                    else if(this.data.test_expecation[i] == neuron.expecationLabel[0])
                        this.board.create('point', this.data.testingData[i],{name:'',color:'#00ff00'});

                }

                for(var j = 0; j < neuron.error.length; j++){
                    this.drawCircle(this.data.testingData[neuron.errorPos[j]],'#ff0000');
                }
                break;
            }
        }
    },
    drawFunc: function (txtraw) {
        if(this.data.trainingData[0].length == 2) {
            this.f = this.board.jc.snippet(txtraw, true, 'x', true);
            this.curve = this.board.create('functiongraph',[this.f,
                          function(){ 
                            var c = new JXG.Coords(JXG.COORDS_BY_SCREEN,[0,0],this.board);
                            return c.usrCoords[1];
                          },
                          function(){ 
                            var c = new JXG.Coords(JXG.COORDS_BY_SCREEN,[this.board.canvasWidth,0],this.board);
                            return c.usrCoords[1];
                          }
                        ],{name:txtraw, withLabel:true});
    //        var q = this.board.create('glider', [2, 1, this.curve], {withLabel:false});
            /*
            var t = this.board.create('text', [
                    function(){ return q.X()+0.1; },
                    function(){ return q.Y()+0.1; },
                    function(){ return "The slope of the function f(x)=" + txtraw + "<br>at x=" + q.X().toFixed(2) + " is equal to " + (JXG.Math.Numerics.D(this.f))(q.X()).toFixed(2); }
                ], 
                {fontSize:15});*/
        }
    },
    clearAll: function () {
        if(this.data.trainingData[0].length == 2) {
            JXG.JSXGraph.freeBoard(this.board);
            this.board = JXG.JSXGraph.initBoard('jxgbox', {boundingbox:[-1*this.boxsize, this.boxsize, this.boxsize, -1*this.boxsize], axis: true, grid: true, keepaspectratio: true, showcopyright: false, zoom: true, pan: true}),
            out = document.getElementById('out');
            this.f = null;
            this.curve = null;
        }
    },
    clearFunc: function () {
        if(this.data.trainingData[0].length == 2) {
            JXG.JSXGraph.freeBoard(this.board);
            this.board = JXG.JSXGraph.initBoard('jxgbox', {boundingbox:[-1*this.boxsize, this.boxsize, this.boxsize, -1*this.boxsize], axis: true, grid: true, keepaspectratio: true, showcopyright: false, zoom: true, pan: true}),
            out = document.getElementById('out');
            this.f = null;
            this.curve = null;
            this.drawPoint(0);
        }
    },
    drawCircle: function(data,color){
        if(this.data.trainingData[0].length == 2) {
            var p = this.board.create('point', [data[0],data[1]],{name:'',color:'#00000000'});
            var q = this.board.create('point', [data[0]+0.05,data[1]+0.05],{name:'',color:'#00000000'});
            this.board.createElement('circle',[p,q], {strokeColor:color});
        }
    }
};


