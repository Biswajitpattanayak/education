// import React, { useEffect, useState } from 'react';
// import {
//   View,
//   Text,
//   Image,
//   TouchableOpacity,
//   StyleSheet,
//   Dimensions,
//   ActivityIndicator,
// } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import * as Animatable from 'react-native-animatable';
// import { LinearGradient } from 'expo-linear-gradient';
// import { router } from 'expo-router';
// import { fetchSloka } from '../../../constants/api/apiHome';

// const { width, height } = Dimensions.get('window');

// const STATIC_WORDS = [
//   {
//     word: 'Wisdom',
//     partOfSpeech: 'noun',
//     meaning: 'The quality of having experience, knowledge, and good judgment.',
//     sentence:
//       'Wisdom is not a product of schooling but of the lifelong attempt to acquire it.',
//   },
//   {
//     word: 'Curious',
//     partOfSpeech: 'adj',
//     meaning: 'Eager to know or learn something.',
//     sentence: 'The only true wisdom is in knowing you know nothing.',
//   },
//   {
//     word: 'Education',
//     partOfSpeech: 'noun',
//     meaning: 'The process of receiving or giving systematic instruction.',
//     sentence:
//       'Education is the most powerful weapon which you can use to change the world.',
//   },
//   {
//     word: 'Learning',
//     partOfSpeech: 'noun',
//     meaning: 'The acquisition of knowledge or skills through experience or study.',
//     sentence:
//       'The beautiful thing about learning is that nobody can take it away from you.',
//   },
//   {
//     word: 'Success',
//     partOfSpeech: 'noun',
//     meaning: 'The accomplishment of an aim or purpose.',
//     sentence:
//       'Success is the sum of small efforts repeated day in and day out.',
//   },
// ];

// export default function WordOfDay() {
//   const [sentenceData, setSentenceData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [dataSource, setDataSource] = useState('static');

//   useEffect(() => {
//     loadSlokaData();
//   }, []);

//   const getStaticWordForToday = () => {
//     const today = new Date();
//     const dayOfYear = Math.floor(
//       (today - new Date(today.getFullYear(), 0, 0)) / 86400000
//     );
//     return STATIC_WORDS[dayOfYear % STATIC_WORDS.length];
//   };

//   const loadSlokaData = async () => {
//     try {
//       setLoading(true);

//       const response = await fetchSloka();
//       console.log('📚 API Response:', JSON.stringify(response, null, 2));

//       if (response) {
//         if (response.status === true && response.data) {
//           const data = response.data;
//           if (data.line && data.line.trim() !== '') {
//             setSentenceData({
//               description: data.line,
//               sloka: data.line,
//               meaning: data.meaning || '',
//             });
//             setDataSource('dynamic');
//             setLoading(false);
//             return;
//           }
//         }

//         const staticWord = getStaticWordForToday();
//         setSentenceData(staticWord);
//         setDataSource('static');
//         setLoading(false);
//         return;
//       }

//       const staticWord = getStaticWordForToday();
//       setSentenceData(staticWord);
//       setDataSource('static');
//       setLoading(false);
//     } catch (error) {
//       console.error('❌ Error fetching sloka:', error);
//       const staticWord = getStaticWordForToday();
//       setSentenceData(staticWord);
//       setDataSource('static');
//       setLoading(false);
//     }
//   };

//   const handleContinue = async () => {
//     const today = new Date().toDateString();
//     await AsyncStorage.setItem('lastWordOfDayVisit', today);
//     router.push('/(drawer)/(studentIntro)/SpecialDay');
//   };

//   const renderDynamicContent = () => (
//     <>
//       <Animatable.View
//         animation="bounceIn"
//         delay={800}
//         style={styles.imageContainer}
//       >
//         <Image
//           source={require('../../../assets/images/Isolation_Mode.png')}
//           style={styles.image}
//         />
//       </Animatable.View>

//       <Animatable.View
//         animation="fadeInUp"
//         delay={1000}
//         style={styles.messageContainer}
//       >
//         {sentenceData.sloka ? (
//           <>
//             <Animatable.Text
//               animation="pulse"
//               easing="ease-out"
//               iterationCount="infinite"
//               style={styles.slokaText}
//             >
//               {sentenceData.sloka}
//             </Animatable.Text>

//             {sentenceData.meaning && (
//               <Text style={styles.meaningText}>
//                 Meaning: {sentenceData.meaning}
//               </Text>
//             )}
//           </>
//         ) : (
//           <Animatable.Text
//             animation="pulse"
//             easing="ease-out"
//             iterationCount="infinite"
//             style={styles.message}
//           >
//             {sentenceData.description}
//           </Animatable.Text>
//         )}
//       </Animatable.View>
//     </>
//   );

//   const renderStaticContent = () => (
//     <>
//       <Animatable.View
//         animation="bounceIn"
//         delay={800}
//         style={styles.imageContainer}
//       >
//         <Image
//           source={require('../../../assets/images/Isolation_Mode.png')}
//           style={styles.image}
//         />
//       </Animatable.View>

//       <Animatable.View
//         animation="fadeInUp"
//         delay={1000}
//         style={styles.glassCard}
//       >
//         {/* WORD + POS */}
//         <View style={styles.wordRow}>
//           <Text style={styles.wordText}>{sentenceData.word}</Text>
//           {sentenceData.partOfSpeech ? (
//             <Text style={styles.posText}>({sentenceData.partOfSpeech})</Text>
//           ) : null}
//         </View>

//         <View style={styles.divider} />

//         {sentenceData.meaning ? (
//           <View style={styles.section}>
//             <Text style={styles.sectionLabel}>MEANING</Text>
//             <Text style={styles.sectionText}>{sentenceData.meaning}</Text>
//           </View>
//         ) : null}

