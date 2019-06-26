
import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import { DocumentPicker, DocumentPickerUtil } from 'react-native-document-picker';
import Slider from '@react-native-community/slider';
import Sound from 'react-native-sound';

type Props = {};

export default class App extends Component<Props> {

  constructor(props) {
    super(props);
    Sound.setCategory('Playback', true);
    this.state = {

      currentVolume: 0,
      side:-1,
      isPlaying: false,
      playButtonName:"PLAY",
      sideButtonName:'SIDE: LEFT',
      fileButtonName: 'SOUND: (default 500Hz)',
      soundplay: new Sound('./500Hz.wav', Sound.MAIN_BUNDLE, (error) => {
        if (error) {
            console.log('failed to load the sound', error);
        }
      })
    }
  }

  handleStartStopButton() {
    if(this.state.isPlaying){
      this.doStopSound();
    }
    else{
      this.doStartSound();
    }
  }

  doStartSound(){
    this.state.soundplay.setNumberOfLoops(-1);
      this.state.soundplay.setPan(this.state.side);
      this.state.soundplay.setVolume(this.state.currentVolume);
      this.setState({playButtonName: 'STOP', isPlaying: true});
      
      this.state.soundplay.play((success) => {
         if (success) {
         } else {
           console.log('START Failed');
           this.state.soundplay.reset();
         };
     });
  }

  doStopSound(){
    this.setState({playButtonName: 'PLAY', isPlaying: false});
       this.state.soundplay.pause((success) =>{
         if (success) {
         } else {
           console.log('Stop Failed');
         };
       });
  }

handleSideButton(){
  if(this.state.side === -1){
    this.setState({sideButtonName: 'SIDE: RIGHT', side: 1});
    this.state.soundplay.setPan(1);
  }
  else{
    this.setState({sideButtonName: 'SIDE: LEFT', side: -1});
    this.state.soundplay.setPan(-1);
  }
}

handleSelectButton() {
  console.log('start file selection');
  DocumentPicker.show({ filetype: [DocumentPickerUtil.audio()],},(error,res) => { 
    let x = res.uri.substring('file://'.length);
    this.setState({fileButtonName: 'SOUND: ' + res.fileName})

    if(this.state.isPlaying){
      this.doStopSound();
    }

    this.state.soundplay = new Sound(x, '', (error) => {
      if (error) {
          console.log('failed to load the sound', error);
      }
    });
  });
  console.log('end file selection');
}

  render() {
    return (
      <View style={styles.container}>
      <View style={styles.container}>

        <TouchableOpacity style={styles.large_button} onPress={() => this.handleSelectButton()}>
           <Text style={styles.large_button_text}>{this.state.fileButtonName}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.large_button} onPress={() => this.handleSideButton()}>
           <Text style={styles.large_button_text}>{this.state.sideButtonName}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.large_button} onPress={() => this.handleStartStopButton()}>
           <Text style={styles.large_button_text}>{this.state.playButtonName}</Text>
        </TouchableOpacity>

      
      </View>
       <Text style={styles.text}>
          {(this.state.currentVolume*100).toFixed(0)+'%'}
        </Text>   
      <Slider
    style={styles.slider}
    minimumValue={0}
    maximumValue={1}
    minimumTrackTintColor="#1aa3ff"
    maximumTrackTintColor="#1aa3ff"
    thumbTintColor="#1aa3ff"
    onValueChange={value => {
      this.setState({currentVolume: value})
      this.state.soundplay.setVolume(value);
    } }/>
      </View>
    );
  }
}

const styles = StyleSheet.create({

  slider:{
    width: "70%", 
    height: 40, 
    marginBottom: 50
  },


  container: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e6f5ff',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  large_button: {
    height: '25%',
    maxHeight: 50,
    width: '70%',
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 10,
    paddingRight: 10,
    justifyContent: 'center',
    borderRadius: 15,
    alignItems: 'center',
    marginVertical: 5,
    backgroundColor: '#1aa3ff'
  },
  large_button_text: {
    color:'#ffffff', 
    fontSize: 25, 
    fontWeight: '500'
  },
  text: {
    fontSize: 150,
    textAlign: 'center',
    fontWeight: '500',
    margin: 10,
    color: '#1aa3ff'
  }
});
