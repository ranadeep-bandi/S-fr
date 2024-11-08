import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, FlatList } from 'react-native';
import AudioPlayer from './AudioPlayer';
import { useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import CookieManager from '@react-native-cookies/cookies';
 
const { height } = Dimensions.get('window');
 
const Articles = ({ selectedCategoryIds }) => {
  const [articles, setArticles] = useState([]);
  const [currentArticleIndex, setCurrentArticleIndex] = useState(0);
  const [currentPlayCount, setCurrentPlayCount] = useState(0);
  const audioPlayerRef = useRef(null);
  const flatListRef = useRef(null);
 
  const getToken = async () => {
    const cookies = await CookieManager.get('https://suman-backend.onrender.com');
    return cookies?.jwtToken?.value;
  };
 
  useFocusEffect(
    React.useCallback(() => {
      const fetchArticles = async () => {
        try {
          const token = await getToken();
          const response = await axios.get("https://suman-backend.onrender.com/get-all-articles", {
            headers: {
              Authorization: `Token ${token}`,
              "Content-Type": "application/json",
            },
          });
          setArticles(response.data);
        } catch (error) {
          console.error("Error fetching articles:", error);
        }
      };
 
      fetchArticles();
 
      return () => {
        if (audioPlayerRef.current) {
          audioPlayerRef.current.stopAudio();
        }
      };
    }, [])
  );
 
  const filteredArticles = articles.filter(article =>
    selectedCategoryIds.includes(article.category_id)
  );
 
  const handleArticleChange = (newIndex) => {
    if (audioPlayerRef.current) {
      audioPlayerRef.current.stopAudio();
    }
    setCurrentArticleIndex(newIndex);
    setCurrentPlayCount(0);
  };
 
  // useEffect(() => {
  //   if (audioPlayerRef.current) {
  //     setTimeout(() => {
  //       audioPlayerRef.current.playPauseAudio(true);
  //     }, 500);
 
  //     if (flatListRef.current) {
  //       flatListRef.current.scrollToIndex({ index: currentArticleIndex, animated: true });
  //     }
  //   }
  // }, [currentArticleIndex]);
  useEffect(() => {
    if (audioPlayerRef.current) {
      setTimeout(() => {
        audioPlayerRef.current.playPauseAudio(true); // Pass true to indicate autoplay
      },500);
 
      if (flatListRef.current) {
        flatListRef.current.scrollToIndex({ index: currentArticleIndex, animated: true });
      }
    }
  }, [currentArticleIndex]);
 
 
  const handleAudioEnd = () => {
    const newPlayCount = currentPlayCount + 1;
    setCurrentPlayCount(newPlayCount);
 
    if (newPlayCount < 2) {
      if (audioPlayerRef.current) {
        setTimeout(() => {
          audioPlayerRef.current.playPauseAudio(true);
        }, 500);
      }
    } else {
      if (currentArticleIndex < filteredArticles.length - 1) {
        handleArticleChange(currentArticleIndex + 1);
      } else {
        handleArticleChange(0);
      }
    }
  };
 
  const onScrollEnd = (event) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    const newIndex = Math.round(offsetY / height);
    if (newIndex !== currentArticleIndex) {
      handleArticleChange(newIndex);
    }
  };
 
  return (
    <View style={styles.container}>
      {filteredArticles.length > 0 ? (
        <FlatList
          ref={flatListRef}
          data={filteredArticles}
          keyExtractor={(item) => item._id}
          renderItem={({ item, index }) => (
            <View style={styles.articleContainer}>
              <AudioPlayer
                ref={index === currentArticleIndex ? audioPlayerRef : null}
                data={item}
                onAudioEnd={handleAudioEnd}
              />
            </View>
          )}
          pagingEnabled
          snapToInterval={height}
          snapToAlignment="center"
          onMomentumScrollEnd={onScrollEnd}
        />
      ) : (
        <Text>No articles available for the selected categories</Text>
      )}
    </View>
  );
};
 
export default Articles;
 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'gray',
    padding: 0,
  },
  articleContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    elevation: 3,
    marginBottom: 0,
    padding: 0,
  },
});
 