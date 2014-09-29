/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var Neuron = function (database,learning_rate,learning_times,fps) {
    this.n = 0;// 回圈次數
    this.dataStep;// data學習循環
    this.data = database.data;// 多維度 資料數 * 資料維度
    this.expecation = database.expecation;
    this.learning_rate = learning_rate;
    this.learning_times = learning_times;// 學習次數 = 回圈次數 / 資料數 -。 學習一次要跑全部的資料
    this.true_loop_times = this.learning_times * this.data.length;
    this.auto_control = true;
    this.fps = fps;
    
    this.weight = [];
    //for(var i = 0;i < this.n + 1;i++)
    this.weight.push(new Array(this.data[0].length +1));
    this.weight[this.n][0] = -1;
    this.weight[this.n][1] = 0;
    this.weight[this.n][2] = 1;
    this.expecationLabel = database.expecationLabel;// 儲存資料庫中期望值的種類
    
    this.mDrawer = new Drawer(database);//draw(database);
    //w1 x + w2 y + w0 = 0  ->  y = -(w1 / w2)x + -(w0 / w2)    //w0 = -1
//    this.mDrawer.drawPoint();

    //等database...不同步有點煩
    function wait () {
            setTimeout(function () {
                neuron.mDrawer.drawPoint();
                neuron.mDrawer.drawFunc('-1*('+neuron.weight[neuron.n][1].toString()+'/'+neuron.weight[neuron.n][2].toString()+')*x+('+neuron.weight[neuron.n][0].toString()+'/'+neuron.weight[neuron.n][2].toString()+')' );   
             
            }, 500);
        }
        
   wait();

    console.log('-1*('+this.weight[this.n][1].toString()+'/'+this.weight[this.n][2].toString()+')*x+('+this.weight[this.n][0].toString()+'/'+this.weight[this.n][2].toString()+')');
    
    this.Multiplication = function (d,w) { // 矩陣相乘 d  要補 -1
        var result = 0;
        console.log(d);
        for(var i = 0; i < w.length; i++){
            if(i == 0)
                result += -1 * w[i];
            else
                result += d[i-1] * w[i];
        }
        
        return result;
    };
    
    this.threshold = function (r) { // 活化函數 閥值 ,  0 不更新W , 1 W+學習率*X , 2 W-學習率*X
        var temp;
        
        if(this.expecation[this.dataStep] != 1)
            temp = -1;
        else
            temp = this.expecation[this.dataStep];
        
        console.log('dataStep:'+this.dataStep+',temp:'+temp+','+'r:'+r);
        if(temp * r >= 0) {// 正確分類
            return 0;
        }
        else{
            if(r > 0)
                return 2;
            else
                return 1;
        }
        
    };

    /*
    for(var a = 0;a < 2;a++){
        this.Learning(1);
        if(a == 1){
             this.mDrawer.clearFunc();
                this.mDrawer.drawCircle(this.data[this.dataStep]);
                this.mDrawer.drawFunc('-1*('+this.weight[this.n][1].toString()+'/'+this.weight[this.n][2].toString()+')*x+('+this.weight[this.n][0].toString()+'/'+this.weight[this.n][2].toString()+')' );   
                console.log('-1*('+this.weight[this.n][1].toString()+'/'+this.weight[this.n][2].toString()+')*x+('+this.weight[this.n][0].toString()+'/'+this.weight[this.n][2].toString()+')');
                
        }
     }*/
};
Neuron.prototype = {
    Learning: function (step) {
        switch(step){
            case 0: // 回上一步
                if(this.n > 0){
                    this.n--;
                    console.log("for test:"+this.n);
                    this.weight = this.weight.slice(0,this.weight.length - 1);
                    this.mDrawer.clearFunc();
                    var n = this.n -1;
                    if(n >= 0) {
                        this.dataStep = n % this.data.length;
                        this.mDrawer.drawCircle(this.data[this.dataStep]);
                    }
                    this.mDrawer.drawFunc('-1*('+this.weight[this.n][1].toString()+'/'+this.weight[this.n][2].toString()+')*x+('+this.weight[this.n][0].toString()+'/'+this.weight[this.n][2].toString()+')' );   
                }
                
                break;
            case 1: //下一步
                this.dataStep = this.n % this.data.length;
                var v = this.Multiplication(this.data[this.dataStep],this.weight[this.n]); // v = W * X
                console.log(this.weight[this.n]);                
                switch(this.threshold(v)){
                    case 0: // 不更新
                        this.weight.push(new Array(this.data[0].length +1));
                        this.weight[this.n + 1] = this.weight[this.n].slice(0);
                        console.log("STEP:"+this.n+"W:"+0);
                        break;
                    case 1: // W+學習率*X
                        this.weight.push(new Array(this.data[0].length +1));
                        for(var i = 0; i < this.weight[0].length; i++) {
                            if(i == 0)
                                this.weight[this.n + 1][i] = this.weight[this.n][i] + (-1) * this.learning_rate;
                            else
                                this.weight[this.n + 1][i] = this.weight[this.n][i] + this.data[this.dataStep][i-1] * this.learning_rate;
                        }
                        console.log("STEP:"+this.n+"W:"+1);
                        break;
                    case 2: // W-學習率*X
                        this.weight.push(new Array(this.data[0].length +1));
                        for(var i = 0; i < this.weight[0].length; i++) {
                            if(i == 0)
                                this.weight[this.n + 1][i] = this.weight[this.n][i] - (-1) * this.learning_rate;
                            else
                                this.weight[this.n + 1][i] = this.weight[this.n][i] - this.data[this.dataStep][i-1] * this.learning_rate;
                        }
                        console.log("STEP:"+this.n+"W:"+2);
                        break;
                        
                }
                
                this.n++;
                if(enableAnimation) {
                    this.mDrawer.clearFunc();
                    this.mDrawer.drawCircle(this.data[this.dataStep]);
                    this.mDrawer.drawFunc('-1*('+this.weight[this.n][1].toString()+'/'+this.weight[this.n][2].toString()+')*x+('+this.weight[this.n][0].toString()+'/'+this.weight[this.n][2].toString()+')' );   
                    console.log('-1*('+this.weight[this.n][1].toString()+'/'+this.weight[this.n][2].toString()+')*x+('+this.weight[this.n][0].toString()+'/'+this.weight[this.n][2].toString()+')');
                }
                break;
        }
        pb(); // 更新進度條
        return this.n;
    },
    startAnimation: function (c) {
        function myLoop (n,t) {           //  create a loop function
            setTimeout(function () {    //  call a 3s setTimeout when the loop is called
                                         //  increment the counter
               if (neuron.n < t) {            //  if the counter < 10, call the loop function
                  
                    if(neuron.auto_control) {   // 暫停控制用
                        neuron.Learning(1);
                        myLoop(n,t); 
                    }                  //  ..  again which will trigger another 
                    
               }                        //  ..  setTimeout()
               else if(!enableAnimation) { // 不開動畫要再最後一次畫上結果
                    neuron.mDrawer.clearFunc();
                    neuron.mDrawer.drawCircle(neuron.data[neuron.dataStep]);
                    neuron.mDrawer.drawFunc('-1*('+neuron.weight[neuron.n][1].toString()+'/'+neuron.weight[neuron.n][2].toString()+')*x+('+neuron.weight[neuron.n][0].toString()+'/'+neuron.weight[neuron.n][2].toString()+')' );   
                    //console.log('-1*('+this.weight[this.n][1].toString()+'/'+this.weight[this.n][2].toString()+')*x+('+this.weight[this.n][0].toString()+'/'+this.weight[this.n][2].toString()+')');
                                   
               }
            }, 1000.0/neuron.fps);
        }
        myLoop(this.n,this.true_loop_times);        
    
    },
    stopAnimation: function(){ // reinintialize!!
        this.auto_control = false;
        this.n = 0;
        pb();
        this.weight = this.weight.slice(0,1);
        this.mDrawer.clearFunc();
        this.mDrawer.drawFunc('-1*('+this.weight[this.n][1].toString()+'/'+this.weight[this.n][2].toString()+')*x+('+this.weight[this.n][0].toString()+'/'+this.weight[this.n][2].toString()+')' );   
                console.log('-1*('+this.weight[this.n][1].toString()+'/'+this.weight[this.n][2].toString()+')*x+('+this.weight[this.n][0].toString()+'/'+this.weight[this.n][2].toString()+')');
                
    },
    setLearningTimes: function(t){
        t = this.learning_times;
        this.true_loop_times = t * this.data.length;
    }
    
    
};