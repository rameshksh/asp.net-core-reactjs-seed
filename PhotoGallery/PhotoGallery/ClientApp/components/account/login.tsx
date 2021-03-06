﻿import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { Link, NavLink } from 'react-router-dom';

export class LoginComponent extends React.Component<RouteComponentProps<{}>, {}> {
    public render() {
        return <div id="loginModal" className="modal show" role="dialog" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <button type="button" className="close" data-dismiss="modal" aria-hidden="true">×</button>
                        <h1 className="text-center">
                            <span className="fa-stack fa-1x">
                                <i className="fa fa-circle fa-stack-2x text-primary"></i>
                                <i className="fa fa-user fa-stack-1x fa-inverse"></i>
                            </span>Login
                                 </h1>
                    </div>
                    <div className="modal-body">
                        <form className="form col-md-12 center-block">
                            <div className="form-group">
                                <input type="text" className="form-control input-lg" placeholder="Username"
                                    name="username" id="username" required />
                                <div className="alert alert-danger">
                                    Username is required
                                </div>
                            </div>
                            <div className="form-group">
                                <input type="password" className="form-control input-lg" placeholder="Password"
                                    name="password" id="password" required />
                                <div className="alert alert-danger">
                                    Password is required
                                 </div>
                            </div>
                            <div className="form-group">
                                <button className="btn btn-primary btn-lg btn-block" onClick={ () => { this.login()}}>Sign In</button>
                                <span className="pull-right">
                                    <NavLink to={'/account/register'}>
                                        Register
                                    </NavLink>
                                </span>
                            </div>
                            <div className="checkbox">
                                <label>
                                    <input type="checkbox" name="remember" /> Remember me
                                    </label>
                            </div>
                        </form>
                    </div >
                    <div className="modal-footer">
                        <div className="col-md-12">
                            <NavLink to={'/home'} className="btn btn-danger pull-left" data-dismiss="modal" aria-hidden="true">
                                Cancel
                             </NavLink>
                        </div>
                    </div >
                </div >
            </div >
        </div >;
    }

    login() {

    }
}