/** App.jsx - import dependant modules */
import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Flex, Box, Text, TextField, IconButton, Spinner, ScrollArea, Strong, Card } from "@radix-ui/themes";
import { PaperPlaneIcon, DesktopIcon, PersonIcon } from "@radix-ui/react-icons";
import './App.css';
import { Mistral } from '@mistralai/mistralai';

/* obtain Mistral API key */
export default class App extends React.Component {
  state = {
    isLoading: false,
    mistralAiApiKey: '',
    mistralClient: null,
    conversation: {
      model: 'devstral-small-latest',
      messages: [],
    },
    question: '',
    userStyle: {
      backgroundColor: 'orange',
      padding: '5px',
      width: '70%',
      margin: '5px'
    },
    assistantStyle: {
      padding: '5px',
      width: '70%',
      margin: '5px'
    }
  };

  messagesEndRef = React.createRef();
  scrollToBottom = () => {
    this.messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth'
    });
  };

  componentDidMount() {
    const mistralAiApiKey = import.meta.env.VITE_MISTRAL_AI_API_KEY // set in .env var
    console.log('mistralAiApiKey.length', mistralAiApiKey.length) // should be around 32

    this.mistralClient = new Mistral({ apiKey: mistralAiApiKey });
    // 'read https://docs.mistral.ai/api/endpoint/chat'
    console.log('mistralClient', this.mistralClient)

    this.setState({ mistralAiApiKey, mistralClient: this.mistralClient });

    fetch('http://localhost:3333/messages')
      .then(res => res.json())
      .then(data => {
        console.log('GET /messages response', data);

        if (Array.isArray(data.results)) {
          this.setState(prev => ({
            conversation: {
              ...prev.conversation,
              messages: data.results.map(m => ({
                role: m.role,
                content: m.message_content
              }))
            }
          }),
            this.scrollToBottom
          );
        }
      })
      .catch(err => {
        console.warn('GET /messages error', err);
      });
  }

  sendQuestion = async () => {
    console.log('sendQuestion state', this.state);

    const question = this.state.question;

    if (question.length === 0) return;

    console.log('sendQuestion question', question);

    this.setState({ question: '', isLoading: true });

    try {
      const requestBodyObj = { ...this.state.conversation };
      console.log('requestBodyObj', requestBodyObj);

      this.setState(prev => ({
        conversation: {
          ...prev.conversation,
          messages: [
            ...prev.conversation.messages,
            { role: 'user', content: question }
          ]
        }
      }),
        this.scrollToBottom
      );

      // callout to POST /messages (USER)
      try {
        const resJSON = await fetch('http://localhost:3333/messages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ role: 'user', content: question })
        });

        const res = await resJSON.json();
        console.log('POST: ' + res);
      } catch (e) {
        console.warn(e);
      }

      const mistralClient = this.state.mistralClient;
      console.log('mistralClient in sendQuestion', mistralClient);

      if (!mistralClient) {
        console.warn('mistralClient is null');
        return;
      }

      let chatResponse = await mistralClient.chat.complete({
        model: this.state.conversation.model,
        messages: [...this.state.conversation.messages]
      });

      console.log('chatResponse', chatResponse);

      // Update conversation with response
      let updatedMessages = {
        role: chatResponse.choices[0].message.role,
        content: chatResponse.choices[0].message.content
      };
      console.log('updatedMessages', updatedMessages);

      this.setState(prev => ({
        conversation: {
          ...prev.conversation,
          messages: [
            ...prev.conversation.messages,
            updatedMessages
          ]
        }
      }),
        this.scrollToBottom
      );

      // callout to POST /messages (ASSISTANT)
      try {
        const resJSON2 = await fetch('http://localhost:3333/messages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedMessages)
        });

        const res2 = await resJSON2.json();
        console.log('POST: ' + res2);
      } catch (e) {
        console.warn(e);
      }

    } catch (err) {
      console.error('sendQuestion hiba:', err);
    } finally {
      this.setState({ isLoading: false });
    }
  }
  handleEnter = e => {
    if (e.key == 'Enter' && this.state.question.length > 0) this.sendQuestion();
  }

  render() {
    return (
      <Flex direction="column" height="90vh" p="3" gap="3" style={{ margin: '10px' }} width='90vw'>
        {/* Header */}
        <Box>

          <Text size="4" weight="bold">
            <Strong>AI Chat</Strong>
          </Text>
        </Box>

        {/* Conversation area */}
        <div
          type="always"
          scrollbars="vertical"
          style={{
            flex: 1,                    // fills remaining height
            overflowY: 'auto',
            height: '600px',

            border: "1px solid #ccc",
            borderRadius: 8,
            backgroundColor: "#fafafa"
          }}
        >

          <Box p="2" style={{ padding: '2px' }}>
            {this.state.conversation.messages.length === 0 ? (
              <Text color="gray" style={{ userSelect: "none", opacity: '0.5' }}>No messages yet…</Text>
            ) : (
              this.state.conversation.messages.map((msg, i) => {

                // Remove <think>...</think>
                const cleaned = msg.content.replace(/<think>[\s\S]*?<\/think>/, '').trim();
                return (

                  <Flex justify={msg.role === 'user' ? "end" : "start"} key={i}>
                    <Card
                      style={msg.role === 'user' ? this.state.userStyle : this.state.assistantStyle}
                    >
                      <h5>{msg.role === 'user' ? <PersonIcon /> : <DesktopIcon />} {msg.role}</h5>
                      <ReactMarkdown>{cleaned}</ReactMarkdown>
                    </Card>
                  </Flex>

                );

              })
            )}
          </Box>

          <div ref={this.messagesEndRef} />
        </div>

        {/* Input bar or Spinner */}

        <Flex onKeyDown={this.handleEnter}
          direction='row'
          justify='between'
          align='center'
          style={{ minWidth: '100%', minHeight: '40px' }}
        >
          {
            this.state.isLoading
              ?
              <input
                style={{ width: '95%', minHeight: '100%', borderRadius: '20px', padding: '0 5px', marginRight: '5px' }}
                type="text"
                id="inputQuestion"
                name="inputQuestion"
                placeholder="Ask…"
                onChange={e => this.setState({ question: e.target.value })}
                value={this.state.question}
                disabled
              />
              :
              <input
                style={{ width: '95%', minHeight: '100%', borderRadius: '20px', padding: '0 5px', marginRight: '5px' }}
                type="text"
                id="inputQuestion"
                name="inputQuestion"
                placeholder="Ask…"
                onChange={e => this.setState({ question: e.target.value })}
                value={this.state.question}
              />

          }

          {
            this.state.isLoading
              ?
              <Spinner size='2' />
              :
              <IconButton onClick={this.sendQuestion} id='btnSend' name='btnSend' aria-label='btnSend'>
                <PaperPlaneIcon />
              </IconButton>
          }

        </Flex>
      </Flex>
    );
  }
}