//         {sentenceData.sentence ? (
//           <View style={styles.section}>
//             <Text style={styles.sectionLabel}>SENTENCE</Text>
//             <Text style={styles.sectionText}>{sentenceData.sentence}</Text>
//           </View>
//         ) : null}
//       </Animatable.View>
//     </>
//   );

//   const renderContent = () => {
//     if (!sentenceData) {
//       return (
//         <View style={styles.centerBox}>
//           <Text style={styles.errorText}>No data available</Text>
//           <TouchableOpacity style={styles.retryButton} onPress={loadSlokaData}>
//             <Text style={styles.retryText}>Retry</Text>
//           </TouchableOpacity>
//         </View>
//       );
//     }

//     return dataSource === 'dynamic'
//       ? renderDynamicContent()
//       : renderStaticContent();
//   };

//   return (
//     <LinearGradient colors={['#89f7fe', '#66a6ff']} style={styles.container}>
//       {/* HEADING — Extra Bold */}
//       <Animatable.View
//         animation="fadeInDown"
//         delay={200}
//         style={styles.headingContainer}
//       >
//         <Text style={styles.headingText}>Word of the Day</Text>
//       </Animatable.View>

//       {loading ? (
//         <View style={styles.centerBox}>
//           <ActivityIndicator size="large" color="#003096" />
//           <Text style={styles.loadingText}>Loading today's wisdom...</Text>
//         </View>
//       ) : (
//         renderContent()
//       )}

//       <Animatable.View
//         animation="fadeInUp"
//         delay={1200}
//         style={styles.buttonContainer}
//       >
//         <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
//           <Text style={styles.continueText}>CONTINUE</Text>
//         </TouchableOpacity>
//       </Animatable.View>
//     </LinearGradient>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     paddingHorizontal: width * 0.05,
//     paddingTop: height * 0.04,   // 👈 thoda upar
//   },

//   // 🔹 HEADING — BOLD
//   headingContainer: {
//     alignItems: 'center',
//     marginBottom: height * 0.01,  // 👈 kam spacing
//   },
//   headingText: {
//     fontSize: width * 0.068,       // 👈 thoda bada
//     fontWeight: '900',              // 👈 extra bold
//     color: '#003096',
//     letterSpacing: 0.5,
//     textShadowColor: 'rgba(0, 48, 150, 0.15)',
//     textShadowOffset: { width: 0, height: 2 },
//     textShadowRadius: 4,
//   },

//   // 🖼️ IMAGE — upar liya
//   imageContainer: {
//     marginTop: height * 0.03,      // 👈 pehle 0.03 tha, ab 0.005
//     alignItems: 'center',
//   },
//   image: {
//     width: width * 0.6,             // 👈 thoda chhota
//     height: height * 0.2,           // 👈 thoda chhota
//     resizeMode: 'contain',
//     borderRadius: 10,
//   },

//   // 🔹 DYNAMIC
//   messageContainer: {
//     marginTop: height * 0.03,
//     paddingHorizontal: width * 0.05,
//     alignItems: 'center',
//   },
//   message: {
//     fontSize: width * 0.04,
//     textAlign: 'center',
//     color: '#555',
//     fontStyle: 'italic',
//     lineHeight: height * 0.03,
//   },
//   slokaText: {
//     fontSize: width * 0.05,
//     textAlign: 'center',
//     color: '#003096',
//     fontWeight: 'bold',
//     lineHeight: height * 0.035,
//     marginBottom: height * 0.02,
//   },
//   meaningText: {
//     fontSize: width * 0.04,
//     textAlign: 'center',
//     color: '#555',
//     lineHeight: height * 0.03,
//     marginTop: height * 0.01,
//   },

//   // 🔹 STATIC — Glass card (upar liya)
//   glassCard: {
//     marginTop: height * 0.05,      // 👈 pehle 0.03 tha
//     backgroundColor: 'rgba(255, 255, 255, 0.25)',
//     borderRadius: 20,
//     paddingHorizontal: width * 0.06,
//     paddingVertical: height * 0.028,
//     borderWidth: 1.5,
//     borderColor: 'rgba(255, 255, 255, 0.6)',
//     shadowColor: '#003096',
//     shadowOffset: { width: 0, height: 6 },
//     shadowOpacity: 0.15,
//     shadowRadius: 14,
//     elevation: 6,
//   },

//   wordRow: {
//     flexDirection: 'row',
//     alignItems: 'flex-end',
//     flexWrap: 'wrap',
//     justifyContent: 'center',
//   },
//   wordText: {
//     fontSize: width * 0.085,
//     fontWeight: '900',              // 👈 extra bold
//     color: '#003096',
//     marginRight: 8,
//   },
//   posText: {
//     fontSize: width * 0.04,          // 👈 thoda bada
//     color: '#1E3A8A',                // 👈 dark blue (pehle light grey tha)
//     fontStyle: 'italic',
//     fontWeight: '700',               // 👈 bold
//     marginBottom: 5,
//   },

//   divider: {
//     height: 1.2,
//     backgroundColor: 'rgba(0, 48, 150, 0.25)',
//     marginVertical: height * 0.015,
//     borderRadius: 2,
//   },

//   section: {
//     marginTop: height * 0.01,
//   },
//   sectionLabel: {
//     fontSize: width * 0.032,
//     fontWeight: '800',
//     color: '#003096',
//     marginBottom: height * 0.006,
//     letterSpacing: 1.5,
//   },
//   sectionText: {
//     fontSize: width * 0.04,
//     color: '#1F2937',
//     lineHeight: height * 0.027,
//   },

//   // 🔘 BUTTON
//   buttonContainer: {
//     marginTop: height * 0.15,
//     alignItems: 'center',
//   },
//   continueButton: {
//     backgroundColor: '#003096',
//     paddingVertical: height * 0.018,
//     paddingHorizontal: width * 0.18,
//     borderRadius: 10,
//     shadowColor: '#003096',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.3,
//     shadowRadius: 8,
//     elevation: 4,
//   },
//   continueText: {
//     color: '#fff',
//     fontSize: width * 0.045,
//     fontWeight: 'bold',
//     textAlign: 'center',
//     letterSpacing: 1,
//   },

