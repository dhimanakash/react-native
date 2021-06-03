import React, { useState, useCallback, useEffect } from "react";
import { GiftedChat, Bubble } from "react-native-gifted-chat";
import { StyleSheet, Text, View } from "react-native";
import { db } from "../../firebase";

import "firebase/firestore";

const ChatScreen = ({ user, route }) => {
  const [messages, setMessages] = useState([]);
  const { uid } = route.params;

  const getAllMessages = async () => {
    const docid = uid > user.uid ? user.uid + "-" + uid : uid + "-" + user.uid;
    const querySnap = await db
      .collection("chatrooms")
      .doc(docid)
      .collection("messages")
      .orderBy("createdAt", "desc")
      .get();
    const allmsg = querySnap.docs.map((docSnap) => {
      return {
        ...docSnap.data(),
        createdAt: docSnap.data().createdAt.toDate(),
      };
    });
    setMessages(allmsg);
  };

  useEffect(() => {
    // getAllMessages();
    const docid = uid > user.uid ? user.uid + "-" + uid : uid + "-" + user.uid;
    const messageRef = db
      .collection("chatrooms")
      .doc(docid)
      .collection("messages")
      .orderBy("createdAt", "desc");

    messageRef.onSnapshot((querySnap) => {
      const allmsg = querySnap.docs.map((docSnap) => {
        return {
          ...docSnap.data(),
          createdAt: docSnap.data().createdAt.toDate(),
        };
      });
      setMessages(allmsg);
    });
  }, []);

  const onSend = (messageArray) => {
    const msg = messageArray[0];
    const myMsg = {
      ...msg,
      sentBy: user.uid,
      sentTo: uid,
      createdAt: new Date(),
    };

    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, myMsg)
    );
    const docid = uid > user.uid ? user.uid + "-" + uid : uid + "-" + user.uid;
    db.collection("chatrooms")
      .doc(docid)
      .collection("messages")
      .add({
        ...myMsg,
        createdAt: new Date(),
      });
  };
  return (
    <View style={styles.container}>
      <GiftedChat
        messages={messages}
        onSend={(text) => onSend(text)}
        user={{
          _id: user.uid,
        }}
        renderBubble={(props) => {
          {
            return (
              <Bubble
                {...props}
                wrapperStyle={{
                  left: {
                    backgroundColor: "white",
                  },
                }}
              />
            );
          }
        }}
      />
    </View>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
