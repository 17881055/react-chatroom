import React, { Component } from 'react';
import ChatView from './Chat';
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

export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
        };
    }
    render() {
        const { loading } = this.state
        return (
            <ChatView />
        );
    }

}