//   centerBox: {
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//     minHeight: height * 0.35,
//   },
//   loadingText: {
//     marginTop: height * 0.02,
//     fontSize: width * 0.04,
//     color: '#003096',
//   },
//   errorText: {
//     fontSize: width * 0.04,
//     color: '#ff0000',
//     textAlign: 'center',
//     marginBottom: height * 0.02,
//   },
//   retryButton: {
//     backgroundColor: '#003096',
//     paddingVertical: height * 0.015,
//     paddingHorizontal: width * 0.1,
//     borderRadius: 8,
//   },
//   retryText: {
//     color: '#fff',
//     fontSize: width * 0.04,
//     fontWeight: 'bold',
//   },
// });

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  Alert,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Animatable from "react-native-animatable";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { Feather } from "@expo/vector-icons";
// 👇 Naye APIs import kiye
import {
  fetchSentence,
  postWordReaction,
  postWordComment,
} from "../../../constants/api/apiHome";

const { width, height } = Dimensions.get("window");

const STATIC_WORDS = [
  {
    word: "Wisdom",
    partOfSpeech: "noun",
    meaning: "The quality of having experience, knowledge, and good judgment.",
    sentence:
      "Wisdom is not a product of schooling but of the lifelong attempt to acquire it.",
  },
  {
    word: "Curious",
    partOfSpeech: "adj",
    meaning: "Eager to know or learn something.",
    sentence: "The only true wisdom is in knowing you know nothing.",
  },
  {
    word: "Education",
    partOfSpeech: "noun",
    meaning: "The process of receiving or giving systematic instruction.",
    sentence:
      "Education is the most powerful weapon which you can use to change the world.",
  },
  {
    word: "Learning",
    partOfSpeech: "noun",
    meaning:
      "The acquisition of knowledge or skills through experience or study.",
    sentence:
      "The beautiful thing about learning is that nobody can take it away from you.",
  },
  {
    word: "Success",
    partOfSpeech: "noun",
    meaning: "The accomplishment of an aim or purpose.",
    sentence:
      "Success is the sum of small efforts repeated day in and day out.",
  },
];

