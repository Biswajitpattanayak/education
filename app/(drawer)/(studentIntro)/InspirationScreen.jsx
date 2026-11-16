import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import * as Animatable from "react-native-animatable";
import { Feather, Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  fetchInspiration,
  postInspirationReaction,
  postComment,
  fetchComments,
} from "../../../constants/api/apiHome";

const { width, height } = Dimensions.get("window");

export default function InspirationScreen() {
  const navigation = useNavigation();

  const [legend, setLegend] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imgError, setImgError] = useState(false);

  const [reaction, setReaction] = useState(null);
  const [likeCount, setLikeCount] = useState(0);
  const [dislikeCount, setDislikeCount] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [commentsList, setCommentsList] = useState([]);
  const [commentInput, setCommentInput] = useState("");
  const [isPostingComment, setIsPostingComment] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await fetchInspiration();

      // 👇 Check lagaya hai: Agar data hai tabhi set karo
      if (res?.data && res.data.id) {
        setLegend(res.data);
        setImgError(false);
        setLikeCount(res.data.like_count || 0);
        setDislikeCount(res.data.dislike_count || 0);
        setReaction(res.data.user_reaction || null);
        loadComments(res.data.id);
      } else {
        // 👇 Agar data nahi aaya to legend null hi rahega
        setLegend(null);
      }
    } catch (error) {
      // Agar backend error de (404 ya 500), to bhi legend null set karo
      setLegend(null);
    } finally {
      setLoading(false);
    }
  };

  const loadComments = async (inspirationId) => {
    try {
      const res = await fetchComments(inspirationId);
      if (res?.status && res?.data) {
        setCommentsList(res.data);
      }
    } catch (error) {
      console.log("Comments fetch error:", error);
    }
  };

  const handlePostComment = async () => {
    const trimmed = commentInput.trim();
    if (!trimmed || !legend?.id) return;

    try {
      setIsPostingComment(true);
      const res = await postComment(legend.id, trimmed);

      if (res?.status) {
        setCommentInput("");
        if (res.data) {
          setCommentsList((prev) => [...prev, res.data]);
        } else {
          loadComments(legend.id);
        }
      }
    } catch (error) {
      Alert.alert("Error", "Comment post nahi hua. Try again.");
    } finally {
      setIsPostingComment(false);
    }
  };

  const handleReaction = async (type) => {
    if (type === "comment") {
      setReaction(reaction === "comment" ? null : "comment");
      return;
    }

    if (!legend?.id || isSubmitting) return;

    const prevReaction = reaction;
    setReaction(type === prevReaction ? null : type);
    setIsSubmitting(true);

    try {
      const res = await postInspirationReaction(legend.id, type);
      if (res?.data) {
        setLikeCount(res.data.like_count || 0);
        setDislikeCount(res.data.dislike_count || 0);
        setReaction(res.data.user_reaction);
      }
    } catch (error) {
      setReaction(prevReaction);
      Alert.alert("Error", "Reaction save nahi hua.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleContinue = async () => {
    await AsyncStorage.setItem("hasVisitedStudentIntro", "true");
    navigation.replace("(drawer)");
  };

  // 👇 1. LOADING STATE
  if (loading) {
    return (
      <LinearGradient colors={["#89f7fe", "#66a6ff"]} style={styles.center}>
        <ActivityIndicator size="large" color="#003096" />
      </LinearGradient>
    );
  }

  // 👇 2. NO DATA STATE (Agar backend se kuch nahi aaya)
  if (!legend) {
    return (
      <LinearGradient colors={["#89f7fe", "#66a6ff"]} style={styles.center}>
        <Ionicons
          name="calendar-outline"
          size={60}
          color="#003096"
          style={{ marginBottom: 15 }}
        />
        <Text style={styles.noDataTitle}>No Inspiration Today</Text>
        <Text style={styles.noDataText}>
          There is no inspiration available for this date. Please check back
          later!
        </Text>

        <TouchableOpacity style={styles.noDataBtn} onPress={handleContinue}>
          <Text style={styles.continueText}>CONTINUE</Text>
        </TouchableOpacity>
      </LinearGradient>
    );
  }

  // 👇 3. MAIN UI (Agar data mil gaya)
  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <LinearGradient colors={["#89f7fe", "#66a6ff"]} style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Text style={styles.title}>Inspiration of the Day</Text>
            <View style={styles.line} />
          </View>

          <View style={styles.imgContainer}>
            <View style={styles.imgRing}>
              {legend.image && !imgError ? (
                <Image
                  source={{ uri: legend.image.trim() }}
                  style={styles.img}
                  resizeMode="cover"
                  onError={() => setImgError(true)}
                />
              ) : (
                <View style={styles.fallbackImg}>
                  <Ionicons name="person" size={60} color="#003096" />
                </View>
              )}
            </View>
            {legend.category && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>
                  ⭐ {legend.category.toUpperCase()}
                </Text>
              </View>
            )}
          </View>

          <Animatable.View animation="fadeInUp" delay={300} style={styles.card}>
            <Text style={styles.name}>{legend.person_name || "Unknown"}</Text>
            {(legend.birth_year || legend.death_year) && (
              <Text style={styles.years}>
                {legend.birth_year || ""}{" "}
                {legend.birth_year && legend.death_year ? "- " : ""}{" "}
                {legend.death_year || ""}
              </Text>
            )}

            <View style={styles.divider} />

            {legend.quote && (
              <View style={styles.quoteBox}>
                <Text style={styles.quoteIcon}>❝</Text>
                <Text style={styles.quoteText}>{legend.quote}</Text>
              </View>
            )}

            {legend.about && (
              <View style={{ width: "100%" }}>
                <Text style={styles.label}>ABOUT</Text>
                <Text style={styles.about}>{legend.about}</Text>
              </View>
            )}
          </Animatable.View>

          <View style={styles.reactions}>
            <TouchableOpacity
              style={[styles.btn, reaction === "like" && styles.btnActive]}
              onPress={() => handleReaction("like")}
              disabled={isSubmitting}
            >
              <Text style={styles.btnText}>
                👍 Like {likeCount > 0 ? `(${likeCount})` : ""}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.btn, reaction === "dislike" && styles.btnActive]}
              onPress={() => handleReaction("dislike")}
              disabled={isSubmitting}
            >
              <Text style={styles.btnText}>
                👎 Dislike {dislikeCount > 0 ? `(${dislikeCount})` : ""}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.btn, reaction === "comment" && styles.btnActive]}
              onPress={() => handleReaction("comment")}
            >
              <Text style={styles.btnText}>💬 Comment</Text>
            </TouchableOpacity>
          </View>

          {reaction === "comment" && (
            <Animatable.View
              animation="fadeInUp"
              style={styles.commentContainer}
            >
              <View style={styles.inputRow}>
                <TextInput
                  style={styles.input}
                  placeholder="Write your thoughts..."
                  value={commentInput}
                  onChangeText={setCommentInput}
                  multiline
                  editable={!isPostingComment}
                />
                <TouchableOpacity
                  style={[
                    styles.sendBtn,
                    (!commentInput.trim() || isPostingComment) && {
                      opacity: 0.5,
                    },
                  ]}
                  onPress={handlePostComment}
                  disabled={!commentInput.trim() || isPostingComment}
                >
                  {isPostingComment ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <Feather name="send" size={17} color="#fff" />
                  )}
                </TouchableOpacity>
              </View>

              {commentsList.length > 0 ? (
                <View style={styles.commentsList}>
                  <Text style={styles.commentsTitle}>
                    All Comments ({commentsList.length})
                  </Text>
                  {commentsList.map((item, index) => (
                    <View key={item.id || index} style={styles.commentItem}>
                      <View style={styles.commentHeader}>
                        <Ionicons
                          name="person-circle-outline"
                          size={20}
                          color="#003096"
                        />
                        <Text style={styles.commentUser}>
                          {item.user_name || "User"}
                        </Text>
                      </View>
                      <Text style={styles.commentText}>{item.comment}</Text>
                    </View>
                  ))}
                </View>
              ) : (
                <Text style={styles.noCommentText}>
                  No comments yet. Be the first to comment!
                </Text>
              )}
            </Animatable.View>
          )}

          <TouchableOpacity style={styles.continueBtn} onPress={handleContinue}>
            <Text style={styles.continueText}>CONTINUE</Text>
          </TouchableOpacity>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  container: { flex: 1 },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  scrollContent: { flexGrow: 1, padding: 20, paddingBottom: 40, gap: 20 },

  header: { alignItems: "center", marginTop: 10 },
  title: { fontSize: 24, fontWeight: "900", color: "#003096" },
  line: {
    width: 50,
    height: 4,
    backgroundColor: "#003096",
    marginTop: 5,
    borderRadius: 2,
  },

  imgContainer: { alignItems: "center" },
  imgRing: {
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 2,
    borderColor: "#fff",
    overflow: "hidden",
    backgroundColor: "#DCEAFE",
  },
  img: { width: "100%", height: "100%" },
  fallbackImg: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#DCEAFE",
  },
  badge: {
    backgroundColor: "#003096",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    marginTop: -15,
  },
  badgeText: { color: "#fff", fontWeight: "800", fontSize: 10 },

  card: {
    backgroundColor: "rgba(255,255,255,0.4)",
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#fff",
  },
  name: {
    fontSize: 22,
    fontWeight: "900",
    color: "#003096",
    textAlign: "center",
  },
  years: { fontSize: 13, color: "#1E3A8A", textAlign: "center", marginTop: 2 },
  divider: {
    height: 1,
    backgroundColor: "rgba(0,48,150,0.2)",
    marginVertical: 12,
  },

  quoteBox: {
    backgroundColor: "#003096",
    padding: 12,
    borderRadius: 10,
    flexDirection: "row",
    gap: 6,
    marginBottom: 10,
  },
  quoteIcon: { color: "#C7F9FF", fontSize: 18, fontWeight: "900" },
  quoteText: { color: "#fff", fontSize: 14, fontStyle: "italic", flex: 1 },

  label: { fontSize: 11, fontWeight: "800", color: "#003096", marginBottom: 2 },
  about: { fontSize: 14, color: "#1F2937", lineHeight: 18 },

  reactions: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    marginTop: 10,
  },
  btn: {
    backgroundColor: "rgba(255,255,255,0.6)",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "transparent",
  },
  btnActive: { backgroundColor: "#fff", borderColor: "#003096" },
  btnText: { color: "#003096", fontWeight: "700", fontSize: 13 },

  commentContainer: { marginTop: 5 },
  inputRow: { flexDirection: "row", gap: 8, marginBottom: 15 },
  input: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    fontSize: 13,
    maxHeight: 80,
  },
  sendBtn: {
    width: 44,
    height: 44,
    backgroundColor: "#003096",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  commentsList: {
    backgroundColor: "rgba(255,255,255,0.5)",
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.8)",
  },
  commentsTitle: {
    fontSize: 12,
    fontWeight: "800",
    color: "#003096",
    marginBottom: 10,
    textTransform: "uppercase",
  },
  commentItem: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  commentHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginBottom: 4,
  },
  commentUser: { fontSize: 12, fontWeight: "bold", color: "#003096" },
  commentText: { fontSize: 13, color: "#1F2937", lineHeight: 18 },
  noCommentText: {
    textAlign: "center",
    fontSize: 12,
    color: "#6B7280",
    fontStyle: "italic",
    marginTop: 10,
  },

  continueBtn: {
    backgroundColor: "#003096",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },
  continueText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    letterSpacing: 1,
  },

  // 👇 Naye Styles "No Data" screen ke liye
  noDataTitle: {
    fontSize: 22,
    fontWeight: "900",
    color: "#003096",
    marginBottom: 8,
  },
  noDataText: {
    fontSize: 14,
    color: "#1E3A8A",
    textAlign: "center",
    marginBottom: 30,
    paddingHorizontal: 20,
    lineHeight: 20,
  },
  noDataBtn: {
    backgroundColor: "#003096",
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 12,
    marginTop: 10,
  },
});
