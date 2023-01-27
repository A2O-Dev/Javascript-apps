import React, { useEffect } from "react";
import {
    BrowserRouter as Router,
    Switch
} from "react-router-dom";
import { useDispatch } from "react-redux";
import { startLogin } from "../actions/auth";
import Navbar from "../components/ui/Navbar";

const AppRouter = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch( startLogin() );
    }, []);

    return (
        <Router>
            <div style={{width: '100%',overflow:"hidden"}}>
                <Switch>
                    <Navbar />
                </Switch>
            </div>
        </Router>
    );
}

export default AppRouter;