export default function WordOfDay() {
  const [sentenceData, setSentenceData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Reactions states
  const [reaction, setReaction] = useState(null);
  const [likeCount, setLikeCount] = useState(0);
  const [dislikeCount, setDislikeCount] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Comment states
  const [comment, setComment] = useState("");
  const [isPostingComment, setIsPostingComment] = useState(false);

  useEffect(() => {
    loadSlokaData();
  }, []);

  const getStaticWordForToday = () => {
    const today = new Date();
    const dayOfYear = Math.floor(
      (today - new Date(today.getFullYear(), 0, 0)) / 86400000,
    );
    return STATIC_WORDS[dayOfYear % STATIC_WORDS.length];
  };

  const loadSlokaData = async () => {
    try {
      setLoading(true);

      const data = await fetchSentence();
      console.log("📚 API Response:", data);

      if (data && data.title) {
        setSentenceData({
          id: data.id,
          word: data.title,
          partOfSpeech: data.part_of_speech,
          meaning: data.description,
          sentence: data.sentence,
          image: data.image,
        });

        setLikeCount(data.like_count || 0);
        setDislikeCount(data.dislike_count || 0);
        setReaction(data.user_reaction || null);
      } else {
        const staticWord = getStaticWordForToday();
        setSentenceData(staticWord);
      }
    } catch (error) {
      console.error("❌ Error fetching sentence:", error);
      const staticWord = getStaticWordForToday();
      setSentenceData(staticWord);
    } finally {
      setLoading(false);
    }
  };

  const handleContinue = async () => {
    const today = new Date().toDateString();
    await AsyncStorage.setItem("lastWordOfDayVisit", today);
    router.push("/(drawer)/(studentIntro)/SpecialDay");
  };

  // 👇 Dynamic Reaction Logic
  const handleReaction = async (type) => {
    if (type === "comment") {
      setReaction(reaction === "comment" ? null : "comment");
      return;
    }

    if (!sentenceData?.id || isSubmitting) return;

    const prevReaction = reaction;
    setReaction(type === prevReaction ? null : type);
    setIsSubmitting(true);

    try {
      const res = await postWordReaction(sentenceData.id, type);
      if (res?.data) {
        setLikeCount(res.data.like_count || 0);
        setDislikeCount(res.data.dislike_count || 0);
        setReaction(res.data.user_reaction);
      }
    } catch (error) {
      setReaction(prevReaction); // state wapas
      // 👇 Error user ko dikhao (e.g. "User not found" ya "Please login")
      const errorMsg =
        error.response?.data?.detail ||
        error.message ||
        "Reaction save nahi hua.";
      Alert.alert("Error", errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 👇 Dynamic Comment Submit Logic
  const handleSendComment = async () => {
    const trimmed = comment.trim();
    if (!trimmed || !sentenceData?.id) return;

    setIsPostingComment(true);
    try {
      await postWordComment(sentenceData.id, trimmed);
      setComment("");
      Alert.alert("Success", "Your comment has been added!");
      // (Agar aapko comments list dikhani ho, to yahan API call karke list update kar sakte hain)
    } catch (error) {
      const errorMsg =
        error.response?.data?.detail ||
        error.message ||
        "Comment post nahi hua.";
      Alert.alert("Error", errorMsg);
    } finally {
      setIsPostingComment(false);
    }
  };

  const renderContent = () => {
    if (!sentenceData) {
      return (
        <View style={styles.centerBox}>
          <Text style={styles.errorText}>No data available</Text>
          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.retryButton}
            onPress={loadSlokaData}
          >
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <>
        <Animatable.View
          animation="bounceIn"
          delay={300}
          style={styles.imageContainer}
        >
          <Image
            source={
              sentenceData.image
                ? { uri: sentenceData.image }
                : require("../../../assets/images/Isolation_Mode.png")
            }
            style={styles.image}
            resizeMode="contain"
          />
        </Animatable.View>

        <Animatable.View
          animation="fadeInUp"
          delay={500}
          style={styles.glassCard}
        >
          <View style={styles.wordRow}>
            <Text style={styles.wordText}>{sentenceData.word}</Text>
            {sentenceData.partOfSpeech ? (
              <Text style={styles.posText}>({sentenceData.partOfSpeech})</Text>
            ) : null}
          </View>

          <View style={styles.divider} />

          {sentenceData.meaning ? (
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>MEANING</Text>
              <Text style={styles.sectionText}>{sentenceData.meaning}</Text>
            </View>
          ) : null}

          {sentenceData.sentence ? (
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>SENTENCE</Text>
              <Text style={styles.sectionText}>{sentenceData.sentence}</Text>
            </View>
          ) : null}
        </Animatable.View>
      </>
    );
  };

  return (
    <LinearGradient colors={["#89f7fe", "#66a6ff"]} style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* HEADING */}
          <Animatable.View
            animation="fadeInDown"
            delay={200}
            style={styles.headingContainer}
          >
            <Text style={styles.headingText}>Word of the Day</Text>
            <View style={styles.headingUnderline} />
          </Animatable.View>

          {loading ? (
            <View style={styles.centerBox}>
              <ActivityIndicator size="large" color="#003096" />
              <Text style={styles.loadingText}>Loading today's wisdom...</Text>
            </View>
          ) : (
            renderContent()
          )}

          {/* COMMENT INPUT */}
          {!loading && sentenceData && reaction === "comment" ? (
            <Animatable.View
              animation="fadeInUp"
              duration={300}
              style={styles.commentSection}
            >
              <View style={styles.inputRow}>
                <TextInput
                  style={styles.input}
                  placeholder="Write your thoughts..."
                  placeholderTextColor="#64748B"
                  value={comment}
                  onChangeText={setComment}
                  multiline
                  maxLength={500}
                  editable={!isPostingComment}
                />
                <TouchableOpacity
                  activeOpacity={0.7}
                  style={[
                    styles.sendBtn,
                    (!comment.trim() || isPostingComment) &&
                      styles.sendBtnDisabled,
                  ]}
                  onPress={handleSendComment}
                  disabled={!comment.trim() || isPostingComment}
                >
                  {isPostingComment ? (
                    <ActivityIndicator size="small" color="#FFF" />
                  ) : (
                    <Feather name="send" size={17} color="#FFFFFF" />
                  )}
                </TouchableOpacity>
              </View>
            </Animatable.View>
          ) : null}

          {/* LIKE, DISLIKE & COMMENT */}
          {!loading && sentenceData ? (
            <Animatable.View
              animation="fadeInUp"
              delay={700}
              style={styles.reactionContainer}
            >
              {/* LIKE BUTTON */}
              <TouchableOpacity
                activeOpacity={0.6}
                style={[
                  styles.reactionButton,
                  reaction === "like" && styles.selectedReaction,
                ]}
                onPress={() => handleReaction("like")}
                disabled={isSubmitting}
              >
                <Text style={styles.reactionText}>
                  👍 Like {likeCount > 0 ? `(${likeCount})` : ""}
                </Text>
              </TouchableOpacity>

              {/* DISLIKE BUTTON */}
              <TouchableOpacity
                activeOpacity={0.6}
                style={[
                  styles.reactionButton,
                  reaction === "dislike" && styles.selectedReaction,
                ]}
                onPress={() => handleReaction("dislike")}
                disabled={isSubmitting}
              >
                <Text style={styles.reactionText}>
                  👎 Dislike {dislikeCount > 0 ? `(${dislikeCount})` : ""}
                </Text>
              </TouchableOpacity>

              {/* COMMENT BUTTON */}
              <TouchableOpacity
                activeOpacity={0.6}
                style={[
                  styles.reactionButton,
                  reaction === "comment" && styles.selectedReaction,
                ]}
                onPress={() => handleReaction("comment")}
              >
                <Text style={styles.reactionText}>💬 Comment</Text>
              </TouchableOpacity>
            </Animatable.View>
          ) : null}

          {/* CONTINUE BUTTON */}
          <Animatable.View
            animation="fadeInUp"
            delay={800}
            style={styles.buttonContainer}
          >
            <TouchableOpacity
              activeOpacity={0.75}
              style={styles.continueButton}
              onPress={handleContinue}
            >
              <Text style={styles.continueText}>CONTINUE</Text>
            </TouchableOpacity>
          </Animatable.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

// Styles waisa hi hai
const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollView: { flex: 1 },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: width * 0.05,
    paddingTop: Math.max(height * 0.065, 24),
    paddingBottom: 20,
  },
  headingContainer: { alignItems: "center", marginBottom: height * 0.005 },
  headingText: {
    fontSize: Math.min(width * 0.068, 28),
    fontWeight: "900",
    color: "#003096",
    letterSpacing: 0.5,
    textAlign: "center",
    textShadowColor: "rgba(0, 48, 150, 0.15)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  headingUnderline: {
    width: 55,
    height: 4,
    backgroundColor: "#003096",
    borderRadius: 5,
    marginTop: 7,
    opacity: 0.75,
  },
  imageContainer: { marginTop: height * 0.015, alignItems: "center" },
  image: {
    width: Math.min(width * 0.6, 250),
    height: Math.min(height * 0.18, 155),
    borderRadius: 10,
  },
  glassCard: {
    marginTop: height * 0.025,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 20,
    paddingHorizontal: width * 0.06,
    paddingVertical: Math.min(height * 0.025, 20),
    borderWidth: 1.5,
    borderColor: "rgba(255, 255, 255, 0.65)",
    shadowColor: "#003096",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 4,
  },
  wordRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  wordText: {
    fontSize: Math.min(width * 0.085, 34),
    fontWeight: "900",
    color: "#003096",
    marginRight: 8,
    textAlign: "center",
  },
  posText: {
    fontSize: Math.min(width * 0.04, 17),
    color: "#1E3A8A",
    fontStyle: "italic",
    fontWeight: "700",
    marginBottom: 5,
  },
  divider: {
    height: 1.2,
    backgroundColor: "rgba(0, 48, 150, 0.25)",
    marginVertical: height * 0.015,
    borderRadius: 2,
  },
  section: { marginTop: height * 0.01 },
  sectionLabel: {
    fontSize: Math.min(width * 0.032, 13),
    fontWeight: "800",
    color: "#003096",
    marginBottom: height * 0.006,
    letterSpacing: 1.5,
  },
  sectionText: {
    fontSize: Math.min(width * 0.04, 17),
    color: "#1F2937",
    lineHeight: Math.max(height * 0.027, 20),
  },
  commentSection: { width: "100%", marginTop: height * 0.02 },
  inputRow: { flexDirection: "row", alignItems: "center", gap: 9 },
  input: {
    flex: 1,
    minHeight: 44,
    maxHeight: 100,
    backgroundColor: "rgba(255,255,255,0.7)",
    borderRadius: 13,
    paddingHorizontal: 13,
    paddingVertical: 10,
    fontSize: Math.min(width * 0.034, 14),
    color: "#003096",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.95)",
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "#003096",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#003096",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 3,
  },
  sendBtnDisabled: { opacity: 0.5 },
  reactionContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    flexWrap: "wrap",
    marginTop: height * 0.08,
    marginBottom: 4,
    gap: 8,
  },
  reactionButton: {
    backgroundColor: "rgba(255, 255, 255, 0.55)",
    paddingVertical: 10,
    paddingHorizontal: Math.min(width * 0.035, 14),
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "rgba(0, 48, 150, 0.18)",
  },
  selectedReaction: {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderColor: "#003096",
    borderWidth: 1.5,
  },
  reactionText: {
    fontSize: Math.min(width * 0.033, 14),
    color: "#003096",
    fontWeight: "700",
  },
  buttonContainer: {
    marginTop: 8,
    paddingTop: 0,
    paddingBottom: 8,
    alignItems: "center",
  },
  continueButton: {
    width: Math.min(width * 0.72, 300),
    backgroundColor: "#003096",
    paddingVertical: 13,
    paddingHorizontal: 24,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.65)",
    shadowColor: "#003096",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 7,
    elevation: 4,
  },
  continueText: {
    color: "#fff",
    fontSize: Math.min(width * 0.045, 18),
    fontWeight: "bold",
    textAlign: "center",
    letterSpacing: 1,
  },
  centerBox: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    minHeight: height * 0.25,
  },
  loadingText: {
    marginTop: height * 0.02,
    fontSize: Math.min(width * 0.04, 17),
    color: "#003096",
  },
  errorText: {
    fontSize: Math.min(width * 0.04, 17),
    color: "#ff0000",
    textAlign: "center",
    marginBottom: height * 0.02,
  },
  retryButton: {
    backgroundColor: "#003096",
    paddingVertical: height * 0.015,
    paddingHorizontal: width * 0.1,
    borderRadius: 8,
  },
  retryText: {
    color: "#fff",
    fontSize: Math.min(width * 0.04, 17),
    fontWeight: "bold",
  },
});



