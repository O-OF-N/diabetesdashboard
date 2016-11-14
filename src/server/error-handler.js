var pattern = require("matches").pattern;


// development error handler
// will print stacktrace
export const DevErrorHandle = (err, req, res) => {
    res.status(err.status || 500);
    res.render('error', {
        message: err
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
    '"InvalidStateError",req,res,params': (req, res, params) =>
        res.status(500).send({
            message: 'Invalid authentication parameters sent'
        })
});