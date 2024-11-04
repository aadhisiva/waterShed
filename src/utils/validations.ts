// Create a middleware function
export function saveSurveyValuesSanitize(req, res, next) {
    const { FruitsId, UnitHa, UnitNos, MobileNumber } = req.body;

    // Regex for 'name' - allows only captial alphabets and numbers
    const fruitsIdRegex = /^(?=.*[A-Z])(?=.*\d).+$/;
    // if (FruitsId && !fruitsIdRegex.test(FruitsId)) {
    //   return res.status(200).json({code: 422, message: "'FruitsId' is required and must be combination of captail letters and numbers" });
    // }
  
    // Check if 'UnitHa' is provided and is in valid format
    // const unitHaRegex = /^\s*\d+(\.\d+)?\s*$/;
    // if (UnitHa && !unitHaRegex.test(UnitHa)) {
    //   return res.status(200).send({code: 422, message: "'UnitHa' is required and must be in numbers" });
    // }
  
    // // Check if 'UnitNos' is provided and is in valid format
    // const unitNosRegex = /^\s*\d+(\.\d+)?\s*$/;
    // if (UnitNos && !unitNosRegex.test(UnitNos)) {
    //   return res.status(200).send({code: 422, message: "'UnitNos' is required and must be in numbers" });
    // };
  
    // // Check if 'MobileNumber' is provided and is in valid format
    // const mobileRegex = /^\d{10}$/;
    // if (MobileNumber && !mobileRegex.test(MobileNumber)) {
    //   return res.status(200).send({code: 422, message: "'MobileNumber' is required and must be 10 digits" });
    // };
    // If all validations pass, proceed to the next middleware
    next();
  }