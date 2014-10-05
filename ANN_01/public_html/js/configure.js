/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var enableAnimation = true;
var pb;
var neuron;

var AnimationStatus = 0;
if(typeof Status == "undefined") {
    var Status = {};
    Status.Stop = 0;
    Status.Start = 1;
    Status.Pause = 2;
};