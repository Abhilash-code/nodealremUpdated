module.exports = validateRequest;
// const fs = require("fs");
function validateRequest(req, next, schema) {
    const options = {
        abortEarly: false, // include all errors
        allowUnknown: true, // ignore unknown
        stripUnknown: true // remove unknown
    };
    const { error, value } = schema.validate(req.body, options);
    if (error) {
      // console.log("check");

      // fs.unlinkSync(process.env.BASE_URL + req.file.filename);
        next(`Validation error: ${error.details.map(x => x.message).join(', ')}`);
    } else {
        req.body = value;
        next();
    }
}
