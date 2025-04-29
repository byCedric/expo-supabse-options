import { WebSocket } from '@test/package-exports';
import { Pressable, ScrollView, View } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useEffect, useMemo, useRef, useState } from 'react';

export default function HomeScreen() {
  const { socket, messages } = useWebSocket('https://echo.websocket.org');

  return (
      <ScrollView style={{ flex: 1, alignContent: 'center', paddingHorizontal: 32, marginVertical: 64, marginBottom: 64 }} contentContainerStyle={{ gap: 8 }}>
        <View style={{ flexDirection: 'row', gap: 16 }}>
          <ThemedText type="title" style={{ fontSize: 24 }}>WebSocket tester</ThemedText>
          <Pressable onPress={() => socket.send('ping')}>
            <ThemedText style={{ paddingHorizontal: 8, paddingVertical: 4, backgroundColor: 'gray' }}>Send ping</ThemedText>
          </Pressable>
        </View>
        <ThemedView style={{ padding: 16, gap: 8 }}>
          <ThemedText type="subtitle" style={{ fontSize: 18 }}>Received messages</ThemedText>
            {messages.map((message) => (
              <ThemedText key={message.id}>{message.data}</ThemedText>
            ))}
        </ThemedView>
      </ScrollView>
  );
}

function useWebSocket(url: string) {
  const socket = useMemo(() => new WebSocket(url), [url]);
  const messageId = useRef(1);
  const [messages, setMessages] = useState<{ data: string; id: number }[]>([]);

  useEffect(() => {
    const onMessage = (event: WebSocketMessageEvent) => {
      setMessages((messages) => messages.concat({ data: event.data, id: messageId.current++ }));
    };

    socket.addEventListener('message', onMessage);
    return () => {
      socket.removeEventListener('message', onMessage);
      socket.close();
    };
  }, [socket]);

  return {
    socket,
    messages,
  };
}
