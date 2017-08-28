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
    Input, Row, Col
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
            textMessage: '',
            menber: []  //房间成员
        };
    }

    componentDidMount() {
        Chat.init({
            onNameResult: this.handleNameResult,
            onRoomResult: this.handleRoomResult,
            onJoinResult: this.handleJoinResult,
            onMessage: this.handleMessage,
            onMemberResult: this.handleMemberResult
        }).connect();
    }

    handleMessage = (result) => {
        const { textMessage } = this.state;
        console.log('handleMessage', result.text);
        this.setState({
            textMessage: textMessage + '\r' + result.text
        });
    }

    handleJoinResult = (result) => {
        console.log('JoinResult', result);
    }

    handleRoomResult = (result) => {
        console.log('RoomResult', result);
    }

    handleMemberResult = (result) => {
        var menber = result.text.split(',');
        this.setState({
            menber: menber
        });
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
            textMessage: textMessage + '\r' + '我 :' + textValue,
            textValue: ''
        });
    }

    handerTextAreaChange = (e) => {
        this.setState({
            textValue: e.target.value
        });
    }

    render() {
        const { loading, name, textValue, textMessage, menber } = this.state;

        return (
            <Layout style={{ height: '100%' }}>
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
                            <div style={{ padding: '20px 0 0 0' }}>
                                <Row gutter={8}>
                                    <Col span={22} >
                                        <TextArea
                                            placeholder="说点什么"
                                            onChange={this.handerTextAreaChange}
                                            value={textValue}
                                            autosize={{ 'minRows': 5, 'maxRows': 5 }}
                                            style={{ border: 0 }} />
                                    </Col>
                                    <Col span={2} >
                                        <Button
                                            onClick={this.sendMessage}
                                            style={{ height: 98, width: '100%' }}
                                            size="large">发送</Button>
                                    </Col>
                                </Row>
                            </div>
                        </Content>
                        <Sider width={250} style={{ background: '#E9E9E8' }}>
                            <Card title="休息室大厅人员" style={{ padding: '20px', minHeight: 500, borderRadius: 3 }}>
                                {
                                    menber.map(
                                        (item, index) => (<p key={item}>{item}</p>)
                                    )
                                }
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