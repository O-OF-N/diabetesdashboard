"use strict";
import express from 'express';
import React from 'react';
import ReactDomServer from 'react-dom/server';
import Component from '../index';
import * as AuthorizationHelper from '../helper/authorization-helper';
import co from '../util/wrap';
import * as Exceptions from '../util/exceptions';
import * as ErrorHandler from '../error-handler';
import { get } from '../service/http-service'
import * as Records from '../models/models';
import * as Constants from '../util/constants';

const router = express.Router();

router.get('/', co(function* (req, res, next) {
    try {
        let iss = null, launch = null;
        ({ iss, launch } = req.query);
        if (iss && launch) {
            const url = yield AuthorizationHelper.authorize(iss, launch);
            res.redirect(url);
        } else {
            ErrorHandler.ErrorHandler("AuthenticationError", res, "Invalid authentication parameters sent");
        }
    } catch (err) {
        console.log('err = ' + err);
        ErrorHandler.ErrorHandler("InternalServerError", res, err.message);
    }
}));

router.get('/callback', co(function* (req, res, next) {
    try {
        let code = null, state = null, accessToken = null, patient = 0;
        ({ code, state } = req.query);
        const authentication = yield AuthorizationHelper.accessToken(code, state);
        if (!authentication.authenticated) {
            const url = yield AuthorizationHelper.authorize(authentication.iss, authentication.launch);
            res.redirect(url);
        }
        else
            res.send(handleRenderer(authentication.state));
    } catch (err) {
        console.log('err = ' + err);
        next(err);
    }
}));

const handleRenderer = (state) => {
    const html = ReactDomServer.renderToString(
        React.createElement(Component)
    );
    return renderFullPage(renderFullPage(html, state))
}

const renderFullPage = (html, state) => {
    return `
    <!doctype html>
    <html style="width:100%;height:100%">
      <head>
        <title>Diabetes Dashboard</title>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <script type="text/javascript">  
            function evaluate(x) {
                return eval(x);
            }
            window.__PRELOADED_STATE__ = '${state}'
        </script>
      </head>
      <body style="width:inherit;height:inherit">
        <div id="root-app" style="width:inherit;height:inherit">${html}</div>
      </body>
    </html>
    `
};

export default router;