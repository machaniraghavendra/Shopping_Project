import "../ChatBot/chatBot.css"
import axios from "axios"
import { React, Component } from "react";
import { Link, useNavigate } from "react-router-dom";


class ChatBot extends Component {
    constructor(props) {
        super(props);
        axios.get("http://localhost:8083/user/userid/" + localStorage.getItem("currentuser")).then(a => { return (this.setUser(a.data)) }).catch((error) => { this.setErrorMessage(error) });
        this.getResponses()
        this.state = {
            showBot: false,
            userMessage: "",
            user: [],
            responses: [],
            errorMessage: "",
            error: false
        };
    }

    setUser = (user) => {
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

    setErrorMessage(error) {
        this.setState({
            error: true
        })
        if (error.response === undefined) {
            this.setState({
                errorMessage: "Something went wrong"
            })
        } else {
            this.setState({
                errorMessage: error.response.data.message + " ,error with status = '" + error.response.data.status + "'"
            });
        }
    }

    clearError() {
        this.setState({
            error: true,
            errorMessage: ""
        })
    }

    getResponses(height) {
        axios.get("http://localhost:8083/bot/")
            .then((a) => { this.setResponses(a.data) })
            .catch((error) => { this.setErrorMessage(error) });
        if (height) {
            height.scrollTop = height.scrollHeight - height.clientHeight;
        }
    }

    clearResponses() {
        axios.post("http://localhost:8083/bot/" + this.state.user.userId)
            .catch((error) => { this.setErrorMessage(error) });
    }

    sendResponse() {
        axios.post("http://localhost:8083/bot/", {
            "userDetails": {
                "userName": this.state.user.userName,
                "userEmail": this.state.user.userEmail,
                "userId": localStorage.getItem("currentuser"),
                "mobileNumber": this.state.user.mobileNumber
            },
            "userMessage": this.state.userMessage
        }).catch((error) => { this.setErrorMessage(error) });
        let height = document.getElementById("con-area")
        this.getResponses(height);
        this.setMessage("");
    }

    viewOrder = (e) => {
        axios.get("http://localhost:8083/orders/saveorder/" + e);
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
                                {this.state.responses.filter(a => a.userDetails.userId == this.state.user.userId).length == 0 ?
                                    <div className=" text-light justify-content-center">
                                        <p className="text-center">Start conversation saying "Hi / Hello" </p>
                                    </div>
                                    :
                                    this.state.responses.filter(a => a.userDetails.userId == this.state.user.userId).map(a => {
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
                                                                    <div className="justify-content-center d-block">
                                                                       <Link to={'/orderDetails'}> <img className="w-50 h-50 " src={a.botMessage.substr(a.botMessage.indexOf("http"))}  onClick={()=>{this.viewOrder(a.userMessage.split(" "))}}/></Link><br></br>
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
                                                        <div className="align-self-end float-end text-muted fst-italic fw-bold" style={{ fontSize: "12px" }}>{a.botReturnedAt}</div>
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

                {/* Error pop */}
                {this.state.errorMessage && <>
                    <div className="toast fade show" role="alert" aria-live="assertive" aria-atomic="true">
                        <div className="d-flex">
                            <div className="toast-body text-danger text-center">
                                <h6>Error !</h6>
                                {this.state.errorMessage}
                                <div className="mt-2 pt-2">
                                    <button type="button" className="btn btn-outline-light btn-sm" data-bs-dismiss="toast" onClick={() => { this.clearError() }}>Ok</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
                }
            </div>
        )
    }
}
export default ChatBot;