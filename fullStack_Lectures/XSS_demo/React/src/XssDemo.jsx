import React, { useState } from "react";
import { Helmet } from "react-helmet";

const XSSDemo = () => {
    const [userInput, setUserInput] = useState("");

    const handleChange = (e) => {
        setUserInput(e.target.value);
    };

    return (
        <div>
            <h1>React XSS Demo</h1>

            {/* <Helmet>            */}
                 <input
                type="text"
                onChange={handleChange}
                placeholder="Enter something..."
            />
            {/* </Helmet> */}

            <p><strong>Output:</strong></p>
            {/* 🚨 VULNERABLE: Directly inserting user input as HTML */}
            <div dangerouslySetInnerHTML={{ __html: userInput }} />


            <div>
                <br />
                <br />
                <br />
                <hr />
                <p>Attack Vectors</p>
                <p>{`<button onclick=alert('XSS')>Click me</button>`}</p>
                <p>{`<svg/onload=alert('XSS')>`}</p>
                <p>{`<div style="width:100px;height:100px;background:red" onmouseover="alert('XSS')">Hover over me</div>
`}</p>
                <p>{`<img src=x onerror=alert('XSS')>`}</p>
                <p>{`<button onclick=alert('XSS')>Click Me</button>`}</p>
                <p>{`<input type="text" onfocus="alert('XSS')">`}</p>
                <p>{`<input type="text" value="Try cutting this" oncut="alert('XSS')"><input type="text" value="Try pasting here" onpaste="alert('XSS')">
 `}</p>






            </div>

        </div>
    );
};

export default XSSDemo;