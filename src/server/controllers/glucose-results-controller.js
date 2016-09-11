import express from 'express';
import {get} from '../service/http-service'
import co from '../util/wrap';
import * as GlucoseHelper from '../helper/glucose-resource-helper';
import * as Records from '../models/models';

const router = express.Router();

router.get('/glucose', co(function* (req, res, next) {
    try {
        const result = yield get(Constants.OBSERVATIONS_FETCH_URL, new Records.AuthorizationHeader());
        const glucose = GlucoseHelper.fetchGlucoseResults(result);
        res.send(glucose);
    } catch (err) {
        console.log('err = ' + err);
        next(err);
    }
}));

export default router;