// new  -------------------------------------------------------------------------------------------------------------------------

// import React, { useEffect, useState } from "react";
// import {
//   View,
//   Text,
//   Image,
//   TouchableOpacity,
//   StyleSheet,
//   Dimensions,
//   ActivityIndicator,
//   Alert,
//   ScrollView,
//   TextInput,
//   KeyboardAvoidingView,
//   Platform,
// } from "react-native";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import * as Animatable from "react-native-animatable";
// import { LinearGradient } from "expo-linear-gradient";
// import { router } from "expo-router";
// import { Feather } from "@expo/vector-icons";
// import * as Speech from "expo-speech";
// // 👇 Naye APIs import kiye
// import {
//   fetchSentence,
//   postWordReaction,
//   postWordComment,
// } from "../../../constants/api/apiHome";


// const { width, height } = Dimensions.get("window");


// const STATIC_WORDS = [
//   {
//     word: "Wisdom",
//     partOfSpeech: "noun",
//     meaning: "The quality of having experience, knowledge, and good judgment.",
//     sentence:
//       "Wisdom is not a product of schooling but of the lifelong attempt to acquire it.",
//   },
//   {
//     word: "Curious",
//     partOfSpeech: "adj",
//     meaning: "Eager to know or learn something.",
//     sentence: "The only true wisdom is in knowing you know nothing.",
//   },
//   {
//     word: "Education",
//     partOfSpeech: "noun",
//     meaning: "The process of receiving or giving systematic instruction.",
//     sentence:
//       "Education is the most powerful weapon which you can use to change the world.",
//   },
//   {
//     word: "Learning",
//     partOfSpeech: "noun",
//     meaning:
//       "The acquisition of knowledge or skills through experience or study.",
//     sentence:
//       "The beautiful thing about learning is that nobody can take it away from you.",
//   },
//   {
//     word: "Success",
//     partOfSpeech: "noun",
//     meaning: "The accomplishment of an aim or purpose.",
//     sentence:
//       "Success is the sum of small efforts repeated day in and day out.",
//   },
// ];


