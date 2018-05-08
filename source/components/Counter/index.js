import React from "react";
import Styles from "./styles.m.css";

const Counter = ({ count }) => (
    <p className = { Styles.counter }>Post count: {count}</p>
);

export default Counter;
