/** App.jsx - TODO - import dependant modules */
import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Flex, Box, Text, TextField, IconButton, Spinner, ScrollArea, Strong } from "@radix-ui/themes";
import { PaperPlaneIcon, FaceIcon } from "@radix-ui/react-icons";
//import './App.css';
import { Mistral } from '@mistralai/mistralai';

/* TODO - obtain Mistral API key */
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
  };

  componentDidMount() {
    const mistralAiApiKey = import.meta.env.VITE_MISTRAL_AI_API_KEY // TODO - set in .env var
    // console.log('mistralAiApiKey.length', mistralAiApiKey.length) // should be around 32

    this.mistralClient = 'TODO read https://docs.mistral.ai/api/endpoint/chat '
    // console.log('mistralClient', this.mistralClient)

    this.setState({mistralAiApiKey, mistralClient: this.mistralClient})
  }

  sendQuestion = async () => {
    //console.log('sendQuestion state', this.state);
    const question = 'TODO'
    //console.log('sendQuestion question', question);

    const requestBodyObj = {...this.state.conversation};
    requestBodyObj.messages.push({role: 'user', content: 'TODO'})
    //console.log('requestBodyObj', requestBodyObj)

    // TODO - callout to POST /messages

    const mistralClient = this.state.mistralClient;
    // TODO - show spinner here
    let chatResponse = 'TODO read https://docs.mistral.ai/api/endpoint/chat '
    // TODO - stop spinner here
    //console.log('chatResponse', chatResponse)

    // TODO - Update conversation with response
    let updatedMessages = 'TODO'
    //console.log('updatedMessages', updatedMessages)

    // TODO - callout to POST /messages

    // TODO - setState
  }

  handleEnter = e => {
    if (e.key == 'Enter') this.sendQuestion();
  }

  render() {
    return (
      <Flex direction="column" height="100vh" p="3" gap="3" style={{margin: '10px'}}>
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
          <Box p="2" style={{padding: '2px'}}>
            {this.state.conversation.messages.length === 0 ? (
              <Text color="gray">No messages yet…</Text>
            ) : (
              this.state.conversation.messages.map((msg, i) => {

                // Remove <think>...</think>
                const cleaned = msg.content.replace(/<think>[\s\S]*?<\/think>/, '').trim();
                return (
                  <div key={i}>
                    <h5><FaceIcon /> {msg.role}</h5>
                    <ReactMarkdown>{cleaned}</ReactMarkdown>
                  </div>
                );

              })
            )}
          </Box>
        </div>


        {/* Input bar or Spinner */}

        {this.state.isLoading ? <p>&#x23F3; LOADING &#x23F3; </p> :

          <Box onKeyDown={this.handleEnter}>
            <p>
              <input type="text" id="inputQuestion" name="inputQuestion" placeholder="Ask…"
              style={{minWidth: '90vw', minHeight: '40px'}}
              onChange={e=>this.setState({question: e.target.value})} />
              <IconButton onClick={this.sendQuestion} id='btnSend' name='btnSend' aria-label='btnSend'>
                <PaperPlaneIcon />
              </IconButton>
            </p>
          </Box>

        }


      </Flex>
    );
  }
}
