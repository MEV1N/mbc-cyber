import { onBeforeUnmount, onMounted, ref } from 'vue';

export type WebSocketMessage = {
  type: 'PLAY_VIDEO';
};

export type WebSocketStatus = 'connecting' | 'connected' | 'disconnected' | 'error' | 'unavailable';

type MessageHandler = (message: WebSocketMessage) => void;

const normalizeWebSocketUrl = (value: string) => {
  const trimmed = value.trim();
  if (!trimmed) return '';

  if (/^https:\/\//i.test(trimmed)) return trimmed.replace(/^https:\/\//i, 'wss://');
  if (/^http:\/\//i.test(trimmed)) return trimmed.replace(/^http:\/\//i, 'ws://');

  // Accept hostnames entered without scheme in env vars.
  if (/^wss?:\/\//i.test(trimmed)) return trimmed;
  return `wss://${trimmed.replace(/^\/+/, '')}`;
};

const getWebSocketUrl = () => {
  const configuredUrl = import.meta.env.VITE_WS_URL?.trim();
  const legacyConfiguredUrl = import.meta.env.VITE_WEBSOCKET_URL?.trim();
  if (configuredUrl) return normalizeWebSocketUrl(configuredUrl);
  if (legacyConfiguredUrl) return normalizeWebSocketUrl(legacyConfiguredUrl);
  if (import.meta.env.DEV) return 'ws://localhost:8080';
  return '';
};

const isSupportedMessage = (value: unknown): value is WebSocketMessage => {
  if (!value || typeof value !== 'object') return false;
  return (value as { type?: unknown }).type === 'PLAY_VIDEO';
};

export const useWebSocket = (onMessage: MessageHandler) => {
  const status = ref<WebSocketStatus>('disconnected');
  const resolvedUrl = ref('');
  const socket = ref<WebSocket | null>(null);
  let reconnectTimer: ReturnType<typeof setTimeout> | undefined;
  let isUnmounted = false;

  const connect = () => {
    if (isUnmounted) return;

    const nextUrl = getWebSocketUrl();
    if (!nextUrl) {
      status.value = 'unavailable';
      return;
    }

    resolvedUrl.value = nextUrl;

    status.value = 'connecting';
    const nextSocket = new WebSocket(nextUrl);
    socket.value = nextSocket;

    nextSocket.addEventListener('open', () => {
      status.value = 'connected';
    });

    nextSocket.addEventListener('message', (event) => {
      try {
        const parsed: unknown = JSON.parse(String(event.data));
        if (isSupportedMessage(parsed)) onMessage(parsed);
      } catch {
        // Ignore malformed socket messages.
      }
    });

    nextSocket.addEventListener('error', () => {
      status.value = 'error';
    });

    nextSocket.addEventListener('close', () => {
      socket.value = null;
      if (isUnmounted) return;
      status.value = 'disconnected';
      reconnectTimer = setTimeout(connect, 2500);
    });
  };

  const send = (message: WebSocketMessage) => {
    if (socket.value?.readyState !== WebSocket.OPEN) return false;
    socket.value.send(JSON.stringify(message));
    return true;
  };

  const disconnect = () => {
    isUnmounted = true;
    if (reconnectTimer) clearTimeout(reconnectTimer);
    socket.value?.close();
    socket.value = null;
  };

  onMounted(connect);
  onBeforeUnmount(disconnect);

  return { status, url: resolvedUrl, send };
};
