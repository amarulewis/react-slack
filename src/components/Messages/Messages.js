import React from 'react';
import MessagesHeader from './MessagesHeader'
import MessagesForm from './MessagesForm';
import Message from './Message'
import {Segment, Comment} from 'semantic-ui-react'
import firebase from 'firebase';

class Messages extends React.Component {
    state = {
        privateChannel: this.props.isPrivateChannel,
        privateMessagesRef: firebase.database().ref('privateMessages'),
        messagesRef: firebase.database().ref('messages'),
        messages: [],
        messagesLoading: true,
        channel: this.props.currentChannel,
        user: this.props.currentUser,
        progressBar: false,
        numUniqueUsers: '',
        searchTerm: '',
        searchLoading: false,
        searchResults: [],
    }

    componentDidMount(){
        const {channel, user} = this.state

        if(channel && user){
            this.addListeners(channel.id)
        }
    }

    addListeners = channelId => {
        this.addMessageListener(channelId)
    }

    addMessageListener = channelId => {
        let loadedMessages = [];
        const ref = this.getMessagesRef();
        ref.child(channelId).on('child_added', snap => {
            loadedMessages.push(snap.val())
            console.log(loadedMessages)
            this.setState({
                messages: loadedMessages,
                messagesLoading: false,
            })
            this.countUniqueUsers(loadedMessages)
        });
    };
    
    getMessagesRef = () => {
        const {messagesRef, privateMessagesRef, privateChannel} = this.state;
        return privateChannel ? privateMessagesRef : messagesRef
    }

    handleSearchChange = event => {
        this.setState({
            searchTerm: event.target.value,
            searchLoading: true
        }, () => this.handleSearchMessages())
    }

    handleSearchMessages = () => {
        const channelMessages = [...this.state.messages]
        const regex = new RegExp(this.state.searchTerm, 'gi');
        const searchResults = channelMessages.reduce((acc, message) => {
            if (message.content && message.content.match(regex)){
                acc.push(message);
            }
            return acc;
        }, []);
        this.setState({searchResults})
    }

    countUniqueUsers = messages => {
        const uniqueUsers = messages.reduce((acc,message) => {
            if(!acc.includes(message.user.name)){
                acc.push(message.user.name);
            }
            return acc;
        }, [])
        const plural = uniqueUsers.length > 1;
        const numUniqueUsers = `${uniqueUsers.length} user${plural ? 's' : ''}`;
        this.setState({numUniqueUsers})
    }

    displayMessages = messages => (
            messages.length > 0 && messages.map(message => (
            <Message 
                key={message.timestamp}
                message={message}
                user={this.state.user}

            />
        )))

    displayChannelName = channel => {
       return channel
        ? `${this.state.privateChannel 
            ? '@'
            : '#'}${channel.name}` 
        : '';
    }
    
    isProgressBarVisible = percent => {
        if (percent > 0){
            this.setState({progressBar: true})
        }
    }

    render() {
        const {messagesRef,messages, channel,user, progressBar, 
            numUniqueUsers, searchTerm, searchResults,isPrivateChannel,searchLoading} = this.state


        return (
            <React.Fragment>
                <MessagesHeader
                    channelName={this.displayChannelName(channel)}
                    numUniqueUsers={numUniqueUsers}
                    handleSearchChange={this.handleSearchChange}
                    searchLoading={searchLoading}
                    isPrivateChannel={isPrivateChannel}
                />
                <Segment>
                    <Comment.Group className={progressBar ? 'messages__progress': "messages"}>
                        {/* Messages */}
                        {searchTerm ? this.displayMessages(searchResults) :this.displayMessages(messages)}
                    </Comment.Group>
                </Segment>

                <MessagesForm
                    messagesRef={messagesRef}
                    currentChannel={channel}
                    currentUser={user}
                    isProgressBarVisible={this.isProgressBarVisible}
                    isPrivateChannel={isPrivateChannel}
                    getMessagesRef = {this.getMessagesRef}
                />
            </React.Fragment>
        )
    }
}

export default Messages