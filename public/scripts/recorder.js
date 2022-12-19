/*!
 *
 * js-audio-recorder - js audio recorder plugin
 *
 * @version v0.3.1
 * @homepage https://github.com/2fps/recorder
 * @author 2fps <echoweb@126.com> (http://www.zhuyuntao.cn)
 * @license MIT
 *
 */
!function(t,e){"object"==typeof exports&&"object"==typeof module?module.exports=e():"function"==typeof define&&define.amd?define([],e):"object"==typeof exports?exports.Recorder=e():t.Recorder=e()}(window,function(){return function(t){var e={};function n(i){if(e[i])return e[i].exports;var r=e[i]={i:i,l:!1,exports:{}};return t[i].call(r.exports,r,r.exports,n),r.l=!0,r.exports}return n.m=t,n.c=e,n.d=function(t,e,i){n.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:i})},n.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},n.t=function(t,e){if(1&e&&(t=n(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var i=Object.create(null);if(n.r(i),Object.defineProperty(i,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var r in t)n.d(i,r,function(e){return t[e]}.bind(null,r));return i},n.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return n.d(e,"a",e),e},n.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},n.p="",n(n.s=0)}([function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var i=function(){function t(t){void 0===t&&(t={}),this.lBuffer=[],this.rBuffer=[],this.inputSampleBits=16;var e,n=new(window.AudioContext||window.webkitAudioContext);this.inputSampleRate=n.sampleRate,this.config={sampleBits:~[8,16].indexOf(t.sampleBits)?t.sampleBits:16,sampleRate:~[11025,16e3,22050,24e3,44100,48e3].indexOf(t.sampleRate)?t.sampleRate:this.inputSampleRate,numChannels:~[1,2].indexOf(t.numChannels)?t.numChannels:1},this.outputSampleRate=this.config.sampleRate,this.oututSampleBits=this.config.sampleBits,this.littleEdian=(e=new ArrayBuffer(2),new DataView(e).setInt16(0,256,!0),256===new Int16Array(e)[0]),this.initUserMedia()}return t.prototype.initRecorder=function(){var t=this;this.context&&this.destroy(),this.context=new(window.AudioContext||window.webkitAudioContext),this.analyser=this.context.createAnalyser(),this.analyser.fftSize=2048;var e=this.context.createScriptProcessor||this.context.createJavaScriptNode;this.recorder=e.apply(this.context,[4096,this.config.numChannels,this.config.numChannels]),this.recorder.onaudioprocess=function(e){if(t.isrecording&&!t.ispause){var n=e.inputBuffer.getChannelData(0),i=null;t.lBuffer.push(new Float32Array(n)),t.size+=n.length,2===t.config.numChannels&&(i=e.inputBuffer.getChannelData(1),t.rBuffer.push(new Float32Array(i)),t.size+=i.length),t.duration+=4096/t.inputSampleRate,t.onprocess&&t.onprocess(t.duration)}}},t.prototype.start=function(){var e=this;if(!this.isrecording)return this.clear(),this.initRecorder(),this.isrecording=!0,navigator.mediaDevices.getUserMedia({audio:!0}).then(function(t){e.audioInput=e.context.createMediaStreamSource(t)},function(e){t.throwError(e.name+" : "+e.message)}).then(function(){e.audioInput.connect(e.analyser),e.analyser.connect(e.recorder),e.recorder.connect(e.context.destination)})},t.prototype.pause=function(){this.isrecording&&!this.ispause&&(this.ispause=!0,this.recorder.disconnect())},t.prototype.resume=function(){this.isrecording&&this.ispause&&(this.ispause=!1,this.audioInput&&this.audioInput.connect(this.analyser),this.analyser.connect(this.recorder),this.recorder.connect(this.context.destination))},t.prototype.stop=function(){this.isrecording=!1,this.audioInput&&this.audioInput.disconnect(),this.recorder.disconnect()},t.prototype.play=function(){var e=this;this.stop(),this.source&&this.source.stop(),this.context.decodeAudioData(this.getWAV().buffer,function(t){e.source=e.context.createBufferSource(),e.source.buffer=t,e.source.connect(e.analyser),e.analyser.connect(e.context.destination),e.source.start()},function(e){t.throwError(e)})},t.prototype.getRecordAnalyseData=function(){if(this.ispause)return this.prevDomainData;var t=new Uint8Array(this.analyser.frequencyBinCount);return this.analyser.getByteTimeDomainData(t),this.prevDomainData=t},t.prototype.getPlayAnalyseData=function(){return this.getRecordAnalyseData()},t.prototype.initUserMedia=function(){void 0===navigator.mediaDevices&&(navigator.mediaDevices={}),void 0===navigator.mediaDevices.getUserMedia&&(navigator.mediaDevices.getUserMedia=function(t){var e=navigator.getUserMedia||navigator.webkitGetUserMedia||navigator.mozGetUserMedia;return e?new Promise(function(n,i){e.call(navigator,t,n,i)}):Promise.reject(new Error("浏览器不支持 getUserMedia !"))})},t.prototype.getPCM=function(){var e=this.flat();return e=t.compress(e,this.inputSampleRate,this.outputSampleRate),t.encodePCM(e,this.oututSampleBits,this.littleEdian)},t.prototype.getPCMBlob=function(){return new Blob([this.getPCM()])},t.prototype.downloadPCM=function(t){void 0===t&&(t="recorder"),this.stop();var e=this.getPCMBlob();this.download(e,t,"pcm")},t.prototype.getWAV=function(){var e=this.getPCM();return t.encodeWAV(e,this.inputSampleRate,this.outputSampleRate,this.config.numChannels,this.oututSampleBits,this.littleEdian)},t.prototype.getWAVBlob=function(){return new Blob([this.getWAV()],{type:"audio/wav"})},t.prototype.downloadWAV=function(t){void 0===t&&(t="recorder"),this.stop();var e=this.getWAVBlob();this.download(e,t,"wav")},t.prototype.destroy=function(){return this.closeAudioContext()},t.prototype.closeAudioContext=function(){return this.context.close?this.context.close():new Promise(function(t){t()})},t.prototype.download=function(e,n,i){try{var r=document.createElement("a");r.href=window.URL.createObjectURL(e),r.download=n+"."+i,r.click()}catch(e){t.throwError(e)}},t.prototype.clear=function(){this.lBuffer.length=0,this.rBuffer.length=0,this.size=0,this.PCMData=null,this.audioInput=null,this.duration=0,this.ispause=!1,this.source&&(this.source.stop(),this.source=null)},t.prototype.flat=function(){if(this.PCMData)return this.PCMData;var t=null,e=new Float32Array(0);1===this.config.numChannels?t=new Float32Array(this.size):(t=new Float32Array(this.size/2),e=new Float32Array(this.size/2));for(var n=0,i=0;i<this.lBuffer.length;i++)t.set(this.lBuffer[i],n),n+=this.lBuffer[i].length;n=0;for(i=0;i<this.rBuffer.length;i++)e.set(this.rBuffer[i],n),n+=this.rBuffer[i].length;return this.PCMData={left:t,right:e}},t.playAudio=function(t){var e=document.createElement("audio");e.src=window.URL.createObjectURL(t),e.play()},t.compress=function(t,e,n){for(var i=Math.max(Math.floor(e/n),1),r=t.left,o=t.right,a=(r.length+o.length)/i,s=new Float32Array(a),u=0,c=0;u<a;)s[u]=r[c],u++,o.length&&(s[u]=o[c],u++),c+=i;return s},t.encodePCM=function(t,e,n){void 0===n&&(n=!0);var i=0,r=t.length*(e/8),o=new ArrayBuffer(r),a=new DataView(o);if(8===e)for(var s=0;s<t.length;s++,i++){var u=(c=Math.max(-1,Math.min(1,t[s])))<0?128*c:127*c;u=+u+128,a.setInt8(i,u)}else for(s=0;s<t.length;s++,i+=2){var c=Math.max(-1,Math.min(1,t[s]));a.setInt16(i,c<0?32768*c:32767*c,n)}return a},t.encodeWAV=function(t,e,n,i,o,a){void 0===a&&(a=!0);var s=Math.min(e,n),u=o,c=new ArrayBuffer(44+t.byteLength),h=new DataView(c),l=i,f=0;r(h,f,"RIFF"),f+=4,h.setUint32(f,36+t.byteLength,a),r(h,f+=4,"WAVE"),r(h,f+=4,"fmt "),f+=4,h.setUint32(f,16,a),f+=4,h.setUint16(f,1,a),f+=2,h.setUint16(f,l,a),f+=2,h.setUint32(f,s,a),f+=4,h.setUint32(f,l*s*(u/8),a),f+=4,h.setUint16(f,l*(u/8),a),f+=2,h.setUint16(f,u,a),r(h,f+=2,"data"),f+=4,h.setUint32(f,t.byteLength,a),f+=4;for(var d=0;d<t.byteLength;)h.setUint8(f,t.getUint8(d)),f++,d++;return h},t.throwError=function(t){throw new Error(t)},t}();function r(t,e,n){for(var i=0;i<n.length;i++)t.setUint8(e+i,n.charCodeAt(i))}e.default=i}]).default});
//# sourceMappingURL=Recorder.js.map
