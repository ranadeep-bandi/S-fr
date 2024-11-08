import React, { useState, useEffect, forwardRef, useImperativeHandle, useRef } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import Sound from 'react-native-sound';
import Slider from '@react-native-community/slider';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faPlay, faPause, faHeart, faShareAlt, faBookmark } from '@fortawesome/free-solid-svg-icons';
 
const { height } = Dimensions.get('window');
const adjustedHeight = height;
 
const AudioPlayer = forwardRef(({ data, onAudioEnd }, ref) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [likeCount, setLikeCount] = useState(0);
  const [shareCount, setShareCount] = useState(0);
  const soundRef = useRef(null);
  const timerRef = useRef(null);
 
  useEffect(() => {
    Sound.setCategory('Playback');
 
    // Create a new sound instance whenever data.audio_file changes
    const sound = new Sound(data.audio_file, null, (error) => {
      if (error) {
        console.log('Failed to load the sound', error);
        return;
      }
      setDuration(sound.getDuration());
      soundRef.current = sound; // Store the reference
    });
 
    return () => {
      if (soundRef.current) {
        soundRef.current.stop();
        soundRef.current.release();
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [data.audio_file]);
 
  useImperativeHandle(ref, () => ({
    playPauseAudio: async () => {
      if (soundRef.current) {
        if (isPlaying) {
          soundRef.current.pause();
          clearInterval(timerRef.current);
          setIsPlaying(false);
        } else {
          // Play the audio
          soundRef.current.play((success) => {
            if (success) {
              setIsPlaying(false);
              clearInterval(timerRef.current);
              onAudioEnd && onAudioEnd();
              // Reset audio state for replay
              setCurrentTime(0);
            }
          });
          setIsPlaying(true);
 
          timerRef.current = setInterval(() => {
            setCurrentTime((prevTime) => {
              if (prevTime < duration) {
                return prevTime + 1;
              } else {
                clearInterval(timerRef.current);
                setIsPlaying(false);
                onAudioEnd && onAudioEnd();
                return duration; // Ensure currentTime reflects the duration
              }
            });
          }, 1000); // Update every second
        }
      }
    },
    stopAudio: async () => {
      if (soundRef.current) {
        soundRef.current.stop();
        soundRef.current.setCurrentTime(0);
        setIsPlaying(false);
        setCurrentTime(0);
        clearInterval(timerRef.current);
      }
    },
  }));
 
  const handleSliderChange = (value) => {
    if (soundRef.current) {
      soundRef.current.setCurrentTime(value);
      setCurrentTime(value);
    }
  };
 
  const handleLike = () => {
    setLikeCount((prevCount) => prevCount + 1);
  };
 
  const handleShare = () => {
    setShareCount((prevCount) => prevCount + 1);
  };
 
  const handleSave = () => {
    console.log('Saved!');
  };
 
  return (
    <View style={[styles.container, { height: adjustedHeight }]}>
      <View style={styles.contentContainer}>
        <Image source={{ uri: data.thumbnail }} style={styles.thumbnail} />
        <Text style={styles.author}>{data.title}</Text>
 
        <View style={styles.sliderContainer}>
          <View style={styles.controls}>
            <TouchableOpacity onPress={() => ref.current.playPauseAudio()} style={styles.playPauseButton}>
              <FontAwesomeIcon icon={isPlaying ? faPause : faPlay} size={24} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.time}>
              {Math.floor(currentTime)} / {Math.floor(duration)} sec
            </Text>
          </View>
          <Slider
            style={styles.slider}
            value={currentTime}
            maximumValue={duration}
            onValueChange={handleSliderChange}
            minimumTrackTintColor="#e72967"
            maximumTrackTintColor="blue"
            thumbTintColor="#e72967"
          />
        </View>
 
        <View style={styles.imageActionContainer}>
          <Image source={{ uri: 'https://i.imghippo.com/files/QK3855E.jpg' }} style={styles.additionalImage} />
          <View style={styles.actionContainer}>
            <TouchableOpacity onPress={handleLike} style={styles.actionButton}>
              <FontAwesomeIcon icon={faHeart} size={24} color="#e72967" />
              <Text style={styles.countText}>{likeCount}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleShare} style={styles.actionButton}>
              <FontAwesomeIcon icon={faShareAlt} size={24} color="#e72967" />
              <Text style={styles.countText}>{shareCount}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleSave} style={styles.actionButton}>
              {/* <FontAwesomeIcon icon={faBookmark} size={24} color="#e72967" /> */}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
});
 
export default AudioPlayer;
 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    top: 50,
    backgroundColor: '#f7f7f7',
    marginTop: 10,
    borderRadius: 12,
    elevation: 3,
  },
  contentContainer: {
   
    margin:10
  },
  thumbnail: {
    width: 400,
    justifyContent:'center',
    alignContent:'center',
    alignSelf:'center',
    height: 500,
    borderRadius: 10,
 
  },
  author: {
    marginVertical: 10,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  sliderContainer: {
    marginVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  // sliderContainer: {
  //   marginVertical: 5,
    
  //   flexDirection: 'row',
  //   alignItems: 'center',
  //   justifyContent: 'space-between',
  //   padding: 10, // Add padding for spacing inside the border
  //   borderWidth: 2,
  //   borderColor: 'pink',
  //   borderRadius: 10, // Rounded corners
  //   backgroundColor: '#fff', // Background color to make the border stand out
  //   shadowColor: '#000', // Shadow for depth
  //   shadowOffset: { width: 0, height: 2 },
  //   shadowOpacity: 0.2,
  //   shadowRadius: 6,
  //   elevation: 5, // Shadow for Android
  // },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  playPauseButton: {
    padding: 10,
    backgroundColor: '#e72967',
    borderRadius: 50,
    marginRight: 10,
  },
  time: {
    color: '#333',
    fontSize: 14,
    marginRight: 10,
  },
  slider: {
    width: '70%',
  },
  actionContainer: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  actionButton: {
    marginBottom: 20,
    alignItems: 'center',
   
  },
  countText: {
    marginTop: 2,
    fontSize: 10,
    color: '#333',
  },
  imageActionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  additionalImage: {
    width: '80%',
    height: 100,
    borderRadius: 10,
    marginBottom:25
  },
});
 
 