// export default function WordOfDay() {
//   const [sentenceData, setSentenceData] = useState(null);
//   const [loading, setLoading] = useState(true);


// // Reactions states
//   const [reaction, setReaction] = useState(null);
//   const [likeCount, setLikeCount] = useState(0);
//   const [dislikeCount, setDislikeCount] = useState(0);
//   const [isSubmitting, setIsSubmitting] = useState(false);


// // Comment states
//   const [comment, setComment] = useState("");
//   const [isPostingComment, setIsPostingComment] = useState(false);


//   useEffect(() => {
//     loadSlokaData();
//   }, []);


//   const getStaticWordForToday = () => {
//     const today = new Date();
//     const dayOfYear = Math.floor(
//       (today - new Date(today.getFullYear(), 0, 0)) / 86400000,
//     );
// return STATIC_WORDS[dayOfYear % STATIC_WORDS.length];
//   };


//   const loadSlokaData = async () => {
// try {
//       setLoading(true);


//       const data = await fetchSentence();
//       console.log("📚 API Response:", data);


// if (data && data.title) {
//         setSentenceData({
//           id: data.id,
//           word: data.title,
//           partOfSpeech: data.part_of_speech,
//           meaning: data.description,
//           sentence: data.sentence,
//           image: data.image,
//         });


//         setLikeCount(data.like_count || 0);
//         setDislikeCount(data.dislike_count || 0);
//         setReaction(data.user_reaction || null);
//       } else {
//         const staticWord = getStaticWordForToday();
//         setSentenceData(staticWord);
//       }
//     } catch (error) {
//       console.error("❌ Error fetching sentence:", error);
//       const staticWord = getStaticWordForToday();
//       setSentenceData(staticWord);
//     } finally {
//       setLoading(false);
//     }
//   };


//   // Word pronunciation
//   const handlePronunciation = async () => {
//     if (!sentenceData?.word) return;
//     await Speech.stop();
//     Speech.speak(sentenceData.word, {
//       language: "en-GB",
//       pitch: 1.0,
//       rate: 0.85,
//       volume: 1.0,
//     });
//   };
//   const handleContinue = async () => {
//     const today = new Date().toDateString();
// await AsyncStorage.setItem("lastWordOfDayVisit", today);
//     router.push("/(drawer)/(studentIntro)/SpecialDay");
//   };


// // 👇 Dynamic Reaction Logic
//   const handleReaction = async (type) => {
// if (type === "comment") {
//       setReaction(reaction === "comment" ? null : "comment");
// return;
//     }


// if (!sentenceData?.id || isSubmitting) return;


//     const prevReaction = reaction;
//     setReaction(type === prevReaction ? null : type);
//     setIsSubmitting(true);


// try {
//       const res = await postWordReaction(sentenceData.id, type);
// if (res?.data) {
//         setLikeCount(res.data.like_count || 0);
//         setDislikeCount(res.data.dislike_count || 0);
//         setReaction(res.data.user_reaction);
//       }
//     } catch (error) {
//       setReaction(prevReaction); // state wapas
// // 👇 Error user ko dikhao (e.g. "User not found" ya "Please login")
//       const errorMsg =
//         error.response?.data?.detail ||
//         error.message ||
//         "Reaction save nahi hua.";
//       Alert.alert("Error", errorMsg);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };


// // 👇 Dynamic Comment Submit Logic
//   const handleSendComment = async () => {
//     const trimmed = comment.trim();
// if (!trimmed || !sentenceData?.id) return;


//     setIsPostingComment(true);
// try {
// await postWordComment(sentenceData.id, trimmed);
//       setComment("");
//       Alert.alert("Success", "Your comment has been added!");
// // (Agar aapko comments list dikhani ho, to yahan API call karke list update kar sakte hain)
//     } catch (error) {
//       const errorMsg =
//         error.response?.data?.detail ||
//         error.message ||
//         "Comment post nahi hua.";
//       Alert.alert("Error", errorMsg);
//     } finally {
//       setIsPostingComment(false);
//     }
//   };


//   const renderContent = () => {
// if (!sentenceData) {
// return (
//         <View style={styles.centerBox}>
//           <Text style={styles.errorText}>No data available</Text>
//           <TouchableOpacity
// activeOpacity={0.7}
// style={styles.retryButton}
// onPress={loadSlokaData}
//           >
//             <Text style={styles.retryText}>Retry</Text>
//           </TouchableOpacity>
//         </View>
//       );
//     }


// return (
//       <>
//         <Animatable.View
// animation="bounceIn"
// delay={300}
// style={styles.imageContainer}
//         >
//           <Image
// source={
//               sentenceData.image
// ? { uri: sentenceData.image }
// : require("../../../assets/images/Isolation_Mode.png")
//             }
// style={styles.image}
// resizeMode="contain"
//           />
//         </Animatable.View>


//         <Animatable.View
// animation="fadeInUp"
// delay={500}
// style={styles.glassCard}
//         >
//           <View style={styles.wordRow}>
//             <Text style={styles.wordText}>{sentenceData.word}</Text>
//             {sentenceData.partOfSpeech ? (
//               <Text style={styles.posText}>({sentenceData.partOfSpeech})</Text>
//             ) : null}
//             <TouchableOpacity
//               style={styles.voiceButton}
//               activeOpacity={0.7}
//               onPress={handlePronunciation}
//               accessibilityLabel="Listen to pronunciation"
//               accessibilityRole="button"
//             >
//               <Feather name="volume-2" size={20} color="#003096" />
//             </TouchableOpacity>
//           </View>


//           <View style={styles.divider} />


//           {sentenceData.meaning ? (
//             <View style={styles.section}>
//               <Text style={styles.sectionLabel}>MEANING</Text>
//               <Text style={styles.sectionText}>{sentenceData.meaning}</Text>
//             </View>
//           ) : null}


