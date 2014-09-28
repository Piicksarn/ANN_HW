/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var Database = function () {
    this.data;// 多維度 資料數 * 資料維度
    this.expecation;
    this.expecationLabel = new Array();// 儲存資料庫中期望值的種類
    this.maxData = 0;// 計算資料最大數字 方便作圖
    this.dataLineArray;
    
    
    
    
    /*
    //宣告資料陣列
    var d1 = this.dataLineArray.length;//資料個數
    var d2 = this.dataLineArray[0].length;//資料維度 + 期望值

    //資料
    this.data = new Array(d1);
    for (var i = 0 ; i < d1 ; i++) {
      this.data[i] = new Array(d2 - 1);
    } 

    // 期望
    this.expecation = new Array(d1);

    //讀取與儲存陣列
    this.data = this.dataLineArray;
    for (var i = 0 ; i < d1 ; i++)
        this.data.splice(this.data.length - 1,1);
    console.log("draw point "+this.data);
    
    
    for (var i = 0 ; i < d1 ; i++) {
        for (var j = 0 ; j < d2 - 1 ; j++) {
            this.data[i] =  this.data[i]||{};//init database 解決database[0][0]  undefined problem
            this.data[i][j] = i + j;            
             if(this.maxData < this.data[i][j])
                 this.maxData = this.data[i][j];
        }
                
        if(i == 0) {
            this.expecation[0] = 0;
            this.expecationLabel.push(this.expecation[0]);
        }
        else
            this.expecation[i] = 1;
        
        var t = this.expecationLabel.indexOf(this.expecation[i]);
        if(t == -1)
            this.expecationLabel.push(this.expecation[i]);
    
        
        console.log("draw point"+this.data[i]);
        console.log("draw point expecation"+this.expecation[i]);
        
    }
    */

    //console.log("draw point expecLabel"+this.expecationLabel);
    
        
};

Database.prototype = {
    data: '',
    expecation: '',
    expecationLabel:'',
    maxData: '',
    dataLineArray: '',
    readTextFile: function(file){
        var allText;
    
        var rawFile = new XMLHttpRequest();
        rawFile.open("GET", file, false);
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
        //console.log(lineArray);
        //console.log("lineArray:"+lineArray);
        // 解決視窗os機車回車問題...
        console.log("lineArray[END]:"+lineArray[lineArray.length - 1].length);
        if(lineArray[lineArray.length - 1].length == 0)
            lineArray = lineArray.slice(0,lineArray.length - 1);
        //console.log("lineArray:"+lineArray[lineArray.length - 1].length);
        
        // 解決不同格式問題...(真的很無聊...這不是重點吧)
        //console.log(lineArray[2].indexOf(' '));
        for(var i = 0; i < lineArray.length; i++) {  
            lineArray[i] = lineArray[i].replace(/[ ]/g,"\t");
            if(lineArray[i].indexOf('\t') == 0)
                lineArray[i] = lineArray[i].slice(1,lineArray[i].length - 1); 
        }
        console.log("lineArray:"+lineArray.length);
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

        console.log(this.expecationLabel);
        console.log(this.expecation);
        console.log(this.data);
    }
    
};