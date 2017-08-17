import React, { Component } from 'react';
import Chat from './chat.js';
import {
    Layout,
    Menu,
    Icon,
    Breadcrumb,
    Steps,
    Spin,
    notification,
    Radio,
    Button,
    Tag,
    Card,
    Alert,
    Input
} from 'antd';
const { TextArea } = Input;
const { Header, Sider, Content, Footer } = Layout;

export default class ChatView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '无名氏',
            loading: true,
            textValue: '',
            textMessage: ''
        };
    }

    componentDidMount() {
        Chat.init({
            onNameResult: this.handleNameResult,
            onRoomResult: this.handleRoomResult,
            onJoinResult: this.handleJoinResult,
            onMessage: this.handleMessage
        }).connect();
    }

    handleMessage = (result) => {
        const { textMessage } = this.state;
        console.log(result.text);
        this.setState({
            textMessage: textMessage + '\r' + result.text
        });
    }

    handleJoinResult = (result) => {
        console.log(result);
    }

    handleRoomResult = (result) => {
        console.log(result);
    }

    handleNameResult = (result) => {
        this.setState({
            name: result.name
        });
    }

    sendMessage = () => {
        const { textValue, textMessage } = this.state;
        Chat.sendMessage(null, textValue);
        this.setState({
            textMessage: textMessage + '\r' + '我 :'+ textValue,
            textValue: ''
        });
    }

    handerTextAreaChange = (e) => {
        this.setState({
            textValue: e.target.value
        });
    }

    render() {
        const { loading, name, textValue, textMessage } = this.state;

        return (
            <Layout>
                <Header className="header">
                    <h3 style={{ color: '#FFF' }}>{`欢迎回来休息室: ${name}`}</h3>
                    <Spin size="small" spinning={loading} />
                </Header>
                <Content style={{ padding: '20px' }}>
                    <Layout>
                        <Content style={{ padding: '0  20px 0 0' }}>
                            <TextArea
                                value={textMessage}
                                autosize={{ 'minRows': 20, 'maxRows': 20 }}
                                style={{ border: 0 }}
                            />
                            <div style={{ padding: '20px 0 0 0', minHeight: 280 }}>
                                <TextArea
                                    placeholder="说点什么"
                                    onChange={this.handerTextAreaChange}
                                    value={textValue}
                                    autosize={{ 'minRows': 5, 'maxRows': 5 }}
                                    style={{ border: 0 }} />
                                <Button
                                    onClick={this.sendMessage}
                                    style={{ float: 'right', marginTop: 10, width: 120 }}
                                    type="primary"
                                    size="large">发 送</Button>
                            </div>
                        </Content>
                        <Sider width={300} style={{ background: '#E9E9E8' }}>
                            <Card title="大厅人员" style={{ padding: '20px', minHeight: 500, borderRadius: 3 }}>

                            </Card>
                        </Sider>
                    </Layout>
                </Content>
                <Footer style={{ textAlign: 'center' }}>
                    Copyleft ©2017 Created by Ethan   Chatrooms version 0.1.0
                </Footer>

            </Layout>
        );
    }

}