//           {sentenceData.sentence ? (
//             <View style={styles.section}>
//               <Text style={styles.sectionLabel}>SENTENCE</Text>
//               <Text style={styles.sectionText}>{sentenceData.sentence}</Text>
//             </View>
//           ) : null}
//         </Animatable.View>
//       </>
//     );
//   };


// return (
//     <LinearGradient colors={["#89f7fe", "#66a6ff"]} style={styles.container}>
//       <KeyboardAvoidingView
// style={{ flex: 1 }}
// behavior={Platform.OS === "ios" ? "padding" : undefined}
//       >
//         <ScrollView
// style={styles.scrollView}
// contentContainerStyle={styles.scrollContent}
// showsVerticalScrollIndicator={false}
// keyboardShouldPersistTaps="handled"
//         >
//           {/* HEADING */}
//           <Animatable.View
// animation="fadeInDown"
// delay={200}
// style={styles.headingContainer}
//           >
//             <Text style={styles.headingText}>Word of the Day</Text>
//             <View style={styles.headingUnderline} />
//           </Animatable.View>


//           {loading ? (
//             <View style={styles.centerBox}>
//               <ActivityIndicator size="large" color="#003096" />
//               <Text style={styles.loadingText}>Loading today's wisdom...</Text>
//             </View>
//           ) : (
//             renderContent()
//           )}


//           {/* COMMENT INPUT */}
//           {!loading && sentenceData && reaction === "comment" ? (
//             <Animatable.View
// animation="fadeInUp"
// duration={300}
// style={styles.commentSection}
//             >
//               <View style={styles.inputRow}>
//                 <TextInput
// style={styles.input}
// placeholder="Write your thoughts..."
// placeholderTextColor="#64748B"
// value={comment}
// onChangeText={setComment}
// multiline
// maxLength={500}
// editable={!isPostingComment}
//                 />
//                 <TouchableOpacity
// activeOpacity={0.7}
// style={[
//                     styles.sendBtn,
//                     (!comment.trim() || isPostingComment) &&
//                       styles.sendBtnDisabled,
//                   ]}
// onPress={handleSendComment}
// disabled={!comment.trim() || isPostingComment}
//                 >
//                   {isPostingComment ? (
//                     <ActivityIndicator size="small" color="#FFF" />
//                   ) : (
//                     <Feather name="send" size={17} color="#FFFFFF" />
//                   )}
//                 </TouchableOpacity>
//               </View>
//             </Animatable.View>
//           ) : null}


//           {/* LIKE, DISLIKE & COMMENT */}
//           {!loading && sentenceData ? (
//             <Animatable.View
// animation="fadeInUp"
// delay={700}
// style={styles.reactionContainer}
//             >
//               {/* LIKE BUTTON */}
//               <TouchableOpacity
// activeOpacity={0.6}
// style={[
//                   styles.reactionButton,
//                   reaction === "like" && styles.selectedReaction,
//                 ]}
// onPress={() => handleReaction("like")}
// disabled={isSubmitting}
//               >
//                 <Text style={styles.reactionText}>
//                   👍 Like {likeCount > 0 ? `(${likeCount})` : ""}
//                 </Text>
//               </TouchableOpacity>


//               {/* DISLIKE BUTTON */}
//               <TouchableOpacity
// activeOpacity={0.6}
// style={[
//                   styles.reactionButton,
//                   reaction === "dislike" && styles.selectedReaction,
//                 ]}
// onPress={() => handleReaction("dislike")}
// disabled={isSubmitting}
//               >
//                 <Text style={styles.reactionText}>
//                   👎 Dislike {dislikeCount > 0 ? `(${dislikeCount})` : ""}
//                 </Text>
//               </TouchableOpacity>


//               {/* COMMENT BUTTON */}
//               <TouchableOpacity
// activeOpacity={0.6}
// style={[
//                   styles.reactionButton,
//                   reaction === "comment" && styles.selectedReaction,
//                 ]}
// onPress={() => handleReaction("comment")}
//               >
//                 <Text style={styles.reactionText}>💬 Comment</Text>
//               </TouchableOpacity>
//             </Animatable.View>
//           ) : null}


//           {/* CONTINUE BUTTON */}
//           <Animatable.View
// animation="fadeInUp"
// delay={800}
// style={styles.buttonContainer}
//           >
//             <TouchableOpacity
// activeOpacity={0.75}
// style={styles.continueButton}
// onPress={handleContinue}
//             >
//               <Text style={styles.continueText}>CONTINUE</Text>
//             </TouchableOpacity>
//           </Animatable.View>
//         </ScrollView>
//       </KeyboardAvoidingView>
//     </LinearGradient>
//   );
// }


