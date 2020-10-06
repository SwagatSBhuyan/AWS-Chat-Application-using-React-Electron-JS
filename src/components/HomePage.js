import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
// import { tableCount } from './tableCount.json';
import './HomePage.css';


// import {Storage, API, graphqlOperation } from 'aws-amplify';
// import { createTodo } from '../graphql/mutations';
// import awsExports from "../aws-exports";


var AWS = require("aws-sdk");

var table = "ChatLog";
var newChatId = 0;

var currentAlias;
var toggle = false;


    
AWS.config.update({
    accessKeyId: "AKIA4N3GPTT5EQHHDCPM",
    secretAccessKey: "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",
    region: "ap-south-1",
    endpoint: "dynamodb.ap-south-1.amazonaws.com"
});

var docClient = new AWS.DynamoDB.DocumentClient();

var params = {
    TableName: table
};

console.log("Scanning ToolboxVR_Login table.....");
docClient.scan(params, onScan);

function onScan(err, data) 
{
    if (err) {
        console.error("Unable to scan the table. Error JSON:", JSON.stringify(err, null, 2));
    } 
    else 
    {
        console.log("Scan Succeeded!");
        data.Items.forEach(function(toolbox) {
            console.log(toolbox.chatid);
            if (toolbox.chatid > newChatId) {
                newChatId = toolbox.chatid;
            }
        });  
        newChatId = newChatId + 1; 
    }
}


newChatId = newChatId + 1;
class HomePage extends React.Component {

    sendmsg() {
        var msg = document.getElementById("textarea").value;
        var alias = document.getElementById("alias").value;
        console.log(msg + " SENDING MESSAGE....");
        document.getElementById("textarea").value = "";

        var msgblock = document.getElementById("msgblk");
        var msgdiv = document.createElement('Navbar');
        var msgjoin = document.createElement('div');
        msgjoin.className = 'joint';
        msgjoin.innerHTML = alias;
        var linebreak = document.createElement('br');

        if (currentAlias !== alias) {
            toggle = !toggle;
            currentAlias = alias;
            msgblock.appendChild(msgjoin);
            msgblock.appendChild(linebreak);
        }
        msgdiv.innerHTML = alias + ": " + msg;
    
        while (msgdiv.firstChild) {
            msgblock.appendChild(msgdiv.firstChild);
            msgblock.appendChild(linebreak);
        }

        var params = {
            TableName:table,
            Item:{
                "chatid": newChatId,
                "username": alias,
                "message": msg
            }
        };
        
        console.log("Adding a new item...");
        docClient.put(params, function(err, data) {
            if (err) {
                console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
            } else {
                console.log("Added item:", JSON.stringify(data, null, 2));
            }
            newChatId = newChatId + 1;
        });
    }
    
    render() {
        return (
            <div>
                <Navbar>
                    <input type = "text" id = "alias" placeholder = "your alias" autoFocus />
                </Navbar> 
                <p id = "msgblk" className = "messageBlock">

                </p>
                <Navbar>
                    <textarea id="textarea" placeholder = "Enter message...." />
                    <button onClick = {this.sendmsg}> SEND MESSAGE </button>
                </Navbar> 
            </div>
        )
    }
}

export default HomePage;