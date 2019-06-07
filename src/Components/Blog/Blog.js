import React, { Component } from "react";
import Header from "../../Header/Header1";
import _ from 'lodash';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import renderHTML from 'react-render-html';
import { database, server } from '../../Server/fire';
import "./blog.css";


export default class Blog extends Component {

    constructor(props) {
        super(props);
        this.state = {
            userName: '',
            title: '',
            body: '',
            posts: {},

        };
    }

    // lifecycle
    componentWillMount() {
        var postobj = null;
        database.on('value', snapshot => {
            postobj = snapshot.val();
            this.setState({
                posts: snapshot.val()
            }, () => {
                console.log("Posts: ", this.state.posts)
                this.sortpost();
                var keys = Object.keys(this.state.posts)
                for (let i = 0; i < keys.length; i++) {
                    console.log("posts: ", this.state.posts[keys[i]].PostTime)
                }
            }
            )

        });


        var user = JSON.parse(sessionStorage.getItem("authUser"));
        var that = this;
        server
            .database()
            .ref("/RegisteredData")
            .child(user.uid)
            .on("value", function (snapshot) {
                that.setState({
                    userName: snapshot.val().userName
                })
            })

    }

    sortpost = () => {
        var keys = Object.keys(this.state.posts)
        var postSort = [];
        for (let i = 0; i < keys.length; i++) {
            postSort.push(this.state.posts[keys[i]])
        }
        console.log("before sort: ", postSort)
        postSort.sort(function compare(a, b) {
            var dateA = new Date(a.PostTime);
            var dateB = new Date(b.PostTime);
            return dateB - dateA
        });
        var tempobj = {};
        for (let i = 0; i < keys.length; i++) {
            tempobj[keys[i]] = postSort[i];
        }
        this.setState({
            posts: tempobj
        })
    }

    renderPosts() {
        return _.map(this.state.posts, (post, key) => {
            var date = new Date(post.PostTime).toLocaleDateString() + " " + new Date(post.PostTime).toLocaleTimeString()
            return (
                <div key={key} className="col-lg-9 col-sm-9 col-md-9 col-xs-9 postpaddingbottom">

                    <div className="postinfo">Title: {post.title}</div>
                    <div className="postinfo">Posted By: {post.userName}</div>
                    <div className="postinfo infopadding">Time: {date}</div>
                    <p>{renderHTML(post.body)}</p>
                </div>
            );
        });
    }

    onHandleChange = (e) => {
        this.setState({ body: e });
        console.log(this.state.body);
    }

    onHandleSubmit = (e) => {

        e.preventDefault();
        const post = {
            title: this.state.title,
            body: this.state.body,
            userName: this.state.userName,
            PostTime: new Date().toString()
        };
        database.push(post);

        this.setState({
            title: '',
            body: ''
        });
    }

    render() {
        console.log("Post By: ", this.state.userName)
        return (
            <div>

                <Header history={this.props.history} />

                <div className="container containerpadding" id="blogContainer">
                    <form onSubmit={this.onHandleSubmit}>
                        <div className="form-group">
                            <input
                                value={this.state.title}
                                type="text"
                                name="title"
                                placeholder="Title"
                                onChange={e => {
                                    this.setState({ title: e.target.value });
                                }}
                                ref="title"
                                className="form-control"

                            />
                        </div>
                        <div className="form-group">
                            <ReactQuill
                                modules={Blog.modules}
                                formats={Blog.formats}
                                value={this.state.body}
                                placeholder="Body"
                                onChange={this.onHandleChange}

                            />
                        </div>
                        <button className="btn btn-primary">Post</button>
                    </form>
                    <br />
                    {this.renderPosts()}
                </div>
            </div>
        );
    }
}

Blog.modules = {
    toolbar: [
        [{ header: '1' }, { header: '2' }, { font: [] }],
        [{ size: [] }],
        ['bold', 'italic', 'underline', 'blockquote'],
        [{ list: 'ordered' }, { list: 'bullet' }],
        ['image', 'video'],
        ['clean'],
        ['code-block']
    ]
};

Blog.formats = [
    'header',
    'font',
    'size',
    'bold',
    'italic',
    'underline',
    'strike',
    'blockquote',
    'list',
    'bullet',
    'link',
    'image',
    'video',
    'code-block'
];