// // Styles waisa hi hai
// const styles = StyleSheet.create({
//   container: { flex: 1 },
//   scrollView: { flex: 1 },
//   scrollContent: {
//     flexGrow: 1,
//     paddingHorizontal: width * 0.05,
//     paddingTop: Math.max(height * 0.065, 24),
//     paddingBottom: 20,
//   },
//   headingContainer: { alignItems: "center", marginBottom: height * 0.005 },
//   headingText: {
//     fontSize: Math.min(width * 0.068, 28),
//     fontWeight: "900",
//     color: "#003096",
//     letterSpacing: 0.5,
//     textAlign: "center",
//     textShadowColor: "rgba(0, 48, 150, 0.15)",
//     textShadowOffset: { width: 0, height: 2 },
//     textShadowRadius: 4,
//   },
//   headingUnderline: {
//     width: 55,
//     height: 4,
//     backgroundColor: "#003096",
//     borderRadius: 5,
//     marginTop: 7,
//     opacity: 0.75,
//   },
//   imageContainer: { marginTop: height * 0.015, alignItems: "center" },
//   image: {
//     width: Math.min(width * 0.6, 250),
//     height: Math.min(height * 0.18, 155),
//     borderRadius: 10,
//   },
//   glassCard: {
//     marginTop: height * 0.025,
//     backgroundColor: "rgba(255, 255, 255, 0.3)",
//     borderRadius: 20,
//     paddingHorizontal: width * 0.06,
//     paddingVertical: Math.min(height * 0.025, 20),
//     borderWidth: 1.5,
//     borderColor: "rgba(255, 255, 255, 0.65)",
//     shadowColor: "#003096",
//     shadowOffset: { width: 0, height: 5 },
//     shadowOpacity: 0.12,
//     shadowRadius: 12,
//     elevation: 4,
//   },
//   wordRow: {
//     flexDirection: "row",
//     alignItems: "flex-end",
//     flexWrap: "wrap",
//     justifyContent: "center",
//   },
//   wordText: {
//     fontSize: Math.min(width * 0.085, 34),
//     fontWeight: "900",
//     color: "#003096",
//     marginRight: 8,
//     textAlign: "center",
//   },
//   posText: {
//     fontSize: Math.min(width * 0.04, 17),
//     color: "#1E3A8A",
//     fontStyle: "italic",
//     fontWeight: "700",
//     marginBottom: 5,
//   },
//   voiceButton: {
//     width: 38,
//     height: 38,
//     borderRadius: 19,
//     backgroundColor: "rgba(255,255,255,0.6)",
//     justifyContent: "center",
//     alignItems: "center",
//     alignSelf: "center",
//     marginLeft: 8,
//     borderWidth: 1,
//     borderColor: "rgba(0,48,150,0.15)",
//   },
//   divider: {
//     height: 1.2,
//     backgroundColor: "rgba(0, 48, 150, 0.25)",
//     marginVertical: height * 0.015,
//     borderRadius: 2,
//   },
//   section: { marginTop: height * 0.01 },
//   sectionLabel: {
//     fontSize: Math.min(width * 0.032, 13),
//     fontWeight: "800",
//     color: "#003096",
//     marginBottom: height * 0.006,
//     letterSpacing: 1.5,
//   },
//   sectionText: {
//     fontSize: Math.min(width * 0.04, 17),
//     color: "#1F2937",
//     lineHeight: Math.max(height * 0.027, 20),
//   },
//   commentSection: { width: "100%", marginTop: height * 0.02 },
//   inputRow: { flexDirection: "row", alignItems: "center", gap: 9 },
//   input: {
//     flex: 1,
//     minHeight: 44,
//     maxHeight: 100,
//     backgroundColor: "rgba(255,255,255,0.7)",
//     borderRadius: 13,
//     paddingHorizontal: 13,
//     paddingVertical: 10,
//     fontSize: Math.min(width * 0.034, 14),
//     color: "#003096",
//     borderWidth: 1,
//     borderColor: "rgba(255,255,255,0.95)",
//   },
//   sendBtn: {
//     width: 44,
//     height: 44,
//     borderRadius: 14,
//     backgroundColor: "#003096",
//     justifyContent: "center",
//     alignItems: "center",
//     shadowColor: "#003096",
//     shadowOffset: { width: 0, height: 3 },
//     shadowOpacity: 0.25,
//     shadowRadius: 5,
//     elevation: 3,
//   },
//   sendBtnDisabled: { opacity: 0.5 },
//   reactionContainer: {
//     flexDirection: "row",
//     justifyContent: "center",
//     alignItems: "center",
//     flexWrap: "wrap",
//     marginTop: height * 0.08,
//     marginBottom: 4,
//     gap: 8,
//   },
//   reactionButton: {
//     backgroundColor: "rgba(255, 255, 255, 0.55)",
//     paddingVertical: 10,
//     paddingHorizontal: Math.min(width * 0.035, 14),
//     borderRadius: 22,
//     borderWidth: 1,
//     borderColor: "rgba(0, 48, 150, 0.18)",
//   },
//   selectedReaction: {
//     backgroundColor: "rgba(255, 255, 255, 0.95)",
//     borderColor: "#003096",
//     borderWidth: 1.5,
//   },
//   reactionText: {
//     fontSize: Math.min(width * 0.033, 14),
//     color: "#003096",
//     fontWeight: "700",
//   },
//   buttonContainer: {
//     marginTop: 8,
//     paddingTop: 0,
//     paddingBottom: 8,
//     alignItems: "center",
//   },
//   continueButton: {
//     width: Math.min(width * 0.72, 300),
//     backgroundColor: "#003096",
//     paddingVertical: 13,
//     paddingHorizontal: 24,
//     borderRadius: 14,
//     alignItems: "center",
//     justifyContent: "center",
//     borderWidth: 1,
//     borderColor: "rgba(255, 255, 255, 0.65)",
//     shadowColor: "#003096",
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.25,
//     shadowRadius: 7,
//     elevation: 4,
//   },
//   continueText: {
//     color: "#fff",
//     fontSize: Math.min(width * 0.045, 18),
//     fontWeight: "bold",
//     textAlign: "center",
//     letterSpacing: 1,
//   },
//   centerBox: {
//     flex: 1,
//     alignItems: "center",
//     justifyContent: "center",
//     minHeight: height * 0.25,
//   },
//   loadingText: {
//     marginTop: height * 0.02,
//     fontSize: Math.min(width * 0.04, 17),
//     color: "#003096",
//   },
//   errorText: {
//     fontSize: Math.min(width * 0.04, 17),
//     color: "#ff0000",
//     textAlign: "center",
//     marginBottom: height * 0.02,
//   },
//   retryButton: {
//     backgroundColor: "#003096",
//     paddingVertical: height * 0.015,
//     paddingHorizontal: width * 0.1,
//     borderRadius: 8,
//   },
//   retryText: {
//     color: "#fff",
//     fontSize: Math.min(width * 0.04, 17),
//     fontWeight: "bold",
//   },
// });