/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var Neuron = function (database,learning_rate,learning_times,fps) {
    //console.log(database.trainingData);
    //訓練
    this.n = 0;// 回圈次數
    this.dataStep;// data學習循環
    this.data = database.trainingData;// 多維度 資料數 * 資料維度
    this.expecation = database.train_expecation;
    
    // 測試
    this.n1 = 0;
    this.test_dataStep;
    this.test_data = database.testingData;// 多維度 資料數 * 資料維度
    this.test_expecation = database.test_expecation;
    
    this.learning_rate = learning_rate;
    this.learning_times = learning_times;// 學習次數 = 回圈次數 / 資料數 -。 學習一次要跑全部的資料
    this.true_loop_times = this.learning_times * this.data.length;
    this.auto_control = true;
    this.fps = fps;
    this.isUpdate = false;
    
    this.error = []; // 儲存分類錯誤的data
    this.errorPos = [];// 為了加速繪圖
    
    this.training_error= [];
    
    this.weight = [];
    //for(var i = 0;i < this.n + 1;i++)
    var initW = ['-1','0','1','0','1','0','1','0','1','0','1','0','1','0','1','0','1'];
    this.weight.push(new Array(this.data[0].length +1));
    this.weight[this.n][0] = -1;
    for(var i = 1; i < this.data[0].length +1; i++)
        this.weight[this.n][i] = (i-1)%2;
    //    this.weight[this.n][0] = -1;
    //    this.weight[this.n][1] = 0;
    //    this.weight[this.n][2] = 1;
    //console.log(this.weight);
    //console.log(this.data[0].length);
    this.expecationLabel = database.expecationLabel;// 儲存資料庫中期望值的種類
    
    this.mDrawer = new Drawer(database);//draw(database);
    //w1 x + w2 y + w0 = 0  ->  y = -(w1 / w2)x + -(w0 / w2)    //w0 = -1
//    this.mDrawer.drawPoint();

    //等database...不同步有點煩
    function wait () {
        setTimeout(function () {
            neuron.mDrawer.drawPoint(0);
            neuron.mDrawer.drawFunc('-1*('+neuron.weight[neuron.n][1].toString()+'/'+neuron.weight[neuron.n][2].toString()+')*x+('+neuron.weight[neuron.n][0].toString()+'/'+neuron.weight[neuron.n][2].toString()+')' );   

        }, 500);
    }
        
    wait();

    ////console.log('-1*('+this.weight[this.n][1].toString()+'/'+this.weight[this.n][2].toString()+')*x+('+this.weight[this.n][0].toString()+'/'+this.weight[this.n][2].toString()+')');
    
    this.Multiplication = function (d,w) { // 矩陣相乘 d  要補 -1
        var result = 0;
        //console.log(d);
        //console.log("Weight Length:"+w.length);
        for(var i = 0; i < w.length; i++){
            if(i == 0)
                result += -1 * w[i];
            else
                result += d[i-1] * w[i];
        }
        //console.log("Result:"+result);
        return result;
    };
    
    this.threshold = function (r) { // 活化函數 閥值 ,  0 不更新W , 1 W+學習率*X , 2 W-學習率*X
        var temp;
        
        if(this.expecation[this.dataStep] != 1)
            temp = -1;
        else
            temp = this.expecation[this.dataStep];
        //console.log("Result r:"+r); 
        //console.log("temp r:"+temp); 
        //console.log('dataStep:'+this.dataStep+',temp:'+temp+','+'r:'+r);
        if(temp * r >= 0) {// 正確分類
            this.isUpdate = false;
            return 0;
        }
        else{
            this.isUpdate = true;
            if(r > 0)
                return 2;
            else
                return 1;
        }
        
    };
    
    this.testing = function (r) { // 活化函數 閥值 ,  0 不更新W , 1 W+學習率*X , 2 W-學習率*X
        var temp;
        
        if(this.test_expecation[this.test_dataStep] != 1)
            temp = -1;
        else
            temp = this.test_expecation[this.test_dataStep];
        
        ////console.log('dataStep:'+this.dataStep+',temp:'+temp+','+'r:'+r);
        if(temp * r >= 0) {// 正確分類
        }
        else{// 錯誤分類
            this.error.push(this.test_data[this.test_dataStep]);
            this.errorPos.push(this.test_dataStep);
        }
        
    };
    
    this.training_testing = function (r) { // 活化函數 閥值 ,  0 不更新W , 1 W+學習率*X , 2 W-學習率*X
        var temp;
        
        if(this.expecation[this.test_dataStep] != 1)
            temp = -1;
        else
            temp = this.expecation[this.test_dataStep];
        
        ////console.log('dataStep:'+this.dataStep+',temp:'+temp+','+'r:'+r);
        if(temp * r >= 0) {// 正確分類
        }
        else{// 錯誤分類
            this.training_error.push(this.data[this.test_dataStep]);
        }
        
    };

    /*
    for(var a = 0;a < 2;a++){
        this.Learning(1);
        if(a == 1){
             this.mDrawer.clearFunc();
                this.mDrawer.drawCircle(this.data[this.dataStep]);
                this.mDrawer.drawFunc('-1*('+this.weight[this.n][1].toString()+'/'+this.weight[this.n][2].toString()+')*x+('+this.weight[this.n][0].toString()+'/'+this.weight[this.n][2].toString()+')' );   
                //console.log('-1*('+this.weight[this.n][1].toString()+'/'+this.weight[this.n][2].toString()+')*x+('+this.weight[this.n][0].toString()+'/'+this.weight[this.n][2].toString()+')');
                
        }
     }*/
};
Neuron.prototype = {
    Learning: function (step) {
        switch(step){
            case 0: // 回上一步
                if(this.n > 0){
                    this.n--;
                    //console.log("for test:"+this.n);
                    this.weight = this.weight.slice(0,this.weight.length - 1);
                    this.mDrawer.clearFunc();
                    var n = this.n -1;
                    if(n >= 0) {
                        this.dataStep = n % this.data.length;
                        this.mDrawer.drawCircle(this.data[this.dataStep],'#222222');
                    }
                    this.mDrawer.drawFunc('-1*('+this.weight[this.n][1].toString()+'/'+this.weight[this.n][2].toString()+')*x+('+this.weight[this.n][0].toString()+'/'+this.weight[this.n][2].toString()+')' );   
                }
                
                break;
            case 1: //下一步
                this.dataStep = this.n % this.data.length;
                var v = this.Multiplication(this.data[this.dataStep],this.weight[this.n]); // v = W * X
                //console.log(this.weight[this.n]);                
                switch(this.threshold(v)){
                    case 0: // 不更新
                        this.weight.push(new Array(this.data[0].length +1));
                        this.weight[this.n + 1] = this.weight[this.n].slice(0);
                        //console.log("STEP:"+this.n+"W:"+0);
                        break;
                    case 1: // W+學習率*X
                        this.weight.push(new Array(this.data[0].length +1));
                        for(var i = 0; i < this.weight[0].length; i++) {
                            if(i == 0)
                                this.weight[this.n + 1][i] = this.weight[this.n][i] + (-1) * this.learning_rate;
                            else
                                this.weight[this.n + 1][i] = this.weight[this.n][i] + this.data[this.dataStep][i-1] * this.learning_rate;
                        }
                        //console.log("STEP:"+this.n+"W:"+1);
                        break;
                    case 2: // W-學習率*X
                        this.weight.push(new Array(this.data[0].length +1));
                        for(var i = 0; i < this.weight[0].length; i++) {
                            if(i == 0)
                                this.weight[this.n + 1][i] = this.weight[this.n][i] - (-1) * this.learning_rate;
                            else
                                this.weight[this.n + 1][i] = this.weight[this.n][i] - this.data[this.dataStep][i-1] * this.learning_rate;
                        }
                        //console.log("STEP:"+this.n+"W:"+2);
                        break;
                        
                }
                
                this.n++;
                if(enableAnimation) {
                    this.functionUpdate('function');
                    this.mDrawer.clearFunc();
                    this.mDrawer.drawCircle(this.data[this.dataStep],'#222222');
                    this.mDrawer.drawFunc('-1*('+this.weight[this.n][1].toString()+'/'+this.weight[this.n][2].toString()+')*x+('+this.weight[this.n][0].toString()+'/'+this.weight[this.n][2].toString()+')' );   
                    //console.log('-1*('+this.weight[this.n][1].toString()+'/'+this.weight[this.n][2].toString()+')*x+('+this.weight[this.n][0].toString()+'/'+this.weight[this.n][2].toString()+')');
                }
                else if (!enableAnimation && this.n == this.true_loop_times){
                    this.functionUpdate('function');
                    neuron.mDrawer.clearFunc();
                    neuron.mDrawer.drawCircle(neuron.data[neuron.dataStep],'#222222');
                    neuron.mDrawer.drawFunc('-1*('+neuron.weight[neuron.n][1].toString()+'/'+neuron.weight[neuron.n][2].toString()+')*x+('+neuron.weight[neuron.n][0].toString()+'/'+neuron.weight[neuron.n][2].toString()+')' );   
                    
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
               else{
                   function myLoop1 () { 
                        setTimeout(function () { 
                            neuron.Training_testing();
                        }, 1000);
                    }
                    myLoop1(); 
               }
                   
//               else if(enableAnimation == false) { // 不開動畫要再最後一次畫上結果
//                   this.functionUpdate('function');
//                    neuron.mDrawer.clearFunc();
//                    neuron.mDrawer.drawCircle(neuron.data[neuron.dataStep]);
//                    neuron.mDrawer.drawFunc('-1*('+neuron.weight[neuron.n][1].toString()+'/'+neuron.weight[neuron.n][2].toString()+')*x+('+neuron.weight[neuron.n][0].toString()+'/'+neuron.weight[neuron.n][2].toString()+')' );   
//                    ////console.log('-1*('+this.weight[this.n][1].toString()+'/'+this.weight[this.n][2].toString()+')*x+('+this.weight[this.n][0].toString()+'/'+this.weight[this.n][2].toString()+')');
//                                   
//               }
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
                //console.log('-1*('+this.weight[this.n][1].toString()+'/'+this.weight[this.n][2].toString()+')*x+('+this.weight[this.n][0].toString()+'/'+this.weight[this.n][2].toString()+')');
                
    },
    pauseAnimation: function(){ // 暫停就顯示目前狀況        
        this.mDrawer.clearFunc();
        this.mDrawer.drawFunc('-1*('+this.weight[this.n][1].toString()+'/'+this.weight[this.n][2].toString()+')*x+('+this.weight[this.n][0].toString()+'/'+this.weight[this.n][2].toString()+')' );   
                //console.log('-1*('+this.weight[this.n][1].toString()+'/'+this.weight[this.n][2].toString()+')*x+('+this.weight[this.n][0].toString()+'/'+this.weight[this.n][2].toString()+')');
                
    },
    setLearningTimes: function(t){
        t = this.learning_times;
        this.true_loop_times = t * this.data.length;
    },
    functionUpdate: function(obj){// append id='function'
        //neuron.functionUpdate('function');
        var n = this.n - 1; 
        var a = [];
        switch(this.data[0].length){ // 唉..一樣用最笨方案
            case 2:
            //Latex
            var test = "\
            $$n = "+n+"$$\n\
            $$\\begin{equation}\n\
                y("+n+")=\\varphi\n\
                \\left[\n\
                    \\begin{array}{cc}\n\
                        \\omega^{T}("+n+") & x("+n+")\\\\ \n\
                    \\end{array}\n\
                \\right]\n\
            =\n\
            \n\
            \n\
                \\left[\n\
                    \\begin{array}{cc}\n\
                        \\left(\n\
                            \\begin{array}{ccc}\n\
                                "+parseFloat(Math.round(this.weight[n][0]*100))/100+" & "+parseFloat(Math.round(this.weight[n][1]*100))/100+" & "+parseFloat(Math.round(this.weight[n][2]*100))/100+"\\\\ \n\
                            \\end{array}\n\
                        \\right)\n\
                        &\n\
                        \\left(\n\
                            \\begin{array}{c}\n\
                                -1\\\\ \n\
                                "+this.data[this.dataStep][0]+" \\\\ \n\
                                "+this.data[this.dataStep][1]+" \\\\ \n\
                            \\end{array}\n\
                        \\right)\n\
                        \\\\ \n\
                    \\end{array}\n\
                \\right]\n\
            \\end{equation}$$\n\
            \n\
            \n\
            ";
            if(this.isUpdate) {
                test += "\n\
                $$\\begin{equation}\n\
                    \\omega("+this.n+") = \\omega("+n+")-\\eta x("+n+") =\n\
                    \\left(\n\
                        \\begin{array}{c}  \n\
                            "+parseFloat(Math.round(this.weight[this.n][0]*100))/100+"\\\\ \n\
                            "+parseFloat(Math.round(this.weight[this.n][1]*100))/100+" \\\\ \n\
                            "+parseFloat(Math.round(this.weight[this.n][2]*100))/100+" \\\\ \n\
                        \\end{array}\n\
                    \\right) \n\
                \\end{equation}$$\n\
                \n\
                ";            
            }
            else{
                test += "\n\
                $$\\begin{equation}\n\
                    \\omega("+this.n+") = \\omega("+n+") =\n\
                    \\left(\n\
                        \\begin{array}{c}  \n\
                            "+parseFloat(Math.round(this.weight[this.n][0]*100))/100+"\\\\ \n\
                            "+parseFloat(Math.round(this.weight[this.n][1]*100))/100+" \\\\ \n\
                            "+parseFloat(Math.round(this.weight[this.n][2]*100))/100+" \\\\ \n\
                        \\end{array}\n\
                    \\right) \n\
                \\end{equation}$$\n\
                \n\
                ";

            }
                break;
            case 3:
            //Latex
            var test = "\
            $$n = "+n+"$$\n\
            $$\\begin{equation}\n\
                y("+n+")=\\varphi\n\
                \\left[\n\
                    \\begin{array}{cc}\n\
                        \\omega^{T}("+n+") & x("+n+")\\\\ \n\
                    \\end{array}\n\
                \\right]\n\
            =\n\
            \n\
            \n\
                \\left[\n\
                    \\begin{array}{cc}\n\
                        \\left(\n\
                            \\begin{array}{ccc}\n\
                                "+parseFloat(Math.round(this.weight[n][0]*100))/100+" & "+parseFloat(Math.round(this.weight[n][1]*100))/100+" & "+parseFloat(Math.round(this.weight[n][2]*100))/100+" & "+parseFloat(Math.round(this.weight[n][1]*100))/100+"\\\\ \n\
                            \\end{array}\n\
                        \\right)\n\
                        &\n\
                        \\left(\n\
                            \\begin{array}{c}\n\
                                -1\\\\ \n\
                                "+this.data[this.dataStep][0]+" \\\\ \n\
                                "+this.data[this.dataStep][1]+" \\\\ \n\
                                "+this.data[this.dataStep][2]+" \\\\ \n\
                            \\end{array}\n\
                        \\right)\n\
                        \\\\ \n\
                    \\end{array}\n\
                \\right]\n\
            \\end{equation}$$\n\
            \n\
            \n\
            ";
            if(this.isUpdate) {
                test += "\n\
                $$\\begin{equation}\n\
                    \\omega("+this.n+") = \\omega("+n+")-\\eta x("+n+") =\n\
                    \\left(\n\
                        \\begin{array}{c}  \n\
                            "+parseFloat(Math.round(this.weight[this.n][0]*100))/100+"\\\\ \n\
                            "+parseFloat(Math.round(this.weight[this.n][1]*100))/100+" \\\\ \n\
                            "+parseFloat(Math.round(this.weight[this.n][2]*100))/100+" \\\\ \n\
                            "+parseFloat(Math.round(this.weight[this.n][3]*100))/100+" \\\\ \n\
                        \\end{array}\n\
                    \\right) \n\
                \\end{equation}$$\n\
                \n\
                ";            
            }
            else{
                test += "\n\
                $$\\begin{equation}\n\
                    \\omega("+this.n+") = \\omega("+n+") =\n\
                    \\left(\n\
                        \\begin{array}{c}  \n\
                            "+parseFloat(Math.round(this.weight[this.n][0]*100))/100+"\\\\ \n\
                            "+parseFloat(Math.round(this.weight[this.n][1]*100))/100+" \\\\ \n\
                            "+parseFloat(Math.round(this.weight[this.n][2]*100))/100+" \\\\ \n\
                            "+parseFloat(Math.round(this.weight[this.n][2]*100))/100+" \\\\ \n\
                        \\end{array}\n\
                    \\right) \n\
                \\end{equation}$$\n\
                \n\
                ";

            }
                break;
            case 4:
                break;
            case 5:
                break;
            case 6:
                break;
            
        }

        
        
        $('#'+obj).html(test);
        // append 要叫mathjax去更新他
        MathJax.Hub.Queue(["Typeset",MathJax.Hub,obj]);
        
    },
    Testing: function () {
        this.mDrawer.clearAll();
        while(this.n1 < this.test_data.length){
            this.test_dataStep = this.n1;// % this.test_data.length;
            var v = this.Multiplication(this.test_data[this.test_dataStep],this.weight[this.n]); // this.n 固定(最後的weight結果)

            // 計算分類結果  並將結果存入  this.error
            this.testing(v);
            this.n1++;
        }
        
        
        this.mDrawer.drawPoint(1);
        this.mDrawer.drawFunc('-1*('+this.weight[this.n][1].toString()+'/'+this.weight[this.n][2].toString()+')*x+('+this.weight[this.n][0].toString()+'/'+this.weight[this.n][2].toString()+')' );   
        ////console.log(this.error);    
        alert("測試正確率：" + (1.0 - this.error.length / this.test_data.length)+"\n\n");
        
    },
    Training_testing: function () {
        while(this.n1 < this.data.length){
            this.test_dataStep = this.n1;// % this.test_data.length;
            var v = this.Multiplication(this.data[this.test_dataStep],this.weight[this.n]); // this.n 固定(最後的weight結果)

            // 計算分類結果  並將結果存入  this.error
            this.training_testing(v);
            this.n1++;
        }
        
        
        //console.log(this.training_error);     
        alert("訓練正確率：" + (1.0 - this.training_error.length / this.data.length)+"\n\n");
        //console.log(this.weight[this.n]);
        this.n1 = 0;
        
    }
    
    
};