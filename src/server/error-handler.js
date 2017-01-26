var pattern = require("matches").pattern;


// development error handler
// will print stacktrace
export const DevErrorHandle = (err, req, res) => {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: err
    });
};

// production error handler
// no stacktraces leaked to user
export const ProdErrorHandle = (err, req, res) => {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
};


export const ErrorHandler = pattern({
    '"InvalidStateError"': () => res.status(500).send({
        message: 'Invalid authentication parameters sent'
    }),
    '"AuthenticationError"': () => res.status(401).send({
        message: 'Invalid authentication parameters sent'
    })
});