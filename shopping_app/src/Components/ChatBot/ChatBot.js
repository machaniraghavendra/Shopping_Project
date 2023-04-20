import "../ChatBot/chatBot.css"
import axios from "axios"
import { React, Component } from "react";
import { Link } from "react-router-dom";

class ChatBot extends Component {
    constructor(props) {
        super(props);
        axios.get("http://localhost:8083/user/" + localStorage.getItem("currentuser")).then(a => { return (this.setUser(a.data)) })
        this.getResponses()
        this.state = {
            showBot: false,
            userMessage: "",
            user: [],
            responses: [],
        };
    }
    setUser(user) {
        this.setState({
            user: user
        })
    }
    callBot(presentState) {
        this.setState({
            showBot: !presentState,
        })
    }
    setMessage(message) {
        let height = document.getElementById("con-area")
        this.getResponses(height);
        this.setState({
            userMessage: message
        })
    }
    setResponses(responses) {
        this.setState({
            responses: responses
        })
    }

    getResponses(height) {
        axios.get("http://localhost:8083/bot/").then((a) => { this.setResponses(a.data) });
        if (height) {
            height.scrollTop = height.scrollHeight - height.clientHeight;
        }
    }
    clearResponses() {
        axios.post("http://localhost:8083/bot/" + this.state.user.userEmail);
    }

    sendResponse() {
        axios.post("http://localhost:8083/bot/", {
            "userDetails": {
                "userName": this.state.user.userName,
                "userEmail": this.state.user.userEmail,
                "mobileNumber": this.state.user.mobileNumber
            },
            "userMessage": this.state.userMessage
        })
        let height = document.getElementById("con-area")
        this.getResponses(height);
        this.setMessage("");
    }

    render() {
        return (
            <div className="text-white ">
                {this.state.showBot ? 
                <div className="chatPop" >
                    <div className="card" style={{ backgroundColor: "lightblue" }}>
                        <div className="card-head bg-dark" >
                            <div className="closeBot row m-1 justify-content-center">
                                <span className="px-2 col-4 card-title fs-5">Chat Bot </span>
                                <span className="text-light col-4 btn fs-6 px-2"
                                    onClick={() => {
                                        this.clearResponses()
                                        return (
                                            this.getResponses()
                                        )
                                    }}
                                >Clear chat
                                </span>
                                <i className="bi bi-x px-2 col-4 text-end" onClick={() => { this.getResponses(document.getElementById("con-area")); return (this.callBot(this.state.showBot)) }}></i>
                            </div>
                        </div>
                        <div className="card-body text-dark bg-dark m-1 conversation-area" id="con-area">
                            {this.state.responses.filter(a => a.userDetails.userEmail == this.state.user.userEmail).length == 0 ?
                                <div className=" text-light justify-content-center">
                                    <p className="text-center">Start conversation saying "Hi / Hello" </p>
                                </div>
                                :
                                this.state.responses.filter(a => a.userDetails.userEmail == this.state.user.userEmail).map(a => {
                                    return (
                                        <div key={a.id}>
                                            {/* User */}
                                            <div className="row">
                                                <div className="col-4"></div>
                                                <div id="userInput" className="my-1 col-8 ">
                                                    <span className="bg-warning align-self-end  float-end"> {a.userMessage}
                                                        <span className="bg-warning align-self-end  float-end text-muted fst-italic fw-bold" style={{ fontSize: "12px" }}> {a.userMessagedAt}</span>
                                                    </span>
                                                </div>
                                            </div>
                                            {/* Bot */}
                                            <div className="row mx-1">
                                                <div id="botOutput" className="my-1 col-8 bg-info ">
                                                    <div className=" align-self-start">
                                                        {a.botMessage.includes("http") ?
                                                            a.botMessage.length > 70 ? <>
                                                                <div className="justify-content-center d-flex">
                                                                    <img className="w-50 h-50 " src={a.botMessage.substr(a.botMessage.indexOf("http"))} /><br></br>
                                                                </div>
                                                                {a.botMessage.substr(0, a.botMessage.indexOf("http")).trim()}
                                                            </> :
                                                                <>
                                                                    <span>{a.botMessage.substr(0, a.botMessage.indexOf("http")).trim()}</span>&nbsp;
                                                                    <a href={a.botMessage.substr(a.botMessage.indexOf("http"))} className="btn btn-sm btn-primary">
                                                                        {a.botMessage.substr(a.botMessage.indexOf("3000/") + 5).toUpperCase()}
                                                                    </a>
                                                                </>
                                                            : a.botMessage
                                                        }</div>
                                                    <div className=" align-self-end float-end text-muted fst-italic fw-bold" style={{ fontSize: "12px" }}>{a.botReturnedAt}</div>
                                                </div>
                                                <div className="col-4"></div>
                                            </div>
                                        </div>
                                    )
                                })
                            }
                            <i className="bi bi-arrow-down-circle-fill  text-white  down-arrow-bot"
                                onClick={() => {
                                    document.getElementById("con-area").scrollTop =
                                        document.getElementById("con-area").scrollHeight - document.getElementById("con-area").clientHeight;
                                }}
                            ></i>
                        </div>
                        <div className="card-footer">
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    this.getResponses(document.getElementById("con-area"));
                                    return (
                                        this.sendResponse()
                                    )
                                }}>
                                <div className="row inputBot">
                                    <div className="col-10">
                                        <input type="text" className="a form-control bg-dark text-light" id="userInput" placeholder="Ask me a Question...."
                                            value={this.state.userMessage}
                                            onClick={() => { return (this.getResponses(document.getElementById("con-area"))) }}
                                            onChange={(e) => { return (this.setMessage(e.target.value)) }}
                                        />
                                    </div>
                                    <div className="col-2 text-white" >
                                        <i className="b bi bi-send-fill bg-dark"
                                            onClick={() => {
                                                this.sendResponse()
                                                return (
                                                    this.getResponses()
                                                )
                                            }}
                                        ></i>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
                    :
                    <div className="chat-bot" onClick={() => {
                        this.callBot(this.state.showBot)
                    }}>
                        <i className="bi bi-chat-left-text-fill text-light bg-black bot-icon"></i>
                    </div>}
            </div>
        )
    }
}
export default ChatBot;