/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var Database = function () {
    this.data;// 多維度 資料數 * 資料維度
    this.trainingData;
    this.testingData;
    this.expecation;
    this.train_expecation;
    this.test_expecation;
    this.expecationLabel = new Array();// 儲存資料庫中期望值的種類
    this.maxData = 0;// 計算資料最大數字 方便作圖
    this.dataLineArray;
    this.choice;
};

Database.prototype = {
    readTextFile: function(file){
        var allText;
    
        var rawFile = new XMLHttpRequest();
        rawFile.open("GET", file, false);
        // 作弊
        this.choice = file.slice(file.length - 8,file.length);
        rawFile.onreadystatechange = function ()
        {
            if(rawFile.readyState === 4)
            {
                if(rawFile.status === 200 || rawFile.status == 0)
                {
                    allText = rawFile.responseText;
                    //allText = allText0.slice(0);
                    
                }
            }
        };
        rawFile.send(null);
    
    
        var lineArray = allText.split('\n'); // 依照 \n 切割
        ////console.log(lineArray);
        ////console.log("lineArray:"+lineArray);
        // 解決視窗os機車回車問題...
        //console.log("lineArray[END]:"+lineArray[lineArray.length - 1].length);
        if(lineArray[lineArray.length - 1].length == 0)
            lineArray = lineArray.slice(0,lineArray.length - 1);
        ////console.log("lineArray:"+lineArray[lineArray.length - 1].length);
        
        // 解決不同格式問題...(真的很無聊...這不是重點吧)
        ////console.log(lineArray[2].indexOf(' '));
        for(var i = 0; i < lineArray.length; i++) {  
            // 將每個space轉成 tab
            //lineArray[i] = lineArray[i].replace(/[ ]/g,"\t");
            // 將每個space 或是 連續space 轉成 tab
            if(this.choice == 'ring.txt')
                lineArray[i] = lineArray[i].replace(/ +(?= )/g,"\t");
            else
                lineArray[i] = lineArray[i].replace(/[ ]/g,"\t");
            
            //console.log(lineArray[i]);
            ////console.log("lineArray[i].indexOf('\t'):"+lineArray[i].indexOf('\t'));
            if(lineArray[i].indexOf('\t') == 0) {
                lineArray[i] = lineArray[i].slice(1,lineArray[i].length - 1); 
            }
        }
        //console.log("lineArray:"+lineArray.length);
        // 將每一行的元素依照 \t 分割 存成2維陣列
        this.dataLineArray = new Array(lineArray.length);
        for(var i = 0; i < lineArray.length; i++){
            lineArray[i] = lineArray[i].replace(/(?:\r\n|\r|\n)/g,'');//刪除換行字元
            this.dataLineArray[i] = lineArray[i].split("\t");
        }

        // 轉成數字
        for(var i = 0; i < this.dataLineArray.length; i++){
            for(var j = 0; j < this.dataLineArray[0].length; j++){
                this.dataLineArray[i][j] = parseFloat(this.dataLineArray[i][j]);
            }
        }

        // 存入要用的陣列
        //
        // 宣告資料陣列
        var d1 = this.dataLineArray.length;//資料個數
        var d2 = this.dataLineArray[0].length;//資料維度 + 期望值
        
        // 資料
        this.data = new Array(d1);
        for (var i = 0 ; i < d1 ; i++) {
          this.data[i] = new Array(d2 - 1);
        } 

        // 期望
        this.expecation = new Array(d1);

        // 讀取與儲存陣列
        // 
        // 期望
        for (var i = 0 ; i < d1 ; i++) 
            this.expecation[i] = this.dataLineArray[i][this.dataLineArray[0].length - 1];

        // 資料
        this.data = this.dataLineArray.slice(0);

        for (var i = 0 ; i < d1 ; i++) 
            this.data[i].splice(this.data[i].length - 1,1);

        // 計算期望種類
        //this.expecationLabel = new Array();
        this.expecationLabel.push(this.expecation[0]);  
        for (var i = 1 ; i < d1 ; i++) { 
            var t = this.expecationLabel.indexOf(this.expecation[i]);
            if(t == -1) 
                this.expecationLabel.push(this.expecation[i]);
        }
        
        // 計算資料中的最大值
        for (var i = 0 ; i < d1 ; i++) {
            for (var j = 0 ; j < d2 - 1 ; j++) {          
                 if(this.maxData < this.data[i][j])
                     this.maxData = this.data[i][j];
            }
        }
        
        
        
        // 將資料分割成 訓練與測試資料
        if(this.data.length >= 60) {
            
            var data_length = this.data.length;
            // 打亂資料
            for(var i = 0; i < 30; i++){
                var a = Math.ceil(Math.random()*data_length);
                var b = Math.ceil(Math.random()*data_length);

                var temp1 = this.data[a];
                var temp2 = this.expecation[a];

                this.data[a] = this.data[b];
                this.data[b] = temp1;

                this.expecation[a] = this.expecation[b];
                this.expecation[b] = temp2;

            }
            
            var r1 = Math.floor(this.data.length * (1-2/3.0)/2);
            var r3 = r1;
            var r2 = this.data.length - (r1 + r3);
            this.trainingData = this.data.slice(r1 , r1 + r2);
            this.train_expecation = this.expecation.slice(r1 , r1 + r2);
            this.testingData = this.data.slice(0 , r1).concat(this.data.slice(r1 + r2 , this.data.length));
            this.test_expecation = this.expecation.slice(0 , r1).concat(this.expecation.slice(r1 + r2 , this.data.length));
            
        }
        // 分成 1 2 1  (2 trainingData  1+1 testingData)
        else{
            this.trainingData = this.data.slice(1 , 3);
            this.train_expecation = this.expecation.slice(1 , 3);
            this.testingData = this.data.slice(0 , 1).concat(this.data.slice(3 , 4));
            this.test_expecation = this.expecation.slice(0 , 1).concat(this.expecation.slice(3 , 4));
        }
        
        if(this.trainingData[0].length == 3) {
            mode3D = true;
        }
        else
            mode3D = false;
           
                      
        //console.log("Data Start");
        //console.log(this.data);
        //console.log(this.trainingData);
        //console.log(this.testingData);
        //console.log("Data End");
        //console.log("expecation Start");
        //console.log(this.expecation);
        //console.log(this.train_expecation);
        //console.log(this.test_expecation);
        //console.log("expecation End");
        //console.log("expecationLabel Start");
        //console.log(this.expecationLabel);  
        //console.log("expecationLabel End");
    }
    
};