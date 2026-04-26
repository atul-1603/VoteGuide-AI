import { useChatStore } from './useChatStore';

describe('useChatStore', () => {
  // Get a fresh initial state reference
  const getInitialState = () => {
    useChatStore.setState({
      messages: [
        {
          id: 'initial',
          role: 'model',
          content: 'Hello! I am VoteGuide, your AI election assistant. How can I help you today? You can ask me about voter registration, polling stations, ID requirements, or election laws.',
          createdAt: new Date(),
        },
      ],
      isLoading: false,
    });
  };

  beforeEach(() => {
    getInitialState();
  });

  describe('initial state', () => {
    it('starts with one initial model message', () => {
      const { messages } = useChatStore.getState();
      expect(messages).toHaveLength(1);
      expect(messages[0].role).toBe('model');
      expect(messages[0].id).toBe('initial');
    });

    it('starts with loading = false', () => {
      expect(useChatStore.getState().isLoading).toBe(false);
    });
  });

  describe('addMessage', () => {
    it('appends a message to the list', () => {
      const newMsg = {
        id: '2',
        role: 'user' as const,
        content: 'Test',
        createdAt: new Date(),
      };
      useChatStore.getState().addMessage(newMsg);

      const { messages } = useChatStore.getState();
      expect(messages).toHaveLength(2);
      expect(messages[1]).toEqual(newMsg);
    });

    it('preserves existing messages when adding', () => {
      const original = useChatStore.getState().messages[0];
      useChatStore.getState().addMessage({
        id: '2',
        role: 'user' as const,
        content: 'New message',
        createdAt: new Date(),
      });

      expect(useChatStore.getState().messages[0].id).toBe(original.id);
    });
  });

  describe('updateLastMessage', () => {
    it('updates the content of the last message', () => {
      useChatStore.getState().updateLastMessage('Updated content');

      const { messages } = useChatStore.getState();
      expect(messages[messages.length - 1].content).toBe('Updated content');
    });

    it('does not mutate the original message object', () => {
      const originalMsg = useChatStore.getState().messages[0];
      const originalContent = originalMsg.content;

      useChatStore.getState().updateLastMessage('New content');

      // The original object reference should not be modified
      expect(originalMsg.content).toBe(originalContent);
    });

    it('returns same state when messages array is empty', () => {
      useChatStore.setState({ messages: [] });
      const stateBefore = useChatStore.getState();

      useChatStore.getState().updateLastMessage('Should not crash');

      const stateAfter = useChatStore.getState();
      expect(stateAfter.messages).toHaveLength(0);
    });

    it('only updates the last message, not others', () => {
      useChatStore.getState().addMessage({
        id: '2',
        role: 'user' as const,
        content: 'User message',
        createdAt: new Date(),
      });

      useChatStore.getState().updateLastMessage('Updated last');

      const { messages } = useChatStore.getState();
      expect(messages[0].content).toContain('VoteGuide');
      expect(messages[1].content).toBe('Updated last');
    });
  });

  describe('setLoading', () => {
    it('sets loading state to true', () => {
      useChatStore.getState().setLoading(true);
      expect(useChatStore.getState().isLoading).toBe(true);
    });

    it('sets loading state to false', () => {
      useChatStore.getState().setLoading(true);
      useChatStore.getState().setLoading(false);
      expect(useChatStore.getState().isLoading).toBe(false);
    });
  });

  describe('clearMessages', () => {
    it('resets to initial state with one model message', () => {
      // Add some messages first
      useChatStore.getState().addMessage({
        id: '2',
        role: 'user' as const,
        content: 'Test',
        createdAt: new Date(),
      });
      useChatStore.getState().addMessage({
        id: '3',
        role: 'model' as const,
        content: 'Reply',
        createdAt: new Date(),
      });

      expect(useChatStore.getState().messages).toHaveLength(3);

      useChatStore.getState().clearMessages();

      const { messages } = useChatStore.getState();
      expect(messages).toHaveLength(1);
      expect(messages[0].role).toBe('model');
      expect(messages[0].id).toBe('initial');
    });

    it('produces a fresh message with the shorter greeting', () => {
      useChatStore.getState().clearMessages();

      const { messages } = useChatStore.getState();
      expect(messages[0].content).toBe(
        'Hello! I am VoteGuide, your AI election assistant. How can I help you today?'
      );
    });
